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
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlData);

        // Based on the observed structure: ApiResponse -> data -> ActiveClientDto[]
        const clientsList = jsonObj?.ApiResponse?.data?.ActiveClientDto;

        if (!clientsList || (Array.isArray(clientsList) && clientsList.length === 0)) {
            console.log("[INVOICE_SYNC] No clients found in source.");
            return ok({
                count: 0,
                message: "No clients found in source (Empty Data).",
            });
        }

        // Handle single client wrap if fast-xml-parser doesn't force array
        const clientsArray = Array.isArray(clientsList) ? clientsList : [clientsList];

        let importCount = 0;
        let conflictCount = 0;

        console.log(`[INVOICE_SYNC] Processing ${clientsArray.length} clients...`);

        // 3. Upsert logic: Handle with care
        for (const rawClient of clientsArray) {
            try {
                const externalId = String(rawClient.customerid);
                const email = rawClient.Client_Email?.trim();

                if (!email || !externalId) continue;

                const isRoleBased = isRoleBasedEmail(email);

                const parseDateStr = (dateStr: any) => {
                    if (!dateStr || typeof dateStr !== "string") return null;
                    
                    // Standard JS Date constructor is usually good, but we ensure it handles the specific format
                    // e.g., "10/30/2025 12:00:00 AM"
                    const parsed = new Date(dateStr);
                    if (!isNaN(parsed.getTime())) return parsed;

                    // Fallback for non-standard formats if needed
                    console.warn(`[INVOICE_SYNC] Standard parsing failed for: ${dateStr}. Attempting manual fallbacks...`);
                    return null;
                };

                await prisma.client.upsert({
                    where: {
                        source_externalId: {
                            source: "INVOICE_SYSTEM",
                            externalId: externalId
                        }
                    },
                    update: {
                        clientName: String(rawClient.ClientName || "Unknown Client"),
                        contactPerson: rawClient.ContactPerson ? String(rawClient.ContactPerson) : null,
                        email: email,
                        primaryEmail: email.split(',')[0].trim(), // Keep it for compatibility if needed, though unused in UI
                        isRoleBased: isRoleBased,
                        phone: rawClient.Client_TPhone ? String(rawClient.Client_TPhone).substring(0, 100) : null,
                        mobile: rawClient.Client_Mobile ? String(rawClient.Client_Mobile).substring(0, 100) : null,
                        gstin: rawClient.Client_GSTIN ? String(rawClient.Client_GSTIN).substring(0, 50) : null,
                        clientSize: rawClient.ClientSize ? String(rawClient.ClientSize).substring(0, 50) : null,
                        poc: rawClient.POC ? String(rawClient.POC).substring(0, 100) : null,
                        address: rawClient.ClientAddress ? String(rawClient.ClientAddress).substring(0, 500) : null,
                        lastInvoiceDate: parseDateStr(rawClient.LastInvoiceDate),
                        clientAddedOn: parseDateStr(rawClient.Client_AddedOn),
                        invoiceServiceNames: rawClient.ServiceNames ? String(rawClient.ServiceNames).substring(0, 200) : null,
                        services: rawClient.ServiceNames ? {
                            connectOrCreate: String(rawClient.ServiceNames).split(',').map(s => s.trim()).filter(Boolean).map(serviceName => ({
                                where: { serviceName },
                                create: { serviceName, industry: "Corporate" }
                            }))
                        } : undefined
                    },
                    create: {
                        clientName: String(rawClient.ClientName || "Unknown Client"),
                        contactPerson: rawClient.ContactPerson ? String(rawClient.ContactPerson) : null,
                        email: email,
                        primaryEmail: email.split(',')[0].trim(),
                        industry: "Corporate", 
                        relationshipLevel: "Active",
                        source: "INVOICE_SYSTEM",
                        externalId: externalId,
                        isRoleBased: isRoleBased,
                        phone: rawClient.Client_TPhone ? String(rawClient.Client_TPhone).substring(0, 100) : null,
                        mobile: rawClient.Client_Mobile ? String(rawClient.Client_Mobile).substring(0, 100) : null,
                        gstin: rawClient.Client_GSTIN ? String(rawClient.Client_GSTIN).substring(0, 50) : null,
                        clientSize: rawClient.ClientSize ? String(rawClient.ClientSize).substring(0, 50) : null,
                        poc: rawClient.POC ? String(rawClient.POC).substring(0, 100) : null,
                        address: rawClient.ClientAddress ? String(rawClient.ClientAddress).substring(0, 500) : null,
                        lastInvoiceDate: parseDateStr(rawClient.LastInvoiceDate),
                        clientAddedOn: parseDateStr(rawClient.Client_AddedOn),
                        invoiceServiceNames: rawClient.ServiceNames ? String(rawClient.ServiceNames).substring(0, 200) : null,
                        services: rawClient.ServiceNames ? {
                            connectOrCreate: String(rawClient.ServiceNames).split(',').map(s => s.trim()).filter(Boolean).map(serviceName => ({
                                where: { serviceName },
                                create: { serviceName, industry: "Corporate" }
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
