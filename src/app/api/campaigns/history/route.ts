import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "50");
        const search = searchParams.get("search") || "";
        const type = searchParams.get("type") || "";

        const where: any = {
            client: {
                isRoleBased: false
            }
        };

        if (search) {
            where.OR = [
                { campaignTopic: { contains: search, mode: 'insensitive' } },
                { generatedOutput: { contains: search, mode: 'insensitive' } },
                { client: { clientName: { contains: search, mode: 'insensitive' } } },
                { client: { email: { contains: search, mode: 'insensitive' } } }
            ];
        }

        if (type && type !== "All") {
            where.campaignType = type;
        }

        const history = await prisma.campaignHistory.findMany({
            where,
            take: limit,
            orderBy: {
                dateCreated: "desc",
            },
            include: {
                client: true,
            },
        });

        return NextResponse.json(history);
    } catch (error: any) {
        console.error("Failed to fetch history:", error);
        return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
    }
}
