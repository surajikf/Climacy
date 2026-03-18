import prisma from "@/lib/prisma";

export type CampaignType = "Broadcast" | "Targeted" | "Cross-Sell" | "Reactivation" | "Reactivate" | string;

export async function estimateCampaignAudience(type: CampaignType, serviceFilters: string[] = [], serviceLogic: 'AND' | 'OR' = 'OR', excludedIds: string[] = []) {
  const normalizedType = type.toLowerCase();

  let where: any = {};

  if (normalizedType === "broadcast" || normalizedType === "cross-sell") {
    where = { relationshipLevel: { in: ["Active", "Warm Lead"] } };
  } else if (normalizedType === "reactivation" || normalizedType === "reactivate") {
    where = { relationshipLevel: "Past Client" };
  } else if (normalizedType === "targeted") {
    where = { relationshipLevel: "Active" };
  }

  // Inject Exclusions
  if (excludedIds.length > 0) {
    where.id = { notIn: excludedIds };
  }

  // Ultra-Smart Multi-Service Segmentation
  if (serviceFilters.length > 0 && !serviceFilters.includes("All")) {
    const serviceQueries = serviceFilters.map(service => ({
      invoiceServiceNames: { contains: service, mode: "insensitive" as const }
    }));
    
    if (serviceLogic === "AND") {
      where.AND = serviceQueries;
    } else {
      where.OR = serviceQueries;
    }
  }

  // Sequentialize to avoid PgBouncer/Transaction mode concurrency hangs
  const count = await prisma.client.count({ where });
  const industriesData = await prisma.client.groupBy({
    by: ["industry"],
    where,
    _count: { _all: true },
  });

  return {
    count,
    industries: industriesData.map((i) => i.industry),
  };
}

export interface CampaignHistoryFilter {
  limit?: number;
  search?: string;
  type?: string;
}

export async function listCampaignHistory(filter: CampaignHistoryFilter = {}) {
  const { limit = 50, search = "", type = "" } = filter;

  const where: any = {
    client: {
      isRoleBased: false,
    },
  };

  if (search) {
    where.OR = [
      { campaignTopic: { contains: search, mode: "insensitive" } },
      { generatedOutput: { contains: search, mode: "insensitive" } },
      { client: { clientName: { contains: search, mode: "insensitive" } } },
      { client: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (type && type !== "All") {
    where.campaignType = type;
  }

  const history = await prisma.campaignHistory.findMany({
    where,
    take: limit,
    orderBy: {
      dateCreated: "desc",
    },
    include: {
      client: true,
    },
  });

  return history;
}

export async function getTargetClients(type: CampaignType, serviceFilters: string[] = [], serviceLogic: 'AND' | 'OR' = 'OR', excludedIds: string[] = [], includeExclusions: boolean = false) {
  const normalizedType = type.toLowerCase();
  let where: any = {};

  if (normalizedType === "broadcast" || normalizedType === "cross-sell") {
    where = { relationshipLevel: { in: ["Active", "Warm Lead"] } };
  } else if (normalizedType === "reactivation" || normalizedType === "reactivate") {
    where = { relationshipLevel: "Past Client" };
  } else if (normalizedType === "targeted") {
    where = { relationshipLevel: "Active" };
  }

  // Inject Exclusions (Skip if includeExclusions is true for UI persistence)
  if (excludedIds.length > 0 && !includeExclusions) {
    where.id = { notIn: excludedIds };
  }

  // Ultra-Smart Multi-Service Segmentation
  if (serviceFilters.length > 0 && !serviceFilters.includes("All")) {
    const serviceQueries = serviceFilters.map(service => ({
      invoiceServiceNames: { contains: service, mode: "insensitive" as const }
    }));
    
    if (serviceLogic === "AND") {
      where.AND = serviceQueries;
    } else {
      where.OR = serviceQueries;
    }
  }

  return await prisma.client.findMany({
    where,
    select: {
      id: true,
      clientName: true,
      industry: true,
      contactPerson: true,
      relationshipLevel: true,
      clientAddedOn: true,
      lastInvoiceDate: true,
      invoiceServiceNames: true,
    },
    orderBy: { clientName: "asc" },
  });
}

