import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";

const MASK = "••••••••••••••••";

export async function GET() {
    try {
        const db = await prisma as any;
        if (!db.globalSettings) {
            return NextResponse.json({
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
            return NextResponse.json({
                aiProvider: "Groq",
                aiModel: "llama-3.3-70b-versatile",
                brandResonance: "Strategic, insightful, and helpful.",
                signature: "Best regards,\nStrategic Partnership Team",
                groqApiKey: "",
                openaiApiKey: "",
                googleClientId: "",
                googleClientSecret: "",
                googleRefreshToken: "",
                googleEmail: ""
            });
        }

        const safeDecrypt = (val: string | null) => {
            if (!val) return "";
            try { return decrypt(val); } catch (e) { return ""; }
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

        return NextResponse.json(responseData);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    let body: any = {};
    try {
        body = await request.json();
        const db = prisma as any;

        if (!db.globalSettings) {
            console.error("Critical: db.globalSettings is missing from Prisma client.");
            return NextResponse.json({ error: "Database schema mismatch. Please run 'npx prisma db push'." }, { status: 500 });
        }

        const updateData: any = {
            aiProvider: body.aiProvider,
            aiModel: body.aiModel,
            brandResonance: body.brandResonance,
            signature: body.signature,
        };

        // Only update credentials if they were changed (not the mask)
        try {
            if (body.groqApiKey && body.groqApiKey !== MASK) updateData.groqApiKeyEncrypted = encrypt(body.groqApiKey);
            if (body.openaiApiKey && body.openaiApiKey !== MASK) updateData.openaiApiKeyEncrypted = encrypt(body.openaiApiKey);
            if (body.googleClientId && body.googleClientId !== MASK) updateData.googleClientIdEncrypted = encrypt(body.googleClientId);
            if (body.googleClientSecret && body.googleClientSecret !== MASK) updateData.googleClientSecretEncrypted = encrypt(body.googleClientSecret);
            if (body.googleRefreshToken && body.googleRefreshToken !== MASK) updateData.googleRefreshTokenEncrypted = encrypt(body.googleRefreshToken);
            if (body.googleEmail && body.googleEmail !== MASK) updateData.googleEmailEncrypted = encrypt(body.googleEmail);
        } catch (encError) {
            console.error("Encryption stage failure:", encError);
            return NextResponse.json({ error: "Security subsystem failure during encryption." }, { status: 500 });
        }

        const settings = await db.globalSettings.upsert({
            where: { id: "singleton" },
            update: updateData,
            create: {
                id: "singleton",
                ...updateData
            },
        });

        const safeDecrypt = (val: string | null) => {
            if (!val) return "";
            try { return decrypt(val); } catch (e) { return ""; }
        };

        return NextResponse.json({
            ...settings,
            groqApiKey: safeDecrypt(settings.groqApiKeyEncrypted),
            openaiApiKey: safeDecrypt(settings.openaiApiKeyEncrypted),
            googleClientId: safeDecrypt(settings.googleClientIdEncrypted),
            googleClientSecret: safeDecrypt(settings.googleClientSecretEncrypted),
            googleRefreshToken: safeDecrypt(settings.googleRefreshTokenEncrypted),
            googleEmail: safeDecrypt(settings.googleEmailEncrypted),
        });
    } catch (error: any) {
        console.error("CRITICAL Settings Save Failure:", error);
        return NextResponse.json({
            error: "Failed to persist operational configuration.",
            message: error.message,
            stack: error.stack,
            bodyPreview: JSON.stringify(body).substring(0, 100)
        }, { status: 500 });
    }
}
