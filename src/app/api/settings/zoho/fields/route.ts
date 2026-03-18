import prisma from "@/lib/prisma";
import crypto from "crypto";
import { error, ok } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";

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
  } catch (err) {
    console.error("Decryption failed:", err);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== "ADMIN") {
      return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
    }

    const settings = await prisma.globalSettings.findFirst();
    if (!settings || !settings.zohoRefreshTokenEncrypted) {
      return error("BAD_REQUEST", "Zoho is not connected.");
    }

    const clientId = decrypt(settings.zohoClientIdEncrypted);
    const clientSecret = decrypt(settings.zohoClientSecretEncrypted);
    const refreshToken = decrypt(settings.zohoRefreshTokenEncrypted);

    if (!clientId || !clientSecret || !refreshToken) {
      return error("INTERNAL_ERROR", "Failed to decrypt Zoho credentials.");
    }

    // Refresh token
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
      return error("INTEGRATION_ERROR", "Zoho Token Refresh failed.");
    }

    const accessToken = tokenData.access_token;

    // Fetch fields for Deals and Contacts
    const [dealsFieldsRes, contactsFieldsRes] = await Promise.all([
      fetch(`https://www.zohoapis.in/bigin/v1/settings/fields?module=Deals`, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }),
      fetch(`https://www.zohoapis.in/bigin/v1/settings/fields?module=Contacts`, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      }),
    ]);

    const dealsFieldsData = await dealsFieldsRes.json();
    const contactsFieldsData = await contactsFieldsRes.json();

    return ok({
      deals: dealsFieldsData.fields || [],
      contacts: contactsFieldsData.fields || [],
    });

  } catch (err: any) {
    console.error("Zoho Fields Error:", err);
    return error("INTERNAL_ERROR", "Internal Server Error", {
      details: { message: err.message },
    });
  }
}
