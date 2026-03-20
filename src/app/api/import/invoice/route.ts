import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { XMLParser } from "fast-xml-parser";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_INVOICE_API_URL, getGlobalSettings } from "@/lib/settings";
import { extractInvoiceClientRows } from "@/lib/invoice-xml";
import { after } from "next/server";

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

        const settings = await getGlobalSettings();
        const INVOICE_BASE_URL =
            settings.invoiceApiUrl?.trim() || DEFAULT_INVOICE_API_URL;
        const invoiceApiKey = settings.invoiceApiKey?.trim() || "";
        /** If set (e.g. apikey), send INVOICE_API_KEY as query param instead of X-API-Key header */
        const invoiceKeyQueryName = process.env.INVOICE_API_KEY_QUERY_NAME?.trim() || "";

        const REQUEST_TIMEOUT_MS = 30000;
        const urlObj = new URL(req.url);
        const mode = (urlObj.searchParams.get("mode") || "fast").toLowerCase();

        // 1. Fetch data from invoice service.
        // Fast mode prioritizes a quick response path to avoid reverse-proxy timeouts.
        const fetchClientsByStatus = async (status: "Y" | "N") => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            try {
                const endpoint = new URL(INVOICE_BASE_URL);
                endpoint.searchParams.set("status", status);
                if (invoiceApiKey && invoiceKeyQueryName) {
                    endpoint.searchParams.set(invoiceKeyQueryName, invoiceApiKey);
                }

                const headers: Record<string, string> = {
                    Accept: "application/xml",
                };
                if (invoiceApiKey && !invoiceKeyQueryName) {
                    headers["X-API-Key"] = invoiceApiKey;
                }

                const response = await fetch(endpoint.toString(), {
                    headers,
                    signal: controller.signal,
                    next: { revalidate: 0 },
                });

                if (!response.ok) throw new Error(`Status ${status} fetch failed: ${response.status}`);
                const xmlData = await response.text();
                const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
                return { status, jsonObj: parser.parse(xmlData) };
            } catch (err: any) {
                console.error(`[INVOICE_SYNC] Fetch ${status} failed:`, err.message);
                throw err;
            } finally {
                clearTimeout(timeoutId);
            }
        };

        // Helper to find value by key
        const findValue = (obj: any, targetKey: string) => {
            if (!obj || typeof obj !== 'object') return null;
            const actualKey = Object.keys(obj).find(k => k.toLowerCase() === targetKey.toLowerCase());
            if (!actualKey) return null;
            const value = obj[actualKey];
            if (value && typeof value === 'object') return value['#text'] || value['text'] || String(value);
            return value;
        };

        const parseDateStr = (dateStr: any) => {
            if (!dateStr) return null;
            const parsed = new Date(String(dateStr));
            return isNaN(parsed.getTime()) ? null : parsed;
        };

        const upsertOne = async (rawClient: any) => {
            const externalId = String(findValue(rawClient, 'customerid') || "");
            const email = String(findValue(rawClient, 'Client_Email') || findValue(rawClient, 'email') || "").trim();
            if (!email || !externalId) return;

            const isRoleBased = isRoleBasedEmail(email);
            const statusFlag = String(rawClient.invoiceStatus || "Y").toUpperCase();
            const relationshipLevel = statusFlag === "Y" ? "Active" : "Past Client";
            const serviceStr = findValue(rawClient, 'ServiceNames') || findValue(rawClient, 'serviceNames');
            const lastContact = parseDateStr(findValue(rawClient, 'LastContacted'));

            const clientData: any = {
                clientName: String(findValue(rawClient, 'ClientName') || "Unknown Client"),
                contactPerson: findValue(rawClient, 'ContactPerson') ? String(findValue(rawClient, 'ContactPerson')) : null,
                email,
                primaryEmail: email.split(',')[0].trim(),
                isRoleBased,
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
                invoiceServiceNames: serviceStr ? String(serviceStr).substring(0, 200) : null,
            };

            if (serviceStr) {
                const names = String(serviceStr).split(',').map(s => s.trim()).filter(Boolean);
                // To prevent DB lock/wait, we only connectOrCreate if needed
                clientData.services = {
                    connectOrCreate: names.map(serviceName => ({
                        where: { serviceName },
                        create: { serviceName, category: "Corporate" }
                    }))
                };
            }

            await prisma.client.upsert({
                where: { source_externalId: { source: "INVOICE_SYSTEM", externalId } },
                update: clientData,
                create: { ...clientData, industry: "Corporate", source: "INVOICE_SYSTEM", externalId }
            });
        };

        const runPool = async (items: any[], limit: number, worker: (item: any) => Promise<void>) => {
            const executing = new Set<Promise<void>>();
            for (const item of items) {
                const p = worker(item).finally(() => executing.delete(p));
                executing.add(p);
                if (executing.size >= limit) await Promise.race(executing);
            }
            await Promise.allSettled(executing);
        };

        const buildClientArrays = async (includeInactive: boolean) => {
            const ySync = await fetchClientsByStatus("Y");
            const nSync = includeInactive ? await fetchClientsByStatus("N") : null;

            const activeArray = extractInvoiceClientRows(ySync?.jsonObj).map((c) => ({
                ...c,
                invoiceStatus: "Y",
            }));
            const inactiveArray = extractInvoiceClientRows(nSync?.jsonObj).map((c) => ({
                ...c,
                invoiceStatus: "N",
            }));

            if (activeArray.length === 0) {
                console.warn(
                    "[INVOICE_SYNC] No active clients parsed from XML. Check ASMX response shape (SOAP/CDATA) and field names.",
                );
            }

            const activeIds = new Set(activeArray.map(c => String(c.Customerid || c.customerid || "")));
            const filteredInactive = inactiveArray.filter(c => !activeIds.has(String(c.Customerid || c.customerid || "")));
            return { activeArray, filteredInactive };
        };

        // Fast mode must return quickly for IIS/ARR environments.
        // Run fetch/parse/writes in background and acknowledge immediately.
        if (mode === "fast") {
            after(async () => {
                try {
                    console.log("[INVOICE_SYNC_BG] Starting background processing (fast mode)...");
                    const { activeArray, filteredInactive } = await buildClientArrays(true);
                    const totalBackground = activeArray.length + filteredInactive.length;
                    let bgCount = 0;
                    await runPool(activeArray, 6, async (c) => {
                        try {
                            await upsertOne(c);
                            bgCount++;
                        } catch (e) {
                            console.error("Active upsert failed:", e);
                        }
                    });
                    await runPool(filteredInactive, 5, async (c) => {
                        try {
                            await upsertOne(c);
                            bgCount++;
                        } catch (e) {
                            console.error("Inactive upsert failed:", e);
                        }
                    });
                    console.log(
                        `[INVOICE_SYNC_BG] Completed. Processed ${bgCount}/${totalBackground} records (fast mode).`,
                    );
                } catch (e) {
                    console.error("[INVOICE_SYNC_BG] Fatal background sync error:", e);
                }
            });

            return ok({
                count: 0,
                message: "Sync started in background.",
                partial: {
                    backgroundSyncScheduled: true,
                    backgroundActiveCount: null,
                    inactiveCount: null,
                    mode
                }
            });
        }

        // Full mode: process all active in foreground, then inactive in background.
        const { activeArray, filteredInactive } = await buildClientArrays(true);
        console.log(`[INVOICE_SYNC] Nodes found - Active: ${activeArray.length}, Inactive (unique): ${filteredInactive.length}`);
        let activeImported = 0;
        console.log(`[INVOICE_SYNC] Processing ${activeArray.length} Active clients synchronously (mode=full)...`);
        await runPool(activeArray, 10, async (c) => {
            try { await upsertOne(c); activeImported++; } catch (e) { console.error("Upsert failed:", e); }
        });

        const totalInactive = filteredInactive.length;
        if (totalInactive > 0) {
            console.log(`[INVOICE_SYNC] Scheduling background sync for ${totalInactive} inactive clients.`);
            after(async () => {
                console.log("[INVOICE_SYNC_BG] Starting background processing (full mode)...");
                let bgCount = 0;
                await runPool(filteredInactive, 5, async (c) => {
                    try {
                        await upsertOne(c);
                        bgCount++;
                    } catch (e) {
                        console.error("Inactive upsert failed:", e);
                    }
                });
                console.log(`[INVOICE_SYNC_BG] Completed. Processed ${bgCount}/${totalInactive} inactive records.`);
            });
        }

        return ok({
            count: activeImported,
            message: totalInactive > 0
                ? `Active clients synced (${activeImported}). Inactive sync (${totalInactive}) running in background.`
                : `Successfully synced ${activeImported} clients.`,
            partial: {
                backgroundSyncScheduled: totalInactive > 0,
                backgroundActiveCount: 0,
                inactiveCount: totalInactive,
                mode
            }
        });

    } catch (err: any) {
        console.error("Critical Sync Error:", err);
        return error("INTEGRATION_ERROR", err.message || "Sync failed", { status: 502 });
    }
}
