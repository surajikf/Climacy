import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { XMLParser } from "fast-xml-parser";

export async function POST(req: Request) {
    try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });

        if (!token || token.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access. Level-5 Clearance Required." }, { status: 403 });
        }

        console.log("[INVOICE_SYNC] Starting sync from internal API...");

        // 1. Fetch data from the internal ASMX Service
        // Using a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch("http://192.168.2.79/invoice/api/ApiService.asmx/GetActiveClients", {
            headers: {
                "Accept": "application/xml"
            },
            signal: controller.signal,
            next: { revalidate: 0 }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch from Invoice System: ${response.statusText}`);
        }

        const xmlData = await response.text();

        // 2. Parse XML to JSON
        const parser = new XMLParser();
        const jsonObj = parser.parse(xmlData);

        // Based on the observed structure: ApiResponse -> data -> ActiveClientDto[]
        const clientsList = jsonObj?.ApiResponse?.data?.ActiveClientDto;

        if (!clientsList || (Array.isArray(clientsList) && clientsList.length === 0)) {
            console.log("[INVOICE_SYNC] No clients found in source.");
            return NextResponse.json({ success: true, count: 0, message: "No clients found in source (Empty Data)." });
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
                        isRoleBased: isRoleBased,
                    },
                    create: {
                        clientName: String(rawClient.ClientName || "Unknown Client"),
                        contactPerson: rawClient.ContactPerson ? String(rawClient.ContactPerson) : null,
                        email: email,
                        industry: "Corporate", // Default for invoice clients
                        relationshipLevel: "Active",
                        source: "INVOICE_SYSTEM",
                        externalId: externalId,
                        isRoleBased: isRoleBased,
                    }
                });
                importCount++;
            } catch (err) {
                console.error(`[INVOICE_SYNC] Error processing client ${rawClient.customerid}:`, err);
                conflictCount++;
            }
        }

        console.log(`[INVOICE_SYNC] Completed. Imported/Updated: ${importCount}, Errors: ${conflictCount}`);

        return NextResponse.json({
            success: true,
            count: importCount,
            conflicts: conflictCount
        });
    } catch (error: any) {
        console.error("Invoice Sync Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error during synchronization." }, { status: 500 });
    }
}
