import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    const dummyIds = [
        'cmmbz3ej40002g5n8gz8jqvx2', // Infosys Limited
        'cmmbz3fkg0003g5n82mt36asy', // HDFC Bank
        'cmmbz3gm70004g5n8plkm0mgt', // Bharti Airtel
        'cmmbz3hnw0005g5n8igd8p03q', // Mahindra & Mahindra
        'cmmbz3ipa0006g5n8lc72xpub', // Zomato Limited
        'cmmbz3jvd0007g5n8kz475stf'  // Nykaa (FSN E-Commerce)
    ];

    console.log(`🧹 Deleting ${dummyIds.length} dummy clients...`);
    
    const result = await prisma.client.deleteMany({
        where: {
            id: { in: dummyIds }
        }
    });

    console.log(`✅ Deleted ${result.count} clients successfully.`);
}

main()
    .catch(e => {
        console.error("❌ Error running cleanup:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
