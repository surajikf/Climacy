import prisma from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { ok, error } from "@/lib/api-response";

export async function GET() {
    try {
        const accounts = await prisma.gmailAccount.findMany({
            select: {
                id: true,
                accountName: true,
                email: true,
                updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
        });
        return ok({ accounts });
    } catch (err) {
        console.error("Failed to fetch Gmail accounts:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) {
            return error("VALIDATION_ERROR", "ID required", { status: 400 });
        }

        await prisma.gmailAccount.delete({ where: { id } });
        return ok({ deletedId: id });
    } catch (err) {
        console.error("Failed to delete Gmail account:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
