import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/lib/email-utils";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const industries = searchParams.getAll("industry");
        const levels = searchParams.getAll("level");
        const serviceIds = searchParams.getAll("service");
        const sources = searchParams.getAll("source");
        const showRoleBased = searchParams.get("roleBased") === "true";

        const clients = await prisma.client.findMany({
            where: {
                ...(industries.length > 0 && { industry: { in: industries } }),
                ...(levels.length > 0 && { relationshipLevel: { in: levels } }),
                ...(sources.length > 0 && { source: { in: sources as any } }),
                isRoleBased: showRoleBased,
                ...(serviceIds.length > 0 && {
                    services: {
                        some: { id: { in: serviceIds } }
                    }
                }),
            },
            select: {
                id: true,
                clientName: true,
                contactPerson: true,
                email: true,
                industry: true,
                relationshipLevel: true,
                source: true,
                isRoleBased: true,
                zohoTags: true,
                gmailSourceAccount: true,
                lastContacted: true,
                services: {
                    select: {
                        id: true,
                        serviceName: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(clients);
    } catch (error: any) {
        console.error("Failed to fetch clients:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const client = await prisma.client.create({
            data: {
                clientName: body.clientName,
                contactPerson: body.contactPerson,
                email: body.email,
                industry: body.industry,
                relationshipLevel: body.relationshipLevel,
                isRoleBased: isRoleBasedEmail(body.email),
                services: {
                    connect: body.serviceIds.map((id: string) => ({ id })),
                },
            },
        });

        return NextResponse.json(client);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A client with this email already exists." }, { status: 400 });
        }
        console.error("Failed to create client:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
