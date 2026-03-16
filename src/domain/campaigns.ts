import prisma from "@/lib/prisma";

export type CampaignType = "Broadcast" | "Targeted" | "Cross-Sell" | "Reactivation" | "Reactivate" | string;

export async function estimateCampaignAudience(type: CampaignType) {
  const normalizedType = type.toLowerCase();

  let where: any = {};

  if (normalizedType === "broadcast" || normalizedType === "cross-sell") {
    where = { relationshipLevel: { in: ["Active", "Warm Lead"] } };
  } else if (normalizedType === "reactivation" || normalizedType === "reactivate") {
    where = { relationshipLevel: "Past Client" };
  } else if (normalizedType === "targeted") {
    where = { relationshipLevel: "Active" };
  }

  const [count, industriesData] = await Promise.all([
    prisma.client.count({ where }),
    prisma.client.groupBy({
      by: ["industry"],
      where,
      _count: true,
    }),
  ]);

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

