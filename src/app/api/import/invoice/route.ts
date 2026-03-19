import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { XMLParser } from "fast-xml-parser";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { getGlobalSettings } from "@/lib/settings";

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
        const INVOICE_BASE_URL = settings.invoiceApiUrl || "http://192.168.2.79/invoice/api/ApiService.asmx/GetClients";
        const REQUEST_TIMEOUT_MS = 30000;
        const urlObj = new URL(req.url);
        const mode = (urlObj.searchParams.get("mode") || "fast").toLowerCase();

        // 1. Fetch data in parallel
        const fetchClientsByStatus = async (status: "Y" | "N") => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
            try {
                const url = `${INVOICE_BASE_URL}?status=${encodeURIComponent(status)}`;
                const response = await fetch(url, {
                    headers: { "Accept": "application/xml" },
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

        const [yResults, nResults] = await Promise.allSettled([
            fetchClientsByStatus("Y"),
            fetchClientsByStatus("N")
        ]);

        const ySync = yResults.status === "fulfilled" ? yResults.value : null;
        const nSync = nResults.status === "fulfilled" ? nResults.value : null;

        if (!ySync && !nSync) {
            throw new Error("Critical failure: Both Active and Not Active node fetches failed.");
        }

        // Recursive helper to find the array of clients
        const findClientsRecursive = (obj: any): any[] | null => {
            if (!obj || typeof obj !== 'object') return null;
            if (obj.ActiveClientDto) return Array.isArray(obj.ActiveClientDto) ? obj.ActiveClientDto : [obj.ActiveClientDto];
            if (obj.ClientDto) return Array.isArray(obj.ClientDto) ? obj.ClientDto : [obj.ClientDto];
            if (obj.Client) return Array.isArray(obj.Client) ? obj.Client : [obj.Client];
            if (obj.ClientName || obj.Customerid) return [obj];

            for (const key of Object.keys(obj)) {
                if (typeof obj[key] !== 'object') continue;
                const found = findClientsRecursive(obj[key]);
                if (found) return found;
            }
            return null;
        };

        const activeArray = (findClientsRecursive(ySync?.jsonObj) || []).map(c => ({ ...c, invoiceStatus: "Y" }));
        const inactiveArray = (findClientsRecursive(nSync?.jsonObj) || []).map(c => ({ ...c, invoiceStatus: "N" }));

        // Deduplicate: If a client is in both, prefer Active ('Y')
        const activeIds = new Set(activeArray.map(c => String(c.Customerid || c.customerid || "")));
        const filteredInactive = inactiveArray.filter(c => !activeIds.has(String(c.Customerid || c.customerid || "")));

        console.log(`[INVOICE_SYNC] Nodes found - Active: ${activeArray.length}, Inactive (unique): ${filteredInactive.length}`);

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

        // Cache services to speed up upserts
        const existingServices = await prisma.service.findMany({ select: { serviceName: true } });
        const knownServices = new Set(existingServices.map(s => s.serviceName));

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

        // Foreground Phase: Active Clients (Sync)
        let activeImported = 0;
        console.log(`[INVOICE_SYNC] Processing ${activeArray.length} Active clients synchronously...`);
        await runPool(activeArray, 10, async (c) => {
            try { await upsertOne(c); activeImported++; } catch (e) { console.error("Upsert failed:", e); }
        });

        // Background Phase: Inactive Clients (Async)
        const totalInactive = filteredInactive.length;
        if (totalInactive > 0) {
            console.log(`[INVOICE_SYNC] Scheduling background sync for ${totalInactive} inactive clients.`);
            setTimeout(async () => {
                console.log("[INVOICE_SYNC_BG] Starting background processing...");
                let bgCount = 0;
                await runPool(filteredInactive, 5, async (c) => {
                    try { await upsertOne(c); bgCount++; } catch (e) {}
                });
                console.log(`[INVOICE_SYNC_BG] Completed. Processed ${bgCount}/${totalInactive} inactive records.`);
            }, 1000);
        }

        return ok({
            count: activeImported,
            message: totalInactive > 0 
                ? `Active clients synced (${activeImported}). Inactive sync (${totalInactive}) running in background.`
                : `Successfully synced ${activeImported} clients.`,
            partial: {
                backgroundSyncScheduled: totalInactive > 0,
                inactiveCount: totalInactive,
                mode
            }
        });

    } catch (err: any) {
        console.error("Critical Sync Error:", err);
        return error("INTEGRATION_ERROR", err.message || "Sync failed", { status: 502 });
    }
}
