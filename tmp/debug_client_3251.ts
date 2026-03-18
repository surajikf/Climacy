
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function debugClient() {
  const externalId = '3251';
  const client = await prisma.client.findFirst({
    where: { 
      source: 'INVOICE_SYSTEM',
      externalId: externalId
    },
    include: {
      services: true
    }
  });

  if (!client) {
    console.error('Client not found!');
    return;
  }

  console.log('--- Full Client Data (3251) ---');
  console.log(JSON.stringify(client, null, 2));
  console.log('-------------------------------');
}

debugClient()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
