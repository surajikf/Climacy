import prisma from "@/lib/prisma";
import crypto from "crypto";
import fs from "fs";
import { isRoleBasedEmail } from "@/lib/email-utils";

const RAW_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_insecure_key_123456789012";
const ENCRYPTION_KEY = RAW_ENCRYPTION_KEY.padEnd(32, "0").substring(0, 32);

const RAW_ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default_iv_12345";
const ENCRYPTION_IV = RAW_ENCRYPTION_IV.padEnd(16, "0").substring(0, 16);

function decrypt(encryptedText: string | null): string | null {
  if (!encryptedText) return null;
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      Buffer.from(ENCRYPTION_IV)
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export interface ZohoSyncResult {
  count: number;
  conflicts: number;
  purged: number;
}

export async function syncZohoDeals(): Promise<ZohoSyncResult> {
  const settings = await prisma.globalSettings.findFirst();

  if (!settings || !settings.zohoRefreshTokenEncrypted) {
    throw new Error("Zoho is not connected. Please configure and authorize Zoho first.");
  }

  const clientId = decrypt(settings.zohoClientIdEncrypted);
  const clientSecret = decrypt(settings.zohoClientSecretEncrypted);
  const refreshToken = decrypt(settings.zohoRefreshTokenEncrypted);

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Failed to decrypt Zoho credentials.");
  }

  const logMsg = (msg: string) => {
    console.log(msg);
    try {
      fs.appendFileSync("zoho-debug.log", `[${new Date().toISOString()}] ${msg}\n`);
    } catch {
      // ignore logging failures
    }
  };

  const tokenRes = await fetch(`https://accounts.zoho.in/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error || !tokenData.access_token) {
    logMsg(`Zoho Token Refresh Error: ${JSON.stringify(tokenData)}`);
    throw new Error("Zoho Token Refresh failed.");
  }

  const accessToken = tokenData.access_token;

  const dealsRes = await fetch(`https://www.zohoapis.in/bigin/v1/Deals`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });

  if (dealsRes.status === 204) {
    return { count: 0, conflicts: 0, purged: 0 };
  }

  const dealsData = await dealsRes.json();
  const allDeals = dealsData.data || [];

  logMsg(`Total Deals fetched from Zoho: ${allDeals.length}`);

  const targetPipeline = (settings.zohoPipelineName || "").toLowerCase().trim();
  const targetStage = (settings.zohoStageName || "").toLowerCase().trim();

  const filteredDeals = allDeals.filter((deal: any) => {
    const dealPipeline = (deal.Pipeline || "").toLowerCase().trim();
    const dealStage = (deal.Stage || "").toLowerCase().trim();

    const pipelineMatch = targetPipeline ? dealPipeline.startsWith(targetPipeline) : true;
    const stageMatch = targetStage ? dealStage === targetStage : true;

    return pipelineMatch && stageMatch;
  });

  logMsg(`Deals after filtering: ${filteredDeals.length}`);

  let importCount = 0;
  let conflictCount = 0;
  const syncedExternalIds: string[] = [];

  const fieldMapping = (settings.zohoFieldMapping as any[]) || [];

  for (const deal of filteredDeals) {
    try {
      if (!deal.Contact_Name || !deal.Contact_Name.id) continue;

      const contactRes = await fetch(`https://www.zohoapis.in/bigin/v1/Contacts/${deal.Contact_Name.id}`, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
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

      const existing = await prisma.client.findFirst({
        where: { email: email.toLowerCase() },
      });

      // Dynamic Field Mapping
      const mappedData: any = {
        clientName,
        contactPerson,
        email,
        primaryEmail: email.split(",")[0].trim(),
        zohoTags,
        isRoleBased: isRoleBasedEmail(email),
        metadata: (existing?.metadata as any) || {},
      };

      const metadata: any = { ...(mappedData.metadata || {}) };

      for (const mapping of fieldMapping) {
        const [module, fieldName] = mapping.zohoField.split(".");
        let value = null;

        if (module === "deal") {
          value = deal[fieldName];
        } else if (module === "contact") {
          value = contact[fieldName];
        }

        if (value !== null && value !== undefined) {
          if (mapping.appField === "metadata") {
            metadata[fieldName] = value;
          } else {
            mappedData[mapping.appField] = String(value);
          }
        }
      }
      
      mappedData.metadata = metadata;

      if (existing && existing.source !== "ZOHO_BIGIN") {
        logMsg(
          `[CONFLICT] Client with email ${email} already exists from source ${existing.source}. Record updated.`
        );
        conflictCount++;
      }

      // We use raw SQL for the upsert to bypass Prisma client generation issues (EPERM)
      // and ensure new fields like 'metadata' are saved even if the client is out of date.
      const cuid = () => Math.random().toString(36).substring(2, 11); // Simple fallback for id if needed
      
      const upsertSql = `
        INSERT INTO "Client" (
          "id", "clientName", "contactPerson", "email", "industry", "relationshipLevel", 
          "source", "externalId", "zohoTags", "isRoleBased", "primaryEmail", "metadata", 
          "updatedAt", "createdAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7::"ClientSource", $8, $9::text[], $10, $11, $12::jsonb, NOW(), NOW()
        )
        ON CONFLICT ("source", "externalId") DO UPDATE SET
          "clientName" = EXCLUDED."clientName",
          "contactPerson" = EXCLUDED."contactPerson",
          "email" = EXCLUDED."email",
          "primaryEmail" = EXCLUDED."primaryEmail",
          "zohoTags" = EXCLUDED."zohoTags",
          "isRoleBased" = EXCLUDED."isRoleBased",
          "metadata" = EXCLUDED."metadata",
          "updatedAt" = NOW()
      `;

      await prisma.$executeRawUnsafe(
        upsertSql,
        existing?.id || `c${cuid()}`,
        mappedData.clientName,
        mappedData.contactPerson,
        mappedData.email,
        mappedData.industry || "Imported",
        mappedData.relationshipLevel || "Warm Lead",
        "ZOHO_BIGIN",
        externalId,
        mappedData.zohoTags,
        mappedData.isRoleBased,
        mappedData.primaryEmail,
        JSON.stringify(mappedData.metadata)
      );

      logMsg(`[Zoho Sync] Successfully synced client: ${clientName} (Role-Based: ${isRoleBasedEmail(email)})`);
      syncedExternalIds.push(externalId);
      importCount++;
    } catch (err: any) {
      logMsg(`Error processing Deal ${deal.id}: ${err.message}`);
    }
  }

  logMsg(`[STRICT_SYNC] Initiating cleanup for source ZOHO_BIGIN...`);
  const deleteResult = await prisma.client.deleteMany({
    where: {
      source: "ZOHO_BIGIN",
      externalId: {
        notIn: syncedExternalIds,
      },
    },
  });

  if (deleteResult.count > 0) {
    logMsg(`[STRICT_SYNC] Purged ${deleteResult.count} orphaned records from ZOHO_BIGIN.`);
  }

  return {
    count: importCount,
    conflicts: conflictCount,
    purged: deleteResult.count,
  };
}

