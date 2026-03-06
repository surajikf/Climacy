import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import { isRoleBasedEmail } from "@/lib/email-utils";

const RAW_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_insecure_key_123456789012";
const ENCRYPTION_KEY = RAW_ENCRYPTION_KEY.padEnd(32, '0').substring(0, 32);

const RAW_ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default_iv_12345";
const ENCRYPTION_IV = RAW_ENCRYPTION_IV.padEnd(16, '0').substring(0, 16);

function decrypt(encryptedText: string | null): string | null {
    if (!encryptedText) return null;
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(ENCRYPTION_IV));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const sessionToken = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret" });

        if (!sessionToken || sessionToken.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access. Level-5 Clearance Required." }, { status: 403 });
        }

        const settings = await prisma.globalSettings.findFirst();

        if (!settings || !settings.zohoRefreshTokenEncrypted) {
            return NextResponse.json({ error: "Zoho is not connected. Please configure and authorize Zoho first." }, { status: 400 });
        }

        const clientId = decrypt(settings.zohoClientIdEncrypted);
        const clientSecret = decrypt(settings.zohoClientSecretEncrypted);
        const refreshToken = decrypt(settings.zohoRefreshTokenEncrypted);

        if (!clientId || !clientSecret || !refreshToken) {
            return NextResponse.json({ error: "Failed to decrypt Zoho credentials." }, { status: 500 });
        }

        const logMsg = (msg: string) => {
            console.log(msg);
            try { fs.appendFileSync('zoho-debug.log', `[${new Date().toISOString()}] ${msg}\n`); } catch (e) { }
        };

        // 1. Generate a fresh Access Token
        const tokenRes = await fetch(`https://accounts.zoho.in/oauth/v2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken
            })
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error || !tokenData.access_token) {
            logMsg(`Zoho Token Refresh Error: ${JSON.stringify(tokenData)}`);
            return NextResponse.json({ error: "Zoho Token Refresh failed." }, { status: 401 });
        }

        const accessToken = tokenData.access_token;

        // 2. Fetch ALL deals to avoid flaky search criteria
        // We filter in memory for "Strong Logic"
        const dealsRes = await fetch(`https://www.zohoapis.in/bigin/v1/Deals`, {
            headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });

        if (dealsRes.status === 204) {
            return NextResponse.json({ success: true, count: 0, message: "No deals in Zoho." });
        }

        const dealsData = await dealsRes.json();
        const allDeals = dealsData.data || [];

        logMsg(`Total Deals fetched from Zoho: ${allDeals.length}`);

        // Strong Filter Logic: Match Pipeline and Stage from Settings
        const targetPipeline = (settings.zohoPipelineName || "").toLowerCase().trim();
        const targetStage = (settings.zohoStageName || "").toLowerCase().trim();

        const filteredDeals = allDeals.filter((deal: any) => {
            const dealPipeline = (deal.Pipeline || "").toLowerCase().trim();
            const dealStage = (deal.Stage || "").toLowerCase().trim();

            // Match if pipeline STARTS WITH our setting (accommodate " Standard")
            const pipelineMatch = targetPipeline ? dealPipeline.startsWith(targetPipeline) : true;
            const stageMatch = targetStage ? dealStage === targetStage : true;

            return pipelineMatch && stageMatch;
        });

        logMsg(`Deals after filtering: ${filteredDeals.length}`);

        const syncedExternalIds: string[] = [];

        for (const deal of filteredDeals) {
            try {
                if (!deal.Contact_Name || !deal.Contact_Name.id) continue;

                // Fetch full contact details
                const contactRes = await fetch(`https://www.zohoapis.in/bigin/v1/Contacts/${deal.Contact_Name.id}`, {
                    headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
                });
                const contactData = await contactRes.json();
                const contact = contactData.data?.[0];

                if (!contact) continue;

                const email = contact.Email;
                if (!email) continue;

                const clientName = contact.Account_Name?.name || contact.Last_Name || deal.Deal_Name;
                const contactPerson = `${contact.First_Name || ""} ${contact.Last_Name || ""}`.trim();
                const zohoTags = (deal.Tag || []).map((t: any) => t.name);
                const externalId = String(deal.id);

                // Conflict Detection: Check for same email in database from OTHER sources
                const existing = await prisma.client.findFirst({
                    where: { email: email.toLowerCase() }
                });

                if (existing && existing.source !== "ZOHO_BIGIN") {
                    logMsg(`[CONFLICT] Client with email ${email} already exists from source ${existing.source}. Record updated.`);
                    conflictCount++;
                }

                // STRONG PROTECTION: Do not overwrite existing MANUAL clients that happen to have the same name/email
                // Use the compound unique key [source, externalId]
                await prisma.client.upsert({
                    where: {
                        source_externalId: {
                            source: "ZOHO_BIGIN",
                            externalId: externalId
                        }
                    },
                    update: {
                        clientName,
                        contactPerson,
                        email,
                        zohoTags,
                        isRoleBased: isRoleBasedEmail(email),
                    },
                    create: {
                        clientName,
                        contactPerson,
                        email,
                        industry: "Imported",
                        relationshipLevel: "Warm Lead",
                        source: "ZOHO_BIGIN",
                        externalId: externalId,
                        zohoTags,
                        isRoleBased: isRoleBasedEmail(email),
                    }
                });

                syncedExternalIds.push(externalId);
                importCount++;
            } catch (err: any) {
                logMsg(`Error processing Deal ${deal.id}: ${err.message}`);
            }
        }

        // 3. CLEANUP PHASE: Remove orphaned Zoho clients (Strict Sync)
        // If a deal was moved out of "Closed Won" (or the target stage), it won't be in filteredDeals
        // and thus won't be in syncedExternalIds. We should delete those local records.
        logMsg(`[STRICT_SYNC] Initiating cleanup for source ZOHO_BIGIN...`);
        const deleteResult = await prisma.client.deleteMany({
            where: {
                source: "ZOHO_BIGIN",
                externalId: {
                    notIn: syncedExternalIds
                }
            }
        });

        if (deleteResult.count > 0) {
            logMsg(`[STRICT_SYNC] Purged ${deleteResult.count} orphaned records from ZOHO_BIGIN.`);
        }

        return NextResponse.json({
            success: true,
            count: importCount,
            conflicts: conflictCount,
            purged: deleteResult.count
        });
    } catch (error: any) {
        console.error("Zoho Sync Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
