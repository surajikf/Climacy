import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/services/email-utils";
import { ok, error } from "@/services/api-response";
import { isAdmin } from "@/services/auth";

export async function POST(req: Request) {
    try {
        if (!await isAdmin(req)) {
            return error("FORBIDDEN", "Unauthorized access.", { status: 403 });
        }

        const all = await prisma.client.findMany({
            select: { id: true, email: true, isRoleBased: true },
        });

        const toFix = all.filter(c => {
            if (!c.email) return false;
            const expected = isRoleBasedEmail(c.email);
            return expected !== c.isRoleBased;
        });

        if (toFix.length === 0) {
            return ok({ fixed: 0, message: "All records already correct." });
        }

        await Promise.all(
            toFix.map(c =>
                prisma.client.update({
                    where: { id: c.id },
                    data: { isRoleBased: isRoleBasedEmail(c.email!) },
                }).catch(() => {})
            )
        );

        return ok({ fixed: toFix.length, total: all.length, message: `Backfilled isRoleBased for ${toFix.length} records.` });
    } catch (err: any) {
        console.error("Backfill error:", err);
        return error("INTERNAL_ERROR", err.message || "Backfill failed", { status: 500 });
    }
}
