import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { isRoleBasedEmail } from "@/lib/email-utils";

export async function POST(req: Request) {
    try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });

        if (!token || token.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access. Level-5 Clearance Required." }, { status: 403 });
        }

        // TODO: In the future, fetch from actual Invoice System API
        // For now, we simulate pulling active clients from an endpoint

        // Mock Response from an external "Clients List API"
        const externalData = [
            { id: "INV-C-001", name: "Global Tech Solutions", contact: "Alice Smith", email: "alice@globaltech.com", industry: "Technology" },
            { id: "INV-C-002", name: "Apex Manufacturing", contact: "Bob Johnson", email: "bob@apex.com", industry: "Manufacturing" },
            { id: "INV-C-003", name: "Stellar Logistics", contact: "Carol White", email: "carol@stellar.com", industry: "Logistics" }
        ];

        let importCount = 0;

        // Upsert logic: Update if they exist, create if they don't based on externalId
        for (const client of externalData) {
            await prisma.client.upsert({
                where: {
                    source_externalId: {
                        source: "INVOICE_SYSTEM",
                        externalId: client.id
                    }
                },
                update: {
                    clientName: client.name,
                    contactPerson: client.contact,
                    email: client.email,
                    industry: client.industry,
                    isRoleBased: isRoleBasedEmail(client.email),
                },
                create: {
                    clientName: client.name,
                    contactPerson: client.contact,
                    email: client.email,
                    industry: client.industry,
                    relationshipLevel: "Active", // Defaulting Invoice clients to Active
                    source: "INVOICE_SYSTEM",
                    externalId: client.id,
                    isRoleBased: isRoleBasedEmail(client.email),
                }
            });
            importCount++;
        }

        return NextResponse.json({ success: true, count: importCount });
    } catch (error) {
        console.error("Invoice Sync Error:", error);
        return NextResponse.json({ error: "Internal Server Error during synchronization." }, { status: 500 });
    }
}
