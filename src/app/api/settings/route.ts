import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { ok, error } from "@/lib/api-response";
import { z } from "zod";

const MASK = "••••••••••••••••";

const settingsSchema = z.object({
    aiProvider: z.string().min(1),
    aiModel: z.string().min(1),
    brandResonance: z.string().min(1),
    signature: z.string().min(1),
    groqApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),
    googleRefreshToken: z.string().optional(),
    googleEmail: z.string().optional(),
});

export async function GET() {
    try {
        const db = (await prisma) as any;
        if (!db.globalSettings) {
            return ok({
                aiProvider: "Groq",
                aiModel: "llama-3.3-70b-versatile",
                brandResonance: "Strategic, insightful, and helpful.",
                signature: "Best regards,\nStrategic Partnership Team",
            });
        }

        const settings = await db.globalSettings.findUnique({
            where: { id: "singleton" },
        });

        if (!settings) {
            return ok({
                aiProvider: "Groq",
                aiModel: "llama-3.3-70b-versatile",
                brandResonance: "Strategic, insightful, and helpful.",
                signature: "Best regards,\nStrategic Partnership Team",
                groqApiKey: "",
                openaiApiKey: "",
                googleClientId: "",
                googleClientSecret: "",
                googleRefreshToken: "",
                googleEmail: "",
            });
        }

        const safeDecrypt = (val: string | null) => {
            if (!val) return "";
            try {
                return decrypt(val);
            } catch {
                return "";
            }
        };

        const responseData = {
            ...settings,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted),
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted),
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted),
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted),
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted),
            googleEmail: safeDecrypt(settings.googleEmailEncrypted),
        };

        return ok(responseData);
    } catch (err) {
        console.error("Failed to fetch settings:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}

export async function POST(request: Request) {
    let body: any = {};
    try {
        body = await request.json();
        const parsed = settingsSchema.safeParse(body);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid settings payload", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const data = parsed.data;
        const db = prisma as any;

        if (!db.globalSettings) {
            console.error("Critical: db.globalSettings is missing from Prisma client.");
            return error(
                "INTERNAL_ERROR",
                "Database schema mismatch. Please run 'npx prisma db push'.",
            );
        }

        const updateData: any = {
            aiProvider: data.aiProvider,
            aiModel: data.aiModel,
            brandResonance: data.brandResonance,
            signature: data.signature,
        };

        try {
            if (data.groqApiKey && data.groqApiKey !== MASK)
                updateData.groqApiKeyEncrypted = encrypt(data.groqApiKey);
            if (data.openaiApiKey && data.openaiApiKey !== MASK)
                updateData.openaiApiKeyEncrypted = encrypt(data.openaiApiKey);
            if (data.googleClientId && data.googleClientId !== MASK)
                updateData.googleClientIdEncrypted = encrypt(data.googleClientId);
            if (data.googleClientSecret && data.googleClientSecret !== MASK)
                updateData.googleClientSecretEncrypted = encrypt(data.googleClientSecret);
            if (data.googleRefreshToken && data.googleRefreshToken !== MASK)
                updateData.googleRefreshTokenEncrypted = encrypt(data.googleRefreshToken);
            if (data.googleEmail && data.googleEmail !== MASK)
                updateData.googleEmailEncrypted = encrypt(data.googleEmail);
        } catch (encError) {
            console.error("Encryption stage failure:", encError);
            return error(
                "INTERNAL_ERROR",
                "Security subsystem failure during encryption.",
            );
        }

        const settings = await db.globalSettings.upsert({
            where: { id: "singleton" },
            update: updateData,
            create: {
                id: "singleton",
                ...updateData,
            },
        });

        const safeDecrypt = (val: string | null) => {
            if (!val) return "";
            try {
                return decrypt(val);
            } catch {
                return "";
            }
        };

        return ok({
            ...settings,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted),
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted),
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted),
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted),
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted),
            googleEmail: safeDecrypt(settings.googleEmailEncrypted),
        });
    } catch (err: any) {
        console.error("CRITICAL Settings Save Failure:", err);
        return error(
            "INTERNAL_ERROR",
            "Failed to persist operational configuration.",
            {
                details: {
                    message: err.message,
                    bodyPreview: JSON.stringify(body).substring(0, 100),
                },
            },
        );
    }
}
