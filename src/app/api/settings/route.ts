import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { ok, error } from "@/lib/api-response";
import { DEFAULT_INVOICE_API_URL } from "@/lib/settings";
import { z } from "zod";

const MASK = "••••••••••••••••";

const settingsSchema = z.object({
    aiProvider: z.string().min(1),
    aiModel: z.string().min(1),
    groqApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),
    googleRefreshToken: z.string().optional(),
    googleEmail: z.string().optional(),
    invoiceApiKey: z.string().optional(),
    invoiceApiUrl: z.string().optional()
});

export async function GET() {
    try {
        const db = (await prisma) as any;
        if (!db.globalSettings) {
            return ok({
                aiProvider: "Groq",
                aiModel: "llama-3.3-70b-versatile",
            });
        }

        const settings = await db.globalSettings.findUnique({
            where: { id: "singleton" },
        });

        if (!settings) {
            return ok({
                aiProvider: "Groq",
                aiModel: "llama-3.3-70b-versatile",
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
            invoiceApiKey: safeDecrypt(settings.invoiceApiKeyEncrypted),
            invoiceApiUrl:
                safeDecrypt(settings.invoiceApiUrlEncrypted) || DEFAULT_INVOICE_API_URL,
            gmailAccounts: [] as any[]
        };

        let gmailAccounts = [] as any[];
        try {
            gmailAccounts = await (prisma.gmailAccount as any).findMany({
                orderBy: { updatedAt: 'desc' }
            });

            // Migration check: if we have a singleton email but no GmailAccount record for it
            if (responseData.googleEmail && !gmailAccounts.find((a: any) => a.email.toLowerCase() === responseData.googleEmail.toLowerCase())) {
                await (prisma.gmailAccount as any).create({
                    data: {
                        email: responseData.googleEmail.toLowerCase(),
                        accountName: "Primary",
                        refreshTokenEncrypted: settings.googleRefreshTokenEncrypted || "",
                        isDefault: true
                    }
                });
                // Refresh counts
                gmailAccounts = await (prisma.gmailAccount as any).findMany({ orderBy: { updatedAt: 'desc' } });
            }
        } catch (multiAccErr) {
            console.warn("Multi-account models not yet available in Prisma client. Skipping sync.");
        }
        
        responseData.gmailAccounts = gmailAccounts;

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
            if (data.invoiceApiKey && data.invoiceApiKey !== MASK)
                updateData.invoiceApiKeyEncrypted = encrypt(data.invoiceApiKey);
            if (data.invoiceApiUrl && data.invoiceApiUrl !== MASK)
                updateData.invoiceApiUrlEncrypted = encrypt(data.invoiceApiUrl);
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

        let gmailAccounts = [] as any[];
        try {
            gmailAccounts = await (prisma.gmailAccount as any).findMany({
                orderBy: { updatedAt: 'desc' }
            });
        } catch (e) {
            console.warn("Multi-account models not yet available in Prisma client during POST return.");
        }

        return ok({
            ...settings,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted),
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted),
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted),
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted),
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted),
            googleEmail: safeDecrypt(settings.googleEmailEncrypted),
            invoiceApiKey: safeDecrypt(settings.invoiceApiKeyEncrypted),
            invoiceApiUrl: safeDecrypt(settings.invoiceApiUrlEncrypted),
            gmailAccounts
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
