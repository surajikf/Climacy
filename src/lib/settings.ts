import prisma from "./prisma";
import { decrypt } from "./encryption";

/** Default when neither DB nor INVOICE_API_URL is set (must match your ASMX: ?op=GetClients + status=Y|N) */
export const DEFAULT_INVOICE_API_URL =
    "http://192.168.2.79/invoice/api/ApiService.asmx?op=GetClients";

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
};

export async function getGlobalSettings(): Promise<GlobalSettings> {
    try {
        const settings = await prisma.globalSettings.findUnique({
            where: { id: "singleton" },
        });

        if (!settings) {
            return {
                ...DEFAULT_SETTINGS,
                groqApiKey: process.env.GROQ_API_KEY || "",
                openaiApiKey: process.env.OPENAI_API_KEY || "",
                googleClientId: process.env.GOOGLE_CLIENT_ID || "",
                googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
                googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
                googleEmail: process.env.EMAIL_USER || "",
                invoiceApiKey: process.env.INVOICE_API_KEY?.trim() || "",
                invoiceApiUrl:
                    process.env.INVOICE_API_URL?.trim() || DEFAULT_INVOICE_API_URL,
            };
        }

        const safeDecrypt = (val: string | null) => {
            if (!val) return "";
            try {
                return decrypt(val);
            } catch (e) {
                console.error("Decryption failed:", e);
                return "";
            }
        };

        const baseSettings = {
            aiProvider: settings.aiProvider,
            aiModel: settings.aiModel,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted) || process.env.GROQ_API_KEY || "",
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted) || process.env.OPENAI_API_KEY || "",
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted) || process.env.GOOGLE_CLIENT_ID || "",
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted) || process.env.GOOGLE_CLIENT_SECRET || "",
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted) || process.env.GOOGLE_REFRESH_TOKEN || "",
            googleEmail: safeDecrypt(settings.googleEmailEncrypted) || process.env.EMAIL_USER || "",
            invoiceApiKey: (
                safeDecrypt(settings.invoiceApiKeyEncrypted) ||
                process.env.INVOICE_API_KEY ||
                ""
            ).trim(),
            invoiceApiUrl:
                safeDecrypt(settings.invoiceApiUrlEncrypted)?.trim() ||
                process.env.INVOICE_API_URL?.trim() ||
                DEFAULT_INVOICE_API_URL,
        };

        // NEW: Multi-account lookup (highest priority) - wrapped in try/catch to avoid model-not-found errors
        try {
            const defaultAccount = await (prisma.gmailAccount as any).findFirst({
                where: { isDefault: true }
            });

            if (defaultAccount) {
                baseSettings.googleEmail = defaultAccount.email;
                baseSettings.googleRefreshToken = safeDecrypt(defaultAccount.refreshTokenEncrypted);
            }
        } catch (multiAccErr) {
            console.warn("Multi-account settings not yet initialized in client. Using legacy config.");
        }

        return baseSettings;
    } catch (error) {
        console.error("Failed to fetch global settings:", error);
        return {
            ...DEFAULT_SETTINGS,
            groqApiKey: process.env.GROQ_API_KEY || "",
            openaiApiKey: process.env.OPENAI_API_KEY || "",
            googleClientId: process.env.GOOGLE_CLIENT_ID || "",
            googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
            googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
            googleEmail: process.env.EMAIL_USER || "",
            invoiceApiKey: process.env.INVOICE_API_KEY?.trim() || "",
            invoiceApiUrl:
                process.env.INVOICE_API_URL?.trim() || DEFAULT_INVOICE_API_URL,
        };
    }
}
