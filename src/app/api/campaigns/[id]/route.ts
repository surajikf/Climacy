import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { subject, body: emailBody } = body;

        // Fetch original record to merge output
        const original = await prisma.campaignHistory.findUnique({
            where: { id: params.id }
        });

        if (!original) {
            return NextResponse.json({ error: "Campaign record not found." }, { status: 404 });
        }

        const currentOutput = JSON.parse(original.generatedOutput);
        const updatedOutput = JSON.stringify({
            ...currentOutput,
            subject: subject || currentOutput.subject,
            body: emailBody || currentOutput.body
        });

        const updated = await prisma.campaignHistory.update({
            where: { id: params.id },
            data: { generatedOutput: updatedOutput },
            include: { client: true }
        });

        return NextResponse.json(updated);
    } catch (error: any) {
        console.error("Failed to update campaign:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
