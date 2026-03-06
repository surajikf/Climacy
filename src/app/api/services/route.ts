import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        console.time("fetchServicesAPI");
        const services = await prisma.service.findMany({
            orderBy: {
                serviceName: "asc",
            },
        });
        console.timeEnd("fetchServicesAPI");
        return NextResponse.json(services);
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serviceName, category, description } = body;

        if (!serviceName) {
            return NextResponse.json({ error: "Service name is required." }, { status: 400 });
        }

        const newService = await prisma.service.create({
            data: {
                serviceName,
                category,
                description,
            },
        });

        return NextResponse.json(newService);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "A service with this name already exists in the matrix." }, { status: 400 });
        }
        console.error("Failed to create service:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
