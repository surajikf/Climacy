import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Test database connection
        await prisma.$queryRaw`SELECT 1`;

        const stats = {
            database: "Connected",
            groq_key: process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "your_groq_api_key_here" ? "Configured" : "Missing/Default",
            timestamp: new Date().toISOString(),
            status: "Healthy"
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("Health check failed:", error);
        return NextResponse.json({
            status: "Unhealthy",
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
