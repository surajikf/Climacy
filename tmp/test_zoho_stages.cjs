
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
require('dotenv').config();

const RAW_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default_insecure_key_123456789012";
const ENCRYPTION_KEY = RAW_ENCRYPTION_KEY.padEnd(32, "0").substring(0, 32);
const RAW_ENCRYPTION_IV = process.env.ENCRYPTION_IV || "default_iv_12345";
const ENCRYPTION_IV = RAW_ENCRYPTION_IV.padEnd(16, "0").substring(0, 16);

function decrypt(text) {
    if (!text) return text;
    try {
        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(ENCRYPTION_KEY),
            Buffer.from(ENCRYPTION_IV)
        );
        let decrypted = decipher.update(Buffer.from(text, "hex"));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return text;
    }
}

async function main() {
    const prisma = new PrismaClient();
    const settings = await prisma.globalSettings.findFirst();
    if (!settings) {
        console.log("No settings found.");
        return;
    }

    const clientId = decrypt(settings.zohoClientIdEncrypted);
    const clientSecret = decrypt(settings.zohoClientSecretEncrypted);
    const refreshToken = decrypt(settings.zohoRefreshTokenEncrypted);

    console.log("Refreshing token...");
    const tokenRes = await fetch("https://accounts.zoho.in/oauth/v2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "refresh_token"
        })
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
        console.error("Failed to get access token:", tokenData);
        return;
    }

    console.log("Fetching pipelines and stages...");
    const pipelineRes = await fetch("https://www.zohoapis.in/bigin/v1/settings/pipelines", {
        headers: { "Authorization": `Zoho-oauthtoken ${accessToken}` }
    });
    
    if (pipelineRes.status === 200) {
        const data = await pipelineRes.json();
        console.log("Pipelines found:", JSON.stringify(data, null, 2));
    } else {
        console.error("Failed to fetch pipelines:", pipelineRes.status, await pipelineRes.text());
    }

    await prisma.$disconnect();
}

main();
