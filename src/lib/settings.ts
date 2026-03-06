import prisma from "./prisma";
import { decrypt } from "./encryption";

export interface GlobalSettings {
    aiProvider: string;
    aiModel: string;
    brandResonance: string;
    signature: string;
    groqApiKey: string;
    openaiApiKey: string;
    googleClientId: string;
    googleClientSecret: string;
    googleRefreshToken: string;
    googleEmail: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
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

        return {
            aiProvider: settings.aiProvider,
            aiModel: settings.aiModel,
            brandResonance: settings.brandResonance,
            signature: settings.signature,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted) || process.env.GROQ_API_KEY || "",
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted) || process.env.OPENAI_API_KEY || "",
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted) || process.env.GOOGLE_CLIENT_ID || "",
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted) || process.env.GOOGLE_CLIENT_SECRET || "",
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted) || process.env.GOOGLE_REFRESH_TOKEN || "",
            googleEmail: safeDecrypt(settings.googleEmailEncrypted) || process.env.EMAIL_USER || "",
        };
    } catch (error) {
        console.error("Failed to fetch global settings:", error);
        return DEFAULT_SETTINGS;
    }
}
