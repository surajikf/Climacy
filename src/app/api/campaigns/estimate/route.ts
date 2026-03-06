import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        console.log(`[Estimate API] Fetching audience for type: ${type}`);

        if (!type) {
            return NextResponse.json({ success: false, error: "Campaign type is required", count: 0 }, { status: 400 });
        }

        const db = prisma;
        let where: any = {};

        // Normalise type for case-insensitive matching
        const normalizedType = type.toLowerCase();

        if (normalizedType === "broadcast" || normalizedType === "cross-sell") {
            where = { relationshipLevel: { in: ["Active", "Warm Lead"] } };
        } else if (normalizedType === "reactivation" || normalizedType === "reactivate") {
            where = { relationshipLevel: "Past Client" };
        } else if (normalizedType === "targeted") {
            where = { relationshipLevel: "Active" };
        } else {
            console.warn(`[Estimate API] Unrecognized campaign type: ${type}. Defaulting to empty filters.`);
        }

        // Global isolation is now handled by Prisma extension

        const [count, industriesData] = await Promise.all([
            db.client.count({ where }),
            db.client.groupBy({
                by: ['industry'],
                where: where,
                _count: true
            })
        ]);

        console.log(`[Estimate API] Found ${count} clients in ${industriesData.length} industries.`);

        return NextResponse.json({
            success: true,
            count,
            industries: industriesData.map(i => i.industry)
        });
    } catch (error) {
        console.error("[Estimate API] Internal Failure:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error", count: 0 }, { status: 500 });
    }
}
