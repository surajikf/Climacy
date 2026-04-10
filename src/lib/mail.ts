import nodemailer from "nodemailer";
import { getGlobalSettings, GlobalSettings } from "./settings";
import prisma from "./prisma";
import { decrypt } from "./encryption";

interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

export async function sendStrategicEmail({ to, subject, text, html }: MailOptions) {
    const settings = await getGlobalSettings();
    const provider = settings.emailProvider || "GMAIL";

    console.log(`[MAIL] Dispatch Protocol Engaged: ${provider}`);

    if (provider === "BREVO") {
        return sendViaBrevo({ to, subject, text, html }, settings);
    }

    // Default to Gmail (legacy path)
    return sendViaGmail({ to, subject, text, html }, settings);
}

async function sendViaBrevo({ to, subject, text, html }: MailOptions, settings: GlobalSettings) {
    try {
        const apiKey = settings.brevoApiKey;
        const replyTo = settings.brevoReplyTo;
        const senderEmail = settings.brevoSenderEmail;
        const senderName = settings.brevoSenderName || "IKF Outreach";

        if (!apiKey || !senderEmail) {
            return { success: false, error: "Brevo SMTP is not configured. (Key or Sender missing)" };
        }

        // Diagnostic Marker for strict switching verification
        const diagnosticHtml = (html || "") + `<!-- Provider: BREVO | Sender: ${senderEmail} -->`;

        const body: any = {
            sender: { name: senderName, email: senderEmail },
            to: (to || "").split(',')
                .map(email => email.trim())
                .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                .map(email => ({ email })),
            subject: subject,
            htmlContent: diagnosticHtml,
            textContent: text,
        };

        if (body.to.length === 0) {
            return { success: false, error: "No valid recipients found after sanitization." };
        }

        if (replyTo) {
            body.replyTo = { email: replyTo };
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({ message: "Internal Brevo Error" }));
            console.error("[MAIL] Brevo API failure:", errData);
            return { success: false, error: errData.message || "Brevo dispatch failed" };
        }

        const result = await response.json();
        console.log("[MAIL] Brevo communication dispatched:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error: any) {
        console.error("[MAIL] Brevo dispatch failed with catch:", error);
        return { success: false, error: error.message };
    }
}

async function sendViaGmail({ to, subject, text, html }: MailOptions, settings: GlobalSettings) {
    const clientId = settings.googleClientId;
    const clientSecret = settings.googleClientSecret;

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
        // Keep fallback
    }

    const isConfigurationValid = user && clientId && clientSecret && refreshToken;

    if (!isConfigurationValid) {
        return {
            success: false,
            error: "Gmail configuration incomplete. Please reconnect identity in Settings."
        };
    }

    try {
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
            return {
                success: false,
                error: "Google OAuth refresh failed. Reconnect Gmail identity.",
            };
        }

        const diagnosticHtml = (html || "") + `<!-- Provider: GMAIL | Sender: ${user} -->`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: user,
                clientId: clientId,
                clientSecret: clientSecret,
                refreshToken: refreshToken,
            } as any,
        });

        const sanitizedTo = (to || "").split(',')
            .map(email => email.trim())
            .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            .join(', ');

        if (!sanitizedTo) {
            return { success: false, error: "No valid recipients found after sanitization." };
        }

        const info = await transporter.sendMail({
            from: `"IKF Outreach" <${user}>`,
            to: sanitizedTo,
            subject,
            text,
            html: diagnosticHtml,
        });

        console.log("[MAIL] Gmail communication dispatched:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("[MAIL] Gmail dispatch failed:", error);
        return { success: false, error: error.message };
    }
}
