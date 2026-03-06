import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/encryption";
import { isRoleBasedEmail } from "@/lib/email-utils";

export async function POST(request: Request) {
    try {
        const { accountId } = await request.json();
        if (!accountId) return NextResponse.json({ error: "Account ID required" }, { status: 400 });

        const account = await prisma.gmailAccount.findUnique({ where: { id: accountId } });
        if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

        // 1. Refresh Token / Get Access Token
        let accessToken = decrypt(account.accessTokenEncrypted || "");

        // Simple expiry check (if expired or missing)
        if (!accessToken || !account.expiresAt || account.expiresAt < new Date()) {
            const settings = await prisma.globalSettings.findUnique({ where: { id: "singleton" } });
            if (!settings?.googleClientIdEncrypted || !settings?.googleClientSecretEncrypted) {
                return NextResponse.json({ error: "Google OAuth credentials missing in Global Settings" }, { status: 500 });
            }

            const clientId = decrypt(settings.googleClientIdEncrypted);
            const clientSecret = decrypt(settings.googleClientSecretEncrypted);
            const refreshToken = decrypt(account.refreshTokenEncrypted);

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

            const tokens = await tokenResponse.json();
            if (!tokenResponse.ok) {
                console.error("Gmail Token Refresh Error:", tokens);
                return NextResponse.json({ error: "Failed to refresh Gmail access" }, { status: 500 });
            }

            accessToken = tokens.access_token;
            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

            await prisma.gmailAccount.update({
                where: { id: accountId },
                data: {
                    accessTokenEncrypted: encrypt(accessToken),
                    expiresAt
                }
            });
        }

        // 2. Fetch Recent Messages (Inbox and Sent)
        // We'll fetch the last 20 messages for each to keep it fast
        const messagesRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=40&q=after:2024/01/01`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { messages = [] } = await messagesRes.json();

        const contacts = new Map<string, { email: string; name: string }>();

        // 3. Extract Headers
        for (const msg of messages) {
            const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const detail = await detailRes.json();

            const headers = detail.payload?.headers || [];
            headers.forEach((h: any) => {
                const results = parseEmailHeader(h.value);
                results.forEach(res => {
                    if (res.email !== account.email && !res.email.includes("@noreply") && !res.email.includes("google.com")) {
                        contacts.set(res.email.toLowerCase(), res);
                    }
                });
            });
        }

        // 4. Upsert Clients
        let importedCount = 0;
        let conflictCount = 0;
        for (const [email, info] of contacts) {
            try {
                // Conflict Detection: Check for same email in database from OTHER sources
                const existing = await prisma.client.findFirst({
                    where: { email: email.toLowerCase() }
                });

                if (existing && existing.source !== "GMAIL") {
                    console.warn(`[CONFLICT] Client with email ${email} already exists in database from source ${existing.source}. Record updated.`);
                    conflictCount++;
                }

                // Use email as externalId for Gmail source to prevent duplicates per account
                await prisma.client.upsert({
                    where: {
                        source_externalId: {
                            source: "GMAIL",
                            externalId: `${account.id}:${email}`
                        }
                    },
                    update: {
                        clientName: info.name || email.split("@")[0].replace(/[._]/g, " "),
                        contactPerson: info.name || null,
                        gmailSourceAccount: account.accountName,
                        isRoleBased: isRoleBasedEmail(email),
                    },
                    create: {
                        clientName: info.name || email.split("@")[0].replace(/[._]/g, " "),
                        contactPerson: info.name || null,
                        email: email,
                        industry: "Corporate", // Default
                        relationshipLevel: "Warm Lead", // Default for new email contacts
                        source: "GMAIL",
                        externalId: `${account.id}:${email}`,
                        gmailSourceAccount: account.accountName,
                        isRoleBased: isRoleBasedEmail(email),
                    }
                });
                importedCount++;
            } catch (e) {
                console.error(`Failed to upsert gmail contact ${email}:`, e);
            }
        }

        return NextResponse.json({ success: true, count: importedCount, conflicts: conflictCount });

    } catch (error) {
        console.error("Gmail Sync Route Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

function parseEmailHeader(headerValue: string): { email: string; name: string }[] {
    const contacts: { email: string; name: string }[] = [];
    // Handles formats like: "John Doe <john@example.com>, Jane Smith <jane@example.com>"
    const parts = headerValue.split(",");

    parts.forEach(part => {
        const emailMatch = part.match(/<(.+@.+)>/);
        const email = emailMatch ? emailMatch[1].trim() : part.trim();

        if (email.includes("@")) {
            let name = "";
            if (emailMatch) {
                name = part.replace(emailMatch[0], "").replace(/["']/g, "").trim();
            }
            contacts.push({ email, name });
        }
    });

    return contacts;
}
