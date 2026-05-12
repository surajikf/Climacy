import prisma from "@/lib/prisma";
import { isPrimaryAdminEmail } from "@/services/auth-primary";
import crypto from "crypto";

export async function resolveUserClaims(email: string, name: string | null = null) {
  const normalizedEmail = email.trim().toLowerCase();
  const superAdmin = isPrimaryAdminEmail(normalizedEmail);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      ...(name ? { name } : {}),
      ...(superAdmin ? { role: "ADMIN", status: "APPROVED" } : {}),
      ...(superAdmin ? { canAccessInvoiceData: true } : {}),
    },
    create: {
      id: crypto.randomUUID(),
      email: normalizedEmail,
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

  return user;
}
