import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get("state"); // Account label (Sales, Accounts, etc.)

        const settings = await prisma.globalSettings.findUnique({
            where: { id: "singleton" }
        });

        if (!settings?.googleClientIdEncrypted) {
            return NextResponse.json({ error: "Google Client ID not configured" }, { status: 400 });
        }

        const clientId = decrypt(settings.googleClientIdEncrypted);
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`;

        // We need these scopes for reading email headers and identifying the user
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/gmail.readonly"
        ].join(" ");

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            new URLSearchParams({
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: "code",
                scope: scopes,
                access_type: "offline",
                prompt: "consent",
                state: state || "",
            }).toString();

        return NextResponse.redirect(authUrl);
    } catch (error) {
        console.error("Google Auth Redirect Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
