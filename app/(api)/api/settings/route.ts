import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/services/encryption";
import { ok, error } from "@/services/api-response";
import { getGlobalSettings } from "@/services/settings";
import { getBackendSession } from "@/services/auth";
import { z } from "zod";

const MASK = "********";

function isMaskedSecret(value?: string | null) {
    if (!value) return false;
    const v = value.trim();
    if (!v) return false;
    if (v === MASK) return true;
    return /^[*•●·]+$/.test(v) && v.length >= 6;
}

const settingsSchema = z.object({
    aiProvider: z.string().min(1),
    aiModel: z.string().min(1),
    groqApiKey: z.string().optional(),
    openaiApiKey: z.string().optional(),
    googleClientId: z.string().optional(),
    googleClientSecret: z.string().optional(),
    projectName: z.string().optional(),
    projectLogo: z.string().optional(),
    invoiceApiUrl: z.string().optional(),
    invoiceApiKey: z.string().optional(),
    emailProvider: z.enum(["GMAIL", "SMTP"]).optional(),
    
    // Generic SMTP
    smtpHost: z.string().optional(),
    smtpPort: z.number().int().optional(),
    smtpUser: z.string().optional(),
    smtpPass: z.string().optional(),
    smtpSecure: z.boolean().optional(),
    smtpSenderEmail: z.string().email("A valid email is required").optional().or(z.literal("")),
    smtpSenderName: z.string().optional(),
});

export async function GET(request: Request) {
    try {
        const settings = await getGlobalSettings();
        const session = await getBackendSession(request);
        
        // Publicly accessible branding info
        const brandingInfo = {
            projectName: settings.projectName || "IKF Outreach",
            projectLogo: settings.projectLogo || "",
        };

        if (!session?.user?.id) {
            return ok(brandingInfo);
        }

        // Fetch current user's registered Gmail IDs only
        const [gmailAccounts, invoiceCount, lastInvoice, gmailCount, lastGmail] = await Promise.all([
            prisma.gmailAccount.findMany({
                where: { userId: session.user.id },
                orderBy: { updatedAt: "desc" }
            }),
            prisma.client.count({ where: { source: "INVOICE_SYSTEM" } }),
            prisma.client.findFirst({
                where: { source: "INVOICE_SYSTEM" },
                orderBy: { updatedAt: "desc" },
                select: { updatedAt: true }
            }),
            prisma.client.count({ where: { source: "GMAIL" } }),
            prisma.client.findFirst({
                where: { source: "GMAIL" },
                orderBy: { updatedAt: "desc" },
                select: { updatedAt: true }
            })
        ]);

        return ok({
            ...settings,
            ...brandingInfo,
            gmailAccounts: gmailAccounts, 
            invoiceStats: {
                count: invoiceCount,
                lastSyncAt: lastInvoice?.updatedAt || null
            },
            gmailStats: {
                count: gmailCount,
                lastSyncAt: lastGmail?.updatedAt || null
            },
            groqApiKey: settings.groqApiKey ? MASK : "",
            openaiApiKey: settings.openaiApiKey ? MASK : "" ,
            googleClientId: settings.googleClientId ? MASK : "",
            googleClientSecret: settings.googleClientSecret ? MASK : "",
            invoiceApiKey: settings.invoiceApiKey ? MASK : "",
            smtpPass: settings.smtpPassEncrypted ? MASK : "",
        });
    } catch (err: any) {
        console.error("Settings GET failure:", err);
        return error("INTERNAL_ERROR", "Failed to retrieve settings.");
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsed = settingsSchema.safeParse(body);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid payload.", { 
                status: 400, 
                details: parsed.error.flatten() 
            });
        }

        const data = parsed.data;
        const updateData: any = {
            aiProvider: data.aiProvider,
            aiModel: data.aiModel,
            projectName: data.projectName,
            projectLogo: data.projectLogo,
            emailProvider: data.emailProvider,
            smtpHost: data.smtpHost,
            smtpPort: data.smtpPort,
            smtpUser: data.smtpUser,
            smtpSecure: data.smtpSecure,
            smtpSenderEmail: data.smtpSenderEmail,
            smtpSenderName: data.smtpSenderName,
        };

        // Encrypt sensitive fields
        if (data.groqApiKey && !isMaskedSecret(data.groqApiKey)) updateData.groqApiKeyEncrypted = encrypt(data.groqApiKey);
        if (data.openaiApiKey && !isMaskedSecret(data.openaiApiKey)) updateData.openaiApiKeyEncrypted = encrypt(data.openaiApiKey);
        if (data.googleClientId && !isMaskedSecret(data.googleClientId)) updateData.googleClientIdEncrypted = encrypt(data.googleClientId);
        if (data.googleClientSecret && !isMaskedSecret(data.googleClientSecret)) updateData.googleClientSecretEncrypted = encrypt(data.googleClientSecret);
        if (data.invoiceApiKey && !isMaskedSecret(data.invoiceApiKey)) updateData.invoiceApiKeyEncrypted = encrypt(data.invoiceApiKey);
        if (data.smtpPass && !isMaskedSecret(data.smtpPass)) updateData.smtpPassEncrypted = encrypt(data.smtpPass);
        
        // Handle invoice URL separately if provided
        if (data.invoiceApiUrl) updateData.invoiceApiUrlEncrypted = encrypt(data.invoiceApiUrl);

        // Perform sanitized upsert
        const final = await prisma.globalSettings.upsert({
            where: { id: "singleton" },
            update: updateData,
            create: { id: "singleton", ...updateData },
        });

        return ok(final);

    } catch (err: any) {
        console.error("Settings Persistence Failure:", err);
        return error("INTERNAL_ERROR", "Persistence failed. Ensure database schema is synchronized.");
    }
}

