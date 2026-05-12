import { estimateCampaignAudience } from "@/domain/campaigns";
import { ok, error } from "@/services/api-response";
import { hasInvoiceAccess, getBackendSession } from "@/services/auth";
import { z } from "zod";

const estimateQuerySchema = z.object({
    audienceSource: z.enum(["INVOICE_SYSTEM", "ZOHO_BIGIN", "GMAIL"]).optional(),
    audienceSources: z.array(z.enum(["INVOICE_SYSTEM", "ZOHO_BIGIN", "GMAIL"])).optional(),
    type: z.string().min(1, "Campaign type is required"),
    serviceFilters: z.array(z.string()).optional().default([]),
    serviceLogic: z.enum(["AND", "OR"]).optional().default("OR"),
    excludedClientIds: z.array(z.string()).optional().default([]),
});

export async function POST(request: Request) {
    try {
        const session = await getBackendSession(request);
        const user = session?.user;
        const isAdmin = user?.role === "ADMIN";
        const scopedUserId = isAdmin ? undefined : user?.id;

        const json = await request.json();
        const parsed = estimateQuerySchema.safeParse(json);

        if (!parsed.success) {
            return error("VALIDATION_ERROR", "Invalid estimation parameters", {
                status: 400,
                details: parsed.error.flatten(),
            });
        }

        const { audienceSource, audienceSources, type, serviceFilters, serviceLogic, excludedClientIds } = parsed.data;
        const resolvedSources = (audienceSources && audienceSources.length > 0)
            ? audienceSources
            : (audienceSource ? [audienceSource] : []);
        if (resolvedSources.length === 0) {
            return error("VALIDATION_ERROR", "Audience source is required", { status: 400 });
        }
        if (resolvedSources.includes("INVOICE_SYSTEM") && !await hasInvoiceAccess(request)) {
            return error("FORBIDDEN", "Invoice data access is not enabled for this user.", { status: 403 });
        }
        const { count, industries } = await estimateCampaignAudience(resolvedSources as any, type, serviceFilters, serviceLogic, excludedClientIds, scopedUserId);

        return ok({ count, industries });
    } catch (err) {
        console.error("[Estimate API] Internal Failure:", err);
        return error("INTERNAL_ERROR", "Internal Server Error");
    }
}
