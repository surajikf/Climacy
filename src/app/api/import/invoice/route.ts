import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { XMLParser } from "fast-xml-parser";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.user_metadata?.role !== "ADMIN") {
            return error(
                "FORBIDDEN",
                "Unauthorized access. Level-5 Clearance Required.",
                { status: 403 },
            );
        }

        console.log("[INVOICE_SYNC] Starting sync from internal API...");

        const INVOICE_BASE_URL = "http://192.168.2.79/invoice/api/ApiService.asmx/GetClients";
        const REQUEST_TIMEOUT_MS = 30000; // 30s per status fetch (invoice server can be slow)
        const urlObj = new URL(req.url);
        const mode = (urlObj.searchParams.get("mode") || "fast").toLowerCase(); // fast | both | activeOnly

        // 1. Fetch data from internal ASMX Service (Y=Active, N=Not Active)
        const fetchClientsByStatus = async (status: "Y" | "N") => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            try {
                const url = `${INVOICE_BASE_URL}?status=${encodeURIComponent(status)}`;
                const response = await fetch(url, {
                    headers: {
                        "Accept": "application/xml",
                    },
                    signal: controller.signal,
                    next: { revalidate: 0 },
                });

                if (!response.ok) {
                    throw new Error(`Invoice API failed (${status}): ${response.statusText}`);
                }

                const xmlData = await response.text();

                // Parse XML to JSON
                const parser = new XMLParser({
                    ignoreAttributes: false,
                    attributeNamePrefix: "@_",
                });
                const jsonObj = parser.parse(xmlData);

                return { status, jsonObj };
            } catch (err: any) {
                const msg =
                    err?.name === "AbortError"
                        ? `Invoice API request aborted (${status}) after ${REQUEST_TIMEOUT_MS}ms`
                        : `Invoice API request failed (${status}): ${err?.message || String(err)}`;
                console.error("[INVOICE_SYNC]", msg);
                throw new Error(msg);
            } finally {
                clearTimeout(timeoutId);
            }
        };

        // Fast mode: sync Active (Y) now, and Not Active (N) best-effort in background.
        const shouldFetchNNow = mode === "both";
        const shouldSkipN = mode === "activeonly";

        const yRes = await fetchClientsByStatus("Y");
        const statusY = yRes.status;
        const jsonObjY = yRes.jsonObj;

        let statusN = "N";
        let jsonObjN: any = {};
        let notActiveFetched = false;

        if (!shouldSkipN && shouldFetchNNow) {
            try {
                const nRes = await fetchClientsByStatus("N");
                statusN = nRes.status;
                jsonObjN = nRes.jsonObj;
                notActiveFetched = true;
            } catch (e) {
                notActiveFetched = false;
            }
        }

        // Recursive helper to find the array of clients wherever it is in the JSON
        const findClientsRecursive = (obj: any): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            
            // Look for common DTO containers
            if (obj.ActiveClientDto) {
                return Array.isArray(obj.ActiveClientDto) ? obj.ActiveClientDto : [obj.ActiveClientDto];
            }
            if (obj.ClientDto) {
                return Array.isArray(obj.ClientDto) ? obj.ClientDto : [obj.ClientDto];
            }
            if (obj.Client) {
                return Array.isArray(obj.Client) ? obj.Client : [obj.Client];
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

        const activeArray = (findClientsRecursive(jsonObjY) || []).map((c) => ({ ...c, invoiceStatus: statusY }));
        const notActiveArray = !shouldSkipN
            ? (findClientsRecursive(jsonObjN) || []).map((c) => ({ ...c, invoiceStatus: statusN }))
            : [];
        const clientsArray = [...activeArray, ...notActiveArray];

        if (clientsArray.length === 0) {
            console.log("[INVOICE_SYNC] No clients found in source JSON structure.");
            // Log structure for debugging if we find nothing
            console.log("Structure keys (Y):", Object.keys(jsonObjY || {}));
            console.log("Structure keys (N):", Object.keys(jsonObjN || {}));
            return ok({
                count: 0,
                message: "No clients found in source (Empty Data).",
            });
        }

        let importCount = 0;
        let conflictCount = 0;

        console.log(`[INVOICE_SYNC] Processing ${clientsArray.length} clients...`);

        const UPSERT_CONCURRENCY = 20;

        const runPool = async <T,>(
            items: T[],
            limit: number,
            worker: (item: T, index: number) => Promise<void>
        ) => {
            const executing = new Set<Promise<void>>();
            for (let i = 0; i < items.length; i++) {
                const p = worker(items[i], i).finally(() => executing.delete(p));
                executing.add(p);
                if (executing.size >= limit) {
                    await Promise.race(executing);
                }
            }
            await Promise.allSettled(Array.from(executing));
        };

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

        const parseDateStr = (dateStr: any) => {
            if (!dateStr) return null;
            const ds = String(dateStr);
            const parsed = new Date(ds);
            if (!isNaN(parsed.getTime())) return parsed;
            return null;
        };

        const upsertOne = async (rawClient: any) => {
            const externalId = String(findValue(rawClient, 'customerid') || "");
            const email = String(findValue(rawClient, 'Client_Email') || findValue(rawClient, 'email') || "").trim();

            if (!email || !externalId) return;

            const isRoleBased = isRoleBasedEmail(email);
            const invoiceStatus = String((rawClient as any).invoiceStatus || "Y").toUpperCase() === "N" ? "N" : "Y";
            const relationshipLevel = invoiceStatus === "Y" ? "Active" : "Not Active";

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
                    relationshipLevel,
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
                    relationshipLevel,
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
        };

        // 3. Upsert logic (parallel, concurrency-limited)
        await runPool(clientsArray, UPSERT_CONCURRENCY, async (rawClient) => {
            try {
                await upsertOne(rawClient);
                importCount++;
            } catch (err) {
                console.error(`[INVOICE_SYNC] Error processing client ${rawClient?.customerid || rawClient?.Customerid || "unknown"}:`, err);
                conflictCount++;
            }
        });

        console.log(`[INVOICE_SYNC] Completed. Imported/Updated: ${importCount}, Errors: ${conflictCount}`);

        // Kick off background N sync if in fast mode and not skipped
        if (!shouldSkipN && !shouldFetchNNow) {
            void (async () => {
                try {
                    console.log("[INVOICE_SYNC] Fast mode: starting background Not Active (N) sync...");
                    const nRes = await fetchClientsByStatus("N");
                    const bgStatusN = nRes.status;
                    const bgJsonObjN = nRes.jsonObj;
                    const bgNotActive = (findClientsRecursive(bgJsonObjN) || []).map((c) => ({ ...c, invoiceStatus: bgStatusN }));

                    if (bgNotActive.length === 0) return;

                    let bgImport = 0;
                    await runPool(bgNotActive, UPSERT_CONCURRENCY, async (rawClient) => {
                        try {
                            const externalId = String(findValue(rawClient, 'customerid') || "");
                            const email = String(findValue(rawClient, 'Client_Email') || findValue(rawClient, 'email') || "").trim();
                            if (!email || !externalId) return;
                            const isRoleBased = isRoleBasedEmail(email);
                            const relationshipLevel = "Not Active";

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
                                    relationshipLevel,
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
                                    relationshipLevel,
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
                            bgImport++;
                        } catch {
                            // ignore per-record failures in background
                        }
                    });

                    console.log(`[INVOICE_SYNC] Background Not Active sync complete. Upserted: ${bgImport}`);
                } catch (e) {
                    console.error("[INVOICE_SYNC] Background Not Active sync failed:", e);
                }
            })();
        }

        return ok({
            count: importCount,
            conflicts: conflictCount,
            debug: clientsArray[0] || null,
            partial: {
                activeFetched: true,
                notActiveFetched,
                mode,
                backgroundNotActiveScheduled: !shouldSkipN && !shouldFetchNNow,
            },
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
