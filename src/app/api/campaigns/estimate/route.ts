import { estimateCampaignAudience } from "@/domain/campaigns";
import { ok, error } from "@/lib/api-response";
import { z } from "zod";

const estimateQuerySchema = z.object({
    type: z.string().min(1, "Campaign type is required"),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const parsed = estimateQuerySchema.safeParse({
            type: searchParams.get("type"),
        });

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Campaign type is required", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { type } = parsed.data;

        console.log(`[Estimate API] Fetching audience for type: ${type}`);

        const { count, industries } = await estimateCampaignAudience(type);

        console.log(
            `[Estimate API] Found ${count} clients in ${industries.length} industries.`,
        );

        return ok({
            count,
            industries,
        });
    } catch (err) {
        console.error("[Estimate API] Internal Failure:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
