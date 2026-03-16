import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Fetching all manual clients...");
    
    const allManual = await prisma.client.findMany({
        where: { source: 'MANUAL' },
        select: {
            id: true,
            clientName: true,
            email: true,
            createdAt: true
        }
    });

    console.log(`📊 Total Manual Clients: ${allManual.length}`);
    allManual.forEach(c => {
        console.log(`- ${c.clientName} (${c.email}) | ID: ${c.id}`);
    });
}

main()
    .catch(e => {
        console.error("❌ Error running scan:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
