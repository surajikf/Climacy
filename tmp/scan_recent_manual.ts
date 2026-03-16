import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Fetching most recent manual clients...");
    
    const recentClients = await prisma.client.findMany({
        where: { source: 'MANUAL' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
            id: true,
            clientName: true,
            email: true,
            createdAt: true
        }
    });

    if (recentClients.length === 0) {
        console.log("⚠️ No manual clients found.");
        return;
    }

    recentClients.forEach(c => {
        console.log(`- ${c.clientName} (${c.email}) | Created: ${c.createdAt} | ID: ${c.id}`);
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
