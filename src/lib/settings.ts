import prisma from "./prisma";
import { decrypt } from "./encryption";

/** Default when neither DB nor INVOICE_API_URL is set (must match your ASMX: ?op=GetClients + status=Y|N) */
export const DEFAULT_INVOICE_API_URL =
    "http://192.168.2.79/invoice/api/ApiService.asmx";

export interface GlobalSettings {
    aiProvider: string;
    aiModel: string;
    groqApiKey: string;
    openaiApiKey: string;
    googleClientId: string;
    googleClientSecret: string;
    googleRefreshToken: string;
    googleEmail: string;
    invoiceApiKey: string;
    invoiceApiUrl: string;
    emailProvider: string;
    brevoApiKey: string;
    brevoSenderEmail: string;
    brevoSenderName: string;
    brevoReplyTo: string;
    brevoApiKeyEncrypted?: string | null; // Added to help type compatibility with Prisma results if needed
}

const DEFAULT_SETTINGS: GlobalSettings = {
    aiProvider: "Groq",
    aiModel: "llama-3.3-70b-versatile",
    groqApiKey: "",
    openaiApiKey: "",
    googleClientId: "",
    googleClientSecret: "",
    googleRefreshToken: "",
    googleEmail: "",
    invoiceApiKey: "",
    invoiceApiUrl: "",
    emailProvider: "GMAIL",
    brevoApiKey: "",
    brevoSenderEmail: "",
    brevoSenderName: "",
    brevoReplyTo: ""
};

export async function getGlobalSettings(): Promise<GlobalSettings> {
    try {
        // High-speed path
        try {
            const settings = await prisma.globalSettings.findUnique({
                where: { id: "singleton" },
            });
            if (settings) return await processSettings(settings);
        } catch (err: any) {
            // If it's a schema error, try the Minimal Safe Path
            if (err.message.includes("column") || err.message.includes("does not exist")) {
                console.warn("[RECOVERY] Schema mismatch detected. Engaging Minimal Safe Path...");
                // Note: We use raw query here to get at least the provider, as select still fails if any field is missing
                const rows: any[] = await (prisma as any).$queryRaw`SELECT * FROM "GlobalSettings" WHERE id = 'singleton' LIMIT 1`.catch(() => []);
                if (rows.length > 0) return await processSettings(rows[0]);
            }
            throw err;
        }

        // Ultimate fallback if no row found or complete DB failure
        return getDefaultSettings();
    } catch (error) {
        console.error("Critical Failure in Settings Hub:", error);
        return getDefaultSettings();
    }
}

function getDefaultSettings(): GlobalSettings {
    return {
        ...DEFAULT_SETTINGS,
        groqApiKey: process.env.GROQ_API_KEY || "",
        openaiApiKey: process.env.OPENAI_API_KEY || "",
        googleClientId: process.env.GOOGLE_CLIENT_ID || "",
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
        googleEmail: process.env.EMAIL_USER || "",
        invoiceApiKey: process.env.INVOICE_API_KEY?.trim() || "",
        invoiceApiUrl: process.env.INVOICE_API_URL?.trim() || DEFAULT_INVOICE_API_URL,
        emailProvider: (process.env.EMAIL_PROVIDER as any) || "GMAIL",
        brevoApiKey: (process.env.BREVO_API_KEY || "").trim().replace(/^["']|["']$/g, ''),
        brevoSenderEmail: (process.env.BREVO_API_KEY_SENDER || "").trim().replace(/^["']|["']$/g, '') || "",
    };
}

async function processSettings(settings: any): Promise<GlobalSettings> {
    const safeDecrypt = (val: string | null) => {
        if (!val) return "";
        try {
            return decrypt(val);
        } catch (e) {
            return "";
        }
    };

    // Helper to get field with support for both camelCase and snake_case from raw queries
    const get = (obj: any, key: string) => obj[key] !== undefined ? obj[key] : obj[key.toLowerCase()];

    const baseSettings = {
        aiProvider: get(settings, 'aiProvider') || "Groq",
        aiModel: get(settings, 'aiModel') || "llama-3.3-70b-versatile",
        groqApiKey: safeDecrypt(get(settings, 'groqApiKeyEncrypted')) || process.env.GROQ_API_KEY || "",
        openaiApiKey: safeDecrypt(get(settings, 'openaiApiKeyEncrypted')) || process.env.OPENAI_API_KEY || "",
        googleClientId: safeDecrypt(get(settings, 'googleClientIdEncrypted')) || process.env.GOOGLE_CLIENT_ID || "",
        googleClientSecret: safeDecrypt(get(settings, 'googleClientSecretEncrypted')) || process.env.GOOGLE_CLIENT_SECRET || "",
        googleRefreshToken: safeDecrypt(get(settings, 'googleRefreshTokenEncrypted')) || process.env.GOOGLE_REFRESH_TOKEN || "",
        googleEmail: safeDecrypt(get(settings, 'googleEmailEncrypted')) || process.env.EMAIL_USER || "",
        invoiceApiKey: (safeDecrypt(get(settings, 'invoiceApiKeyEncrypted')) || process.env.INVOICE_API_KEY || "").trim(),
        invoiceApiUrl: safeDecrypt(get(settings, 'invoiceApiUrlEncrypted'))?.trim() || process.env.INVOICE_API_URL?.trim() || DEFAULT_INVOICE_API_URL,
        emailProvider: (String(get(settings, 'emailProvider') || (process.env.EMAIL_PROVIDER as any) || "GMAIL")).toUpperCase().trim(),
        brevoApiKey: (safeDecrypt(get(settings, 'brevoApiKeyEncrypted')) || process.env.BREVO_API_KEY || "").trim().replace(/^["']|["']$/g, ''),
        brevoSenderEmail: (String(get(settings, 'brevoSenderEmail') || "")).trim().replace(/^["']|["']$/g, ''),
        brevoSenderName: (String(get(settings, 'brevoSenderName') || "")).trim(),
        brevoReplyTo: (String(get(settings, 'brevoReplyTo') || "")).trim(),
    };

    // GmailAccount sync
    try {
        const defaultAccount = await (prisma.gmailAccount as any).findFirst({
            where: { isDefault: true },
            orderBy: { updatedAt: "desc" }
        });
        if (defaultAccount) {
            baseSettings.googleEmail = defaultAccount.email;
            baseSettings.googleRefreshToken = safeDecrypt(defaultAccount.refreshTokenEncrypted || "");
        }
    } catch (multiAccErr) {
        // GmailAccount table missing - expected if no migration yet
    }

    return baseSettings;
}
