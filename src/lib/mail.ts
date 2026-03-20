import nodemailer from "nodemailer";
import { getGlobalSettings } from "./settings";
import path from "path";
import prisma from "./prisma";
import { decrypt } from "./encryption";

interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendStrategicEmail({ to, subject, text, html }: MailOptions) {
    // --- Tactical Credential Retrieval (Dynamic) ---
    const settings = await getGlobalSettings();
    const clientId = settings.googleClientId;
    const clientSecret = settings.googleClientSecret;

    // Prefer the currently connected default Gmail identity (single source of truth).
    // This avoids stale legacy singleton values causing OAuth mismatch (535).
    let user = settings.googleEmail;
    let refreshToken = settings.googleRefreshToken;
    try {
        const defaultAccount = await (prisma.gmailAccount as any).findFirst({
            where: { isDefault: true },
            orderBy: { updatedAt: "desc" },
        });

        if (defaultAccount) {
            user = defaultAccount.email || user;
            refreshToken = defaultAccount.refreshTokenEncrypted
                ? decrypt(defaultAccount.refreshTokenEncrypted)
                : refreshToken;
        }
    } catch {
        // Keep existing fallback path (settings table / env).
    }

    const isConfigurationValid = user && clientId && clientSecret && refreshToken;

    if (!isConfigurationValid) {
        console.warn("Google Cloud OAuth2 credentials not fully configured in settings.");
        return {
            success: false,
            error: "Email configuration incomplete. Please finalize Google OAuth settings in the console."
        };
    }

    try {
        // Preflight refresh-token exchange so we can fail with precise guidance.
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            }),
        });

        if (!tokenResponse.ok) {
            const tokenErr = await tokenResponse.text();
            console.error("[MAIL] OAuth refresh preflight failed:", tokenErr);
            return {
                success: false,
                error: "Google OAuth refresh failed. Reconnect Gmail identity in Settings (Connect New Identity) and set it as Default.",
            };
        }

        console.log(`[MAIL] Attempting dispatch to ${to} using ${user}`);
        console.log(`[MAIL] Config: ClientID: ${clientId?.substring(0, 5)}... ClientSecret: ${clientSecret?.substring(0, 5)}... RefreshToken: ${refreshToken?.substring(0, 5)}...`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            debug: true,
            logger: true,
            auth: {
                type: "OAuth2",
                user: user,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
            } as any,
        });

        const info = await transporter.sendMail({
            from: `"I Knowledge Factory Pvt. Ltd." <${user}>`,
            to,
            subject,
            text,
            html,
            attachments: [
                {
                    filename: 'logo.png',
                    path: path.join(process.cwd(), 'public', 'logo.png'),
                    cid: 'logo' // same cid value as in the html img src
                }
            ]
        });

        console.log("[MAIL] Strategic communication dispatched:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("[MAIL] Email dispatch failed:", error);
        // Provide more descriptive error if possible
        let errorMsg = error.message;
        if (error.message.includes("535")) {
            errorMsg = "Authentication failed (535). This usually means your Refresh Token or Client ID/Secret are invalid, or the email doesn't match. Please re-authorize in Settings.";
        }
        return { success: false, error: errorMsg };
    }
}
