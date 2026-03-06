import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Client' AND column_name = 'isRoleBased'
    `
        console.log('SQL Result:', result)
    } catch (e: any) {
        console.log('Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
