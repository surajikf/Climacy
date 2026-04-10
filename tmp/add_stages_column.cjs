
const { PrismaClient } = require("@prisma/client");
require('dotenv').config();

async function main() {
  // Use DIRECT_URL for schema-altering operations to bypass PGBouncer issues
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL
      }
    }
  });
  
  try {
    // Check if column exists, if not add it
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'GlobalSettings' AND column_name = 'zohoStages') THEN
          ALTER TABLE "GlobalSettings" ADD COLUMN "zohoStages" JSONB DEFAULT '[]';
        END IF;
      END $$;
    `);
    console.log("Column zohoStages added successfully (or already existed).");
  } catch (e) {
    console.error("Failed to add column:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
