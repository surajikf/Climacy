
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const settings = await prisma.globalSettings.findFirst();
    console.log("Global Settings fetched:");
    console.log(JSON.stringify({
      zohoSyncAllToMetadata: settings?.zohoSyncAllToMetadata,
      zohoExcludedFields: settings?.zohoExcludedFields,
      hasClientId: !!settings?.zohoClientIdEncrypted,
      hasRefreshToken: !!settings?.zohoRefreshTokenEncrypted
    }, null, 2));
  } catch (e) {
    console.error("Verification failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
