import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Scanning for potential dummy clients...");
    
    // Look for clients with:
    // 1. Emails containing 'example.com', 'test.com', 'dummy.com'
    // 2. Names containing 'Test', 'Dummy', 'Placeholder'
    // 3. MANUAL source with missing info
    const potentialDummies = await prisma.client.findMany({
        where: {
            OR: [
                { email: { contains: 'example.com', mode: 'insensitive' } },
                { email: { contains: 'test.com', mode: 'insensitive' } },
                { email: { contains: 'dummy', mode: 'insensitive' } },
                { clientName: { contains: 'Test', mode: 'insensitive' } },
                { clientName: { contains: 'Dummy', mode: 'insensitive' } },
                { clientName: { contains: 'Placeholder', mode: 'insensitive' } },
            ]
        },
        select: {
            id: true,
            clientName: true,
            email: true,
            source: true,
            externalId: true
        }
    });

    if (potentialDummies.length === 0) {
        console.log("✅ No obvious dummy clients found based on standard patterns.");
        return;
    }

    console.log(`📊 Found ${potentialDummies.length} potential dummy clients:`);
    potentialDummies.forEach(c => {
        console.log(`- [${c.source}] ${c.clientName} (${c.email}) | ID: ${c.id}`);
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
