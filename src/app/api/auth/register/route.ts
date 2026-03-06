import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists with this email endpoint." }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Enforce the super-admin status immediately based on the email
        const isSuperAdmin = email.toLowerCase() === "suraj.sonnar@ikf.co.in";
        const role = isSuperAdmin ? "ADMIN" : "USER";
        const status = isSuperAdmin ? "APPROVED" : "PENDING";

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
                status,
            },
        });

        return NextResponse.json(
            { message: "Neural profile created successfully.", user: { id: user.id, email: user.email, role: user.role, status: user.status } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
