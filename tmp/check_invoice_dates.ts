import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking Database for Last Invoice Dates...");
    
    const invoiceClients = await prisma.client.findMany({
        where: { source: 'INVOICE_SYSTEM' },
        select: {
            clientName: true,
            lastInvoiceDate: true,
            externalId: true
        }
    });

    if (invoiceClients.length === 0) {
        console.log("⚠️ No clients found from INVOICE_SYSTEM. Please run a sync first.");
        return;
    }

    console.log(`📊 Found ${invoiceClients.length} clients from Invoice System.`);
    
    const withDates = invoiceClients.filter(c => c.lastInvoiceDate !== null);
    console.log(`✅ Clients with valid Last Invoice Date: ${withDates.length}`);
    
    if (withDates.length > 0) {
        console.log("\nSample Data:");
        withDates.slice(0, 5).forEach(c => {
            console.log(`- ${c.clientName}: ${c.lastInvoiceDate?.toISOString()} (ID: ${c.externalId})`);
        });
    }

    const withoutDates = invoiceClients.filter(c => c.lastInvoiceDate === null);
    if (withoutDates.length > 0) {
        console.log(`\n⚠️ ${withoutDates.length} clients are missing dates. Sample:`);
        withoutDates.slice(0, 3).forEach(c => console.log(`- ${c.clientName} (ID: ${c.externalId})`));
    }
}

main()
    .catch(e => {
        console.error("❌ Error running verification:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
