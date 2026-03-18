import prisma from "@/lib/prisma";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.user_metadata?.role !== "ADMIN") {
            return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });

        return Response.json(users);
    } catch (err) {
        console.error("Admin Users GET Error:", err);
        return error("INTERNAL_ERROR", "Failed to fetch users.");
    }
}

export async function PUT(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.user_metadata?.role !== "ADMIN") {
            return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
        }

        const { userId, action } = await req.json();

        if (!userId || !action) {
            return error("BAD_REQUEST", "UserId and action are required.");
        }

        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) {
            return error("NOT_FOUND", "User not found.");
        }

        const updateData: any = {};

        switch (action) {
            case "APPROVE":
                updateData.status = "APPROVED";
                break;
            case "BAN":
                updateData.status = "BANNED";
                break;
            case "MAKE_ADMIN":
                updateData.role = "ADMIN";
                break;
            case "REVOKE_ADMIN":
                updateData.role = "USER";
                break;
            default:
                return error("BAD_REQUEST", "Invalid action.");
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return ok({ updated: true });
    } catch (err) {
        console.error("Admin Users PUT Error:", err);
        return error("INTERNAL_ERROR", "Failed to update user.");
    }
}
