import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";

export async function GET() {
    try {
        const accounts = await prisma.gmailAccount.findMany({
            select: {
                id: true,
                accountName: true,
                email: true,
                updatedAt: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(accounts);
    } catch (error) {
        console.error("Failed to fetch Gmail accounts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.gmailAccount.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete Gmail account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
