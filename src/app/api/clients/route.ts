import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isRoleBasedEmail } from "@/lib/email-utils";
import { createClient, listClients, RelationshipLevel } from "@/domain/clients";
import { z } from "zod";
import { ok, error } from "@/lib/api-response";
import { parseJsonBody } from "@/lib/validation";

function computeClientQuality(client: {
    email: string | null;
    industry: string | null;
    services: { id: string }[];
    invoiceServiceNames: string | null;
    phone: string | null;
    mobile: string | null;
    gstin: string | null;
}) {
    const missingFields: string[] = [];

    const email = client.email?.trim() || "";
    const hasEmail = !!email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValid = hasEmail && emailRegex.test(email);

    if (!hasEmail) missingFields.push("email");
    else if (!emailValid) missingFields.push("email_invalid");

    if (!client.industry) missingFields.push("industry");

    const hasStructuredServices = Array.isArray(client.services) && client.services.length > 0;
    const hasInvoiceServices = !!client.invoiceServiceNames;
    if (!hasStructuredServices && !hasInvoiceServices) missingFields.push("services");

    const hasAnyPhone = !!(client.phone || client.mobile);
    if (!hasAnyPhone) missingFields.push("phone");

    if (!client.gstin) missingFields.push("gstin");

    const maxSignals = 5;
    const missingCount = Math.min(missingFields.length, maxSignals);
    const completenessScore = Math.max(0, Math.round(((maxSignals - missingCount) / maxSignals) * 100));

    let level: "strong" | "medium" | "weak";
    if (completenessScore >= 80) level = "strong";
    else if (completenessScore >= 50) level = "medium";
    else level = "weak";

    return {
        completenessScore,
        level,
        missingFields,
    };
}

const createClientSchema = z.object({
    clientName: z.string().min(1, "Client name is required"),
    contactPerson: z.string().optional().nullable(),
    email: z.string().email("A valid email is required"),
    industry: z.string().optional().nullable(),
    relationshipLevel: z.custom<RelationshipLevel>().default("Active"),
    serviceIds: z.array(z.string().min(1)).default([]),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const industries = searchParams.getAll("industry");
        const levels = searchParams.getAll("level");
        const serviceIds = searchParams.getAll("service");
        const sources = searchParams.getAll("source");
        const showRoleBased = searchParams.get("roleBased") === "true";
        const search = searchParams.get("search")?.trim() || "";
        const sortField = (searchParams.get("sortField") || "lastInvoiceDate") as any;
        const sortDir = (searchParams.get("sortDir") === "asc" ? "asc" : "desc") as "asc" | "desc";

        const page = Math.max(parseInt(searchParams.get("page") || "1", 10) || 1, 1);
        const pageSizeRaw = parseInt(searchParams.get("pageSize") || "25", 10) || 25;

        const { data: clients, total, page: resolvedPage, pageSize } = await listClients({
            industries,
            levels,
            serviceIds,
            sources,
            showRoleBased,
            search,
            sortField,
            sortDir,
            page,
            pageSize: pageSizeRaw,
        });

        const emails = clients
            .map((c) => c.email?.toLowerCase().trim())
            .filter((e): e is string => !!e);

        let duplicateInfoByEmail = new Map<string, { count: number; sources: Set<string> }>();

        if (emails.length > 0) {
            const allWithEmails = await prisma.client.findMany({
                where: {
                    email: { in: emails },
                },
                select: {
                    email: true,
                    source: true,
                },
            });

            duplicateInfoByEmail = allWithEmails.reduce((map, row) => {
                const email = row.email?.toLowerCase().trim();
                if (!email) return map;
                const existing = map.get(email) || { count: 0, sources: new Set<string>() };
                existing.count += 1;
                if (row.source) existing.sources.add(row.source);
                map.set(email, existing);
                return map;
            }, new Map<string, { count: number; sources: Set<string> }>());
        }

        const enrichedClients = clients.map((client) => {
            const baseQuality = computeClientQuality({
                email: client.email,
                industry: client.industry,
                services: client.services,
                invoiceServiceNames: client.invoiceServiceNames,
                phone: client.phone,
                mobile: client.mobile,
                gstin: client.gstin,
            });

            const emailKey = client.email?.toLowerCase().trim() || "";
            const dupInfo = emailKey ? duplicateInfoByEmail.get(emailKey) : undefined;
            const hasDuplicates = !!dupInfo && dupInfo.count > 1;
            const hasCrossSourceConflict = !!dupInfo && dupInfo.sources.size > 1;

            return {
                ...client,
                quality: {
                    ...baseQuality,
                    hasDuplicates,
                    hasCrossSourceConflict,
                    sources: dupInfo ? Array.from(dupInfo.sources) : [],
                },
            };
        });

        return ok({
            clients: enrichedClients,
            total,
            page: resolvedPage,
            pageSize,
        });
    } catch (error: any) {
        console.error("Failed to fetch clients:", error);
        return error("INTERNAL_ERROR", "Failed to fetch clients");
    }
}

export async function POST(request: Request) {
    try {
        const parsed = await parseJsonBody(createClientSchema, request);
        if (!parsed.ok) {
            return parsed.response;
        }

        const body = parsed.data;

        const client = await createClient({
            clientName: body.clientName,
            contactPerson: body.contactPerson ?? undefined,
            email: body.email,
            industry: body.industry ?? undefined,
            relationshipLevel: body.relationshipLevel,
            serviceIds: body.serviceIds || [],
        });

        return ok(client);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return error("CONFLICT", "A client with this email already exists.");
        }
        console.error("Failed to create client:", error);
        return error("INTERNAL_ERROR", "Failed to create client");
    }
}
