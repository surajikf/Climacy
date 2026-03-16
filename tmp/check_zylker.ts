import { PrismaClient } from '../src/generated/client';
const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Check ---');
    const clients = await prisma.client.findMany({
        where: {
            OR: [
                { clientName: { contains: 'Zylker', mode: 'insensitive' } },
                { email: { contains: 'support@bigin.com', mode: 'insensitive' } }
            ]
        }
    });

    if (clients.length === 0) {
        console.log('No client found matching Zylker or support@bigin.com');
    } else {
        clients.forEach(c => {
            console.log(`Found: ${c.clientName} | Email: ${c.email} | isRoleBased: ${c.isRoleBased} | Source: ${c.source}`);
        });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
