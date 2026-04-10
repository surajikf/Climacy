
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
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
