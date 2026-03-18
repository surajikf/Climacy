import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { XMLParser } from "fast-xml-parser";
import { ok, error } from "@/lib/api-response";

export async function POST(req: Request) {
    try {
        const token = await getToken({
            req: req as any,
            secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret",
        });

        if (!token || token.role !== "ADMIN") {
            return error(
                "FORBIDDEN",
                "Unauthorized access. Level-5 Clearance Required.",
                { status: 403 },
            );
        }

        console.log("[INVOICE_SYNC] Starting sync from internal API...");

        // 1. Fetch data from the internal ASMX Service
        // Using a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(
            "http://192.168.2.79/invoice/api/ApiService.asmx/GetActiveClients",
            {
            headers: {
                "Accept": "application/xml"
            },
            signal: controller.signal,
            next: { revalidate: 0 }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch from Invoice System: ${response.statusText}`,
            );
        }

        const xmlData = await response.text();

        // 2. Parse XML to JSON
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const jsonObj = parser.parse(xmlData);

        // Recursive helper to find the array of clients wherever it is in the JSON
        const findClientsRecursive = (obj: any): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            
            // Look for ActiveClientDto or ArrayOfActiveClientDto or just any list containing ClientName
            if (obj.ActiveClientDto) {
                return Array.isArray(obj.ActiveClientDto) ? obj.ActiveClientDto : [obj.ActiveClientDto];
            }
            
            // If the object itself looks like a client (has a name or id)
            if (obj.ClientName || obj.clientname || obj.Customerid || obj.customerid) {
                return [obj];
            }

            for (const key of Object.keys(obj)) {
                // Skip primitive values
                if (typeof obj[key] !== 'object') continue;
                
                const found = findClientsRecursive(obj[key]);
                if (found) return found;
            }
            return null;
        };

        const clientsArray = findClientsRecursive(jsonObj) || [];

        if (clientsArray.length === 0) {
            console.log("[INVOICE_SYNC] No clients found in source JSON structure.");
            // Log structure for debugging if we find nothing
            console.log("Structure keys:", Object.keys(jsonObj));
            return ok({
                count: 0,
                message: "No clients found in source (Empty Data).",
            });
        }

        let importCount = 0;
        let conflictCount = 0;

        console.log(`[INVOICE_SYNC] Processing ${clientsArray.length} clients...`);

        // Helper to find a value by case-insensitive key and handle object wraps from XML parser
        const findValue = (obj: any, targetKey: string) => {
            if (!obj || typeof obj !== 'object') return null;
            
            // Find the actual key in the object that matches targetKey case-insensitively
            const actualKey = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
            if (!actualKey) return null;
            
            const value = obj[actualKey];
            
            // Handle array of strings (common in multiple XML tags of same name)
            if (Array.isArray(value)) {
                return value.map(v => (typeof v === 'object' ? (v['#text'] || v['text'] || JSON.stringify(v)) : v)).join(", ");
            }
            
            // Handle if fast-xml-parser wrapped it in an object
            if (value && typeof value === 'object') {
                return value['#text'] || value['text'] || String(value);
            }
            
            return value;
        };

        // 3. Upsert logic: Handle with care
        for (const rawClient of clientsArray) {
            try {
                const externalId = String(findValue(rawClient, 'customerid') || "");
                const email = String(findValue(rawClient, 'Client_Email') || findValue(rawClient, 'email') || "").trim();

                if (!email || !externalId) continue;

                const isRoleBased = isRoleBasedEmail(email);

                const parseDateStr = (dateStr: any) => {
                    if (!dateStr) return null;
                    const ds = String(dateStr);
                    const parsed = new Date(ds);
                    if (!isNaN(parsed.getTime())) return parsed;
                    return null;
                };

                const serviceVal = findValue(rawClient, 'ServiceNames') || findValue(rawClient, 'serviceNames');
                const serviceStr = serviceVal ? String(serviceVal) : null;
                const lastContact = parseDateStr(findValue(rawClient, 'LastContacted')) || parseDateStr(findValue(rawClient, 'lastcontacted'));

                await prisma.client.upsert({
                    where: {
                        source_externalId: {
                            source: "INVOICE_SYSTEM",
                            externalId: externalId
                        }
                    },
                    update: {
                        clientName: String(findValue(rawClient, 'ClientName') || findValue(rawClient, 'clientname') || "Unknown Client"),
                        contactPerson: findValue(rawClient, 'ContactPerson') ? String(findValue(rawClient, 'ContactPerson')) : null,
                        email: email,
                        primaryEmail: email.split(',')[0].trim(),
                        isRoleBased: isRoleBased,
                        phone: findValue(rawClient, 'Client_TPhone') ? String(findValue(rawClient, 'Client_TPhone')).substring(0, 100) : null,
                        mobile: findValue(rawClient, 'Client_Mobile') ? String(findValue(rawClient, 'Client_Mobile')).substring(0, 100) : null,
                        gstin: findValue(rawClient, 'Client_GSTIN') ? String(findValue(rawClient, 'Client_GSTIN')).substring(0, 50) : null,
                        clientSize: findValue(rawClient, 'ClientSize') ? String(findValue(rawClient, 'ClientSize')).substring(0, 50) : null,
                        poc: findValue(rawClient, 'POC') ? String(findValue(rawClient, 'POC')).substring(0, 100) : null,
                        address: findValue(rawClient, 'ClientAddress') ? String(findValue(rawClient, 'ClientAddress')).substring(0, 500) : null,
                        lastInvoiceDate: parseDateStr(findValue(rawClient, 'LastInvoiceDate')),
                        lastContacted: lastContact,
                        clientAddedOn: parseDateStr(findValue(rawClient, 'Client_AddedOn')),
                        invoiceServiceNames: serviceStr ? serviceStr.substring(0, 200) : null,
                        services: serviceStr ? {
                            connectOrCreate: serviceStr.split(',').map(s => s.trim()).filter(Boolean).map(serviceName => ({
                                where: { serviceName },
                                create: { serviceName, category: "Corporate" }
                            }))
                        } : undefined
                    },
                    create: {
                        clientName: String(findValue(rawClient, 'ClientName') || findValue(rawClient, 'clientname') || "Unknown Client"),
                        contactPerson: findValue(rawClient, 'ContactPerson') ? String(findValue(rawClient, 'ContactPerson')) : null,
                        email: email,
                        primaryEmail: email.split(',')[0].trim(),
                        industry: "Corporate", 
                        relationshipLevel: "Active",
                        source: "INVOICE_SYSTEM",
                        externalId: externalId,
                        isRoleBased: isRoleBased,
                        phone: findValue(rawClient, 'Client_TPhone') ? String(findValue(rawClient, 'Client_TPhone')).substring(0, 100) : null,
                        mobile: findValue(rawClient, 'Client_Mobile') ? String(findValue(rawClient, 'Client_Mobile')).substring(0, 100) : null,
                        gstin: findValue(rawClient, 'Client_GSTIN') ? String(findValue(rawClient, 'Client_GSTIN')).substring(0, 50) : null,
                        clientSize: findValue(rawClient, 'ClientSize') ? String(findValue(rawClient, 'ClientSize')).substring(0, 50) : null,
                        poc: findValue(rawClient, 'POC') ? String(findValue(rawClient, 'POC')).substring(0, 100) : null,
                        address: findValue(rawClient, 'ClientAddress') ? String(findValue(rawClient, 'ClientAddress')).substring(0, 500) : null,
                        lastInvoiceDate: parseDateStr(findValue(rawClient, 'LastInvoiceDate')),
                        lastContacted: lastContact,
                        clientAddedOn: parseDateStr(findValue(rawClient, 'Client_AddedOn')),
                        invoiceServiceNames: serviceStr ? serviceStr.substring(0, 200) : null,
                        services: serviceStr ? {
                            connectOrCreate: serviceStr.split(',').map(s => s.trim()).filter(Boolean).map(serviceName => ({
                                where: { serviceName },
                                create: { serviceName, category: "Corporate" }
                            }))
                        } : undefined
                    }
                });
                importCount++;
            } catch (err) {
                console.error(`[INVOICE_SYNC] Error processing client ${rawClient.customerid}:`, err);
                conflictCount++;
            }
        }

        console.log(`[INVOICE_SYNC] Completed. Imported/Updated: ${importCount}, Errors: ${conflictCount}`);

        return ok({
            count: importCount,
            conflicts: conflictCount,
            debug: clientsArray[0] || null
        });
    } catch (err: any) {
        console.error("Invoice Sync Error:", err);
        return error(
            "INTEGRATION_ERROR",
            err.message || "Internal Server Error during synchronization.",
            {
                status: 502,
                details: { message: err.message },
            },
        );
    }
}
