import { ok } from "@/services/api-response";
import { getAiRoutingSnapshot } from "@/services/ai-router";

export async function GET() {
  return ok(getAiRoutingSnapshot());
}

