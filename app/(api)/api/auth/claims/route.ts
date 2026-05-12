import { ok, error } from "@/services/api-response";
import { resolveUserClaims } from "@/services/auth-claims";
import { z } from "zod";

const claimsSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse claims JSON:", text);
      return error("VALIDATION_ERROR", "Invalid JSON payload", { status: 400 });
    }
    const parsed = claimsSchema.safeParse(json);
    if (!parsed.success) {
      return error("VALIDATION_ERROR", "Invalid payload structure", { status: 400, details: parsed.error.flatten() });
    }

    const { email, name } = parsed.data;
    const user = await resolveUserClaims(email, name ?? null);

    return ok({ user });
  } catch (err) {
    console.error("Claims sync error:", err);
    return error("INTERNAL_ERROR", "Failed to resolve user claims.");
  }
}

