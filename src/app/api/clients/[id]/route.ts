import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const body = await request.json();

        console.log(`[DEBUG] Updating client ${id} with body:`, JSON.stringify(body, null, 2));

        const updatedClient = await prisma.client.update({
            where: { id },
            data: {
                clientName: body.clientName,
                contactPerson: body.contactPerson,
                email: body.email,
                industry: body.industry,
                relationshipLevel: body.relationshipLevel,
                services: {
                    set: body.serviceIds?.map((sid: string) => ({ id: sid })) || [],
                },
            },
        });

        return NextResponse.json(updatedClient);
    } catch (error: any) {
        console.error(`[ERROR] Failed to update client ${id}:`, error);

        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Another company is already using this email ID." }, { status: 400 });
        }

        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await prisma.client.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`[ERROR] Failed to delete client ${id}:`, error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
