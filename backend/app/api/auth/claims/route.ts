import prisma from "@/backend/lib/prisma";
import { ok, error } from "@/backend/lib/api-response";
import { isPrimaryAdminEmail } from "@/backend/lib/auth-primary";
import { z } from "zod";
import crypto from "crypto";

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

    const email = parsed.data.email.trim().toLowerCase();
    const name = parsed.data.name ?? null;
    const superAdmin = isPrimaryAdminEmail(email);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        ...(name ? { name } : {}),
        ...(superAdmin ? { role: "ADMIN", status: "APPROVED" } : {}),
        ...(superAdmin ? { canAccessInvoiceData: true } : {}),
      },
      create: {
        id: crypto.randomUUID(),
        email,
        name,
        role: superAdmin ? "ADMIN" : "USER",
        status: superAdmin ? "APPROVED" : "PENDING",
        canAccessInvoiceData: superAdmin,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        canAccessInvoiceData: true,
      },
    });

    return ok({ user });
  } catch (err) {
    console.error("Claims sync error:", err);
    return error("INTERNAL_ERROR", "Failed to resolve user claims.");
  }
}
