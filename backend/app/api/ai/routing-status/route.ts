import { ok } from "@/backend/lib/api-response";
import { getAiRoutingSnapshot } from "@/backend/lib/ai-router";

export async function GET() {
  return ok(getAiRoutingSnapshot());
}
