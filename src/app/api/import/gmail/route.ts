import prisma from "@/lib/prisma";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const gmailImportSchema = z.object({
    accountId: z.string().min(1, "Account ID required"),
});

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.user_metadata?.role !== "ADMIN") {
            return error("FORBIDDEN", "Unauthorized access. Level-5 Clearance Required.", {
                status: 403,
            });
        }

        const json = await request.json();
        const parsed = gmailImportSchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Account ID required", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { accountId } = parsed.data;

        const account = await prisma.gmailAccount.findUnique({
            where: { id: accountId },
        });
        if (!account) {
            return error("NOT_FOUND", "Account not found", { status: 404 });
        }

        // Fast UX: run Gmail import in the background as a job.
        const job = await (prisma as any).job.create({
            data: {
                type: "GMAIL_IMPORT",
                status: "QUEUED",
                progress: 0,
                payload: { accountId },
            },
        });

        return ok({ jobId: job.id }, { status: 202 });
    } catch (err: any) {
        console.error("Gmail Sync Route Error:", err);
        return error("INTERNAL_ERROR", "Internal Server Error", {
            details: { message: err.message },
        });
    }
}
