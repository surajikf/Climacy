import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        const clients = await prisma.client.findMany({
            take: 1,
            select: { id: true, isRoleBased: true }
        })
        console.log('Success: isRoleBased column found. Result:', clients)
    } catch (e: any) {
        console.log('Error:', e.message)
    } finally {
        await prisma.$disconnect()
    }
}

main()
