
const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL
  });
  
  try {
    await client.connect();
    console.log("Connected to database successfully.");
    
    // Check if column exists, if not add it
    const query = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'GlobalSettings' AND column_name = 'zohoStages') THEN
          ALTER TABLE "GlobalSettings" ADD COLUMN "zohoStages" JSONB DEFAULT '[]';
        END IF;
      END $$;
    `;
    
    await client.query(query);
    console.log("Column zohoStages added successfully (or already existed).");
  } catch (e) {
    console.error("Failed to add column via pg:", e);
  } finally {
    await client.end();
  }
}

main();
