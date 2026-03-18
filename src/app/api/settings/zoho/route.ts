import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import { ok, error } from "@/lib/api-response";
import { z } from "zod";

const RAW_ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || "default_insecure_key_123456789012";
const ENCRYPTION_KEY = RAW_ENCRYPTION_KEY.padEnd(32, "0").substring(0, 32);

const RAW_ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default_iv_12345";
const ENCRYPTION_IV = RAW_ENCRYPTION_IV.padEnd(16, "0").substring(0, 16);

function encrypt(text: string): string {
    if (!text) return text;
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        Buffer.from(ENCRYPTION_IV),
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
}

const zohoSettingsSchema = z.object({
    clientId: z.string().optional(),
    clientSecret: z.string().optional(),
    pipelineName: z.string().optional(),
    stageName: z.string().optional(),
    zohoFieldMapping: z.array(z.any()).optional(),
});

export async function GET(req: Request) {
    try {
        const token = await getToken({
            req: req as any,
            secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret",
        });

        if (!token || token.role !== "ADMIN") {
            return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
        }

        const settings = await prisma.globalSettings.findFirst();

        return ok({
            hasClientId: !!settings?.zohoClientIdEncrypted,
            hasClientSecret: !!settings?.zohoClientSecretEncrypted,
            hasRefreshToken: !!settings?.zohoRefreshTokenEncrypted,
            pipelineName: settings?.zohoPipelineName || "Sales Pipeline",
            stageName: settings?.zohoStageName || "Closed Won",
            zohoFieldMapping: settings?.zohoFieldMapping || [],
        });
    } catch (err) {
        console.error("Zoho Settings GET Error:", err);
        return error("INTERNAL_ERROR", "Failed to fetch settings.");
    }
}

export async function PUT(req: Request) {
    try {
        const token = await getToken({
            req: req as any,
            secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret",
        });

        if (!token || token.role !== "ADMIN") {
            return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
        }

        const json = await req.json();
        const parsed = zohoSettingsSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid Zoho settings payload", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { clientId, clientSecret, pipelineName, stageName, zohoFieldMapping } = parsed.data;

        let settings = await prisma.globalSettings.findFirst();

        const updateData: any = {};

        if (clientId) updateData.zohoClientIdEncrypted = encrypt(clientId);
        if (clientSecret) updateData.zohoClientSecretEncrypted = encrypt(clientSecret);
        if (pipelineName) updateData.zohoPipelineName = pipelineName;
        if (stageName) updateData.zohoStageName = stageName;
        if (zohoFieldMapping) updateData.zohoFieldMapping = zohoFieldMapping;

        const { zohoFieldMapping: mappingToSave, ...standardData } = updateData;

        if (settings) {
            await (prisma.globalSettings as any).update({
                where: { id: settings.id },
                data: standardData,
            });
            
            // Handle field mapping via raw SQL to bypass Prisma client generation issues (EPERM)
            if (mappingToSave) {
                try {
                    await prisma.$executeRawUnsafe(
                        `UPDATE "GlobalSettings" SET "zohoFieldMapping" = $1::jsonb WHERE id = $2`,
                        JSON.stringify(mappingToSave),
                        settings.id
                    );
                } catch (e) {
                    console.error("Raw SQL Update Error (zohoFieldMapping):", e);
                }
            }
        } else {
            const newSettings = await (prisma.globalSettings as any).create({
                data: standardData,
            });

            if (mappingToSave) {
                try {
                    await prisma.$executeRawUnsafe(
                        `UPDATE "GlobalSettings" SET "zohoFieldMapping" = $1::jsonb WHERE id = $2`,
                        JSON.stringify(mappingToSave),
                        newSettings.id
                    );
                } catch (e) {
                    console.error("Raw SQL Create Error (zohoFieldMapping):", e);
                }
            }
        }

        return ok({ updated: true });
    } catch (err) {
        console.error("Zoho Settings PUT Error:", err);
        return error("INTERNAL_ERROR", "Failed to update settings.");
    }
}
