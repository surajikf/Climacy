import { syncZohoDeals } from "@/domain/integrations";
import { ok, error } from "@/lib/api-response";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.user_metadata?.role !== "ADMIN") {
            return error(
                "FORBIDDEN",
                "Unauthorized access. Level-5 Clearance Required.",
                { status: 403 },
            );
        }

        try {
            const result = await syncZohoDeals();

            return ok(result);
        } catch (err: any) {
            if (err.message?.includes("not connected") || err.message?.includes("decrypt")) {
                return error("BAD_REQUEST", err.message, { status: 400 });
            }
            console.error("Zoho Sync Error:", err);
            return error("INTEGRATION_ERROR", "Zoho sync failed", {
                status: 502,
                details: { message: err.message },
            });
        }
    } catch (err: any) {
        console.error("Zoho Sync Error:", err);
        return error("INTERNAL_ERROR", "Internal Server Error", {
            details: { message: err.message },
        });
    }
}
