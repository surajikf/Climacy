import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";

const RAW_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_insecure_key_123456789012";
const ENCRYPTION_KEY = RAW_ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32);

const RAW_ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default_iv_12345";
const ENCRYPTION_IV = RAW_ENCRYPTION_IV.padEnd(16, '0').substring(0, 16);

function encrypt(text: string): string {
    if (!text) return text;
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

export async function GET(req: Request) {
    try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });

        if (!token || token.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
        }

        const settings = await prisma.globalSettings.findFirst();

        return NextResponse.json({
            hasClientId: !!settings?.zohoClientIdEncrypted,
            hasClientSecret: !!settings?.zohoClientSecretEncrypted,
            hasRefreshToken: !!settings?.zohoRefreshTokenEncrypted,
            pipelineName: settings?.zohoPipelineName || "Sales Pipeline",
            stageName: settings?.zohoStageName || "Closed Won"
        });
    } catch (error) {
        console.error("Zoho Settings GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });

        if (!token || token.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
        }

        const { clientId, clientSecret, pipelineName, stageName } = await req.json();

        let settings = await prisma.globalSettings.findFirst();

        const updateData: any = {};

        if (clientId) updateData.zohoClientIdEncrypted = encrypt(clientId);
        if (clientSecret) updateData.zohoClientSecretEncrypted = encrypt(clientSecret);
        if (pipelineName) updateData.zohoPipelineName = pipelineName;
        if (stageName) updateData.zohoStageName = stageName;

        if (settings) {
            await prisma.globalSettings.update({
                where: { id: settings.id },
                data: updateData
            });
        } else {
            await prisma.globalSettings.create({
                data: updateData
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Zoho Settings PUT Error:", error);
        return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
    }
}
