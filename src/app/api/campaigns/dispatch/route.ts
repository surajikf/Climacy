import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendStrategicEmail } from "@/lib/mail";
import { wrapInPremiumTemplate } from "@/lib/email-template";

export async function POST(request: Request) {
    try {
        const { campaignId } = await request.json();

        if (!campaignId) {
            return NextResponse.json({ error: "Campaign ID vector required." }, { status: 400 });
        }

        // 1. Fetch Campaign Details
        const campaign = await prisma.campaignHistory.findUnique({
            where: { id: campaignId },
            include: { client: true }
        });

        if (!campaign || !campaign.client) {
            return NextResponse.json({ error: "No campaign company found in the matrix." }, { status: 404 });
        }

        const content = JSON.parse(campaign.generatedOutput);
        const { subject, body } = content;

        if (!campaign.client.email) {
            return NextResponse.json({ error: "Target company lacks a valid email ID." }, { status: 400 });
        }

        // 2. Dispatch Strategic Communication
        const htmlBody = wrapInPremiumTemplate(body, campaign.client.clientName);

        const result = await sendStrategicEmail({
            to: campaign.client.email,
            subject: subject,
            html: htmlBody,
            text: body.replace(/<[^>]*>/g, ""),
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Neural Link Failure." }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            messageId: result.messageId,
            recipient: campaign.client.clientName
        });

    } catch (error: any) {
        console.error("Neural Dispatch Error:", error);
        return NextResponse.json({ error: error.message || "Major system failure during dispatch." }, { status: 500 });
    }
}
