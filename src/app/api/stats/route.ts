import prisma from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";
import { ok, error } from "@/lib/api-response";

export async function GET() {
    try {
        // 1. Core Stats & Distribution in one pass using aggregations/parallel counts
        const thirtyDaysAgo = subDays(new Date(), 30);
        const sevenDaysAgo = subDays(startOfDay(new Date()), 6);

        const [
            levelCounts,
            trendCounts,
            industryCountsRaw,
            serviceUtilizationRaw,
            dataIntegrityRaw,
            dailyActivityRaw,
            recentCampaigns,
            sourceCountsRaw
        ] = await Promise.all([
            // Level distribution
            prisma.client.groupBy({
                by: ['relationshipLevel'],
                _count: true
            }),
            // Monthly trends
            Promise.all([
                prisma.client.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
                prisma.campaignHistory.count({ where: { dateCreated: { gte: thirtyDaysAgo } } })
            ]),
            // Industry distribution (Top 5)
            prisma.client.groupBy({
                by: ['industry'],
                _count: true,
                orderBy: { _count: { industry: 'desc' } },
                take: 5
            }),
            // Service utilization
            prisma.service.findMany({
                select: {
                    serviceName: true,
                    _count: {
                        select: {
                            clients: true
                        }
                    }
                },
                orderBy: { clients: { _count: 'desc' } }
            }),
            // Data integrity (count missing fields instead of fetching all)
            Promise.all([
                prisma.client.count(),
                prisma.client.count({
                    where: {
                        AND: [
                            { contactPerson: { not: null } },
                            { contactPerson: { not: "" } },
                            { email: { not: "" } },
                            { services: { some: {} } }
                        ]
                    }
                })
            ]),
            // Daily activity for chart
            Promise.all([
                prisma.campaignHistory.findMany({
                    where: { dateCreated: { gte: sevenDaysAgo } },
                    select: { dateCreated: true }
                }),
                prisma.client.findMany({
                    where: { createdAt: { gte: sevenDaysAgo } },
                    select: { createdAt: true }
                })
            ]),
            // Recent activity
            prisma.campaignHistory.findMany({
                take: 6,
                orderBy: { dateCreated: "desc" },
                select: {
                    id: true,
                    campaignType: true,
                    dateCreated: true,
                    client: {
                        select: {
                            clientName: true,
                            industry: true
                        }
                    }
                }
            }),
            // Source Breakdown
            prisma.client.groupBy({
                by: ['source', 'gmailSourceAccount'],
                _count: true
            })
        ]);

        const totalClients = dataIntegrityRaw[0];
        const completeProfiles = dataIntegrityRaw[1];
        const [newClientsLastMonth, campaignsLastMonth] = trendCounts;
        const [dailyCampaignsRaw, dailyClientsRaw] = dailyActivityRaw;

        // Process Source Counts
        const sourceStats = {
            zoho: 0,
            invoice: 0,
            gmail: [] as { email: string, count: number }[]
        };

        sourceCountsRaw.forEach((sc: any) => {
            if (sc.source === 'ZOHO_BIGIN') sourceStats.zoho += sc._count;
            if (sc.source === 'INVOICE_SYSTEM') sourceStats.invoice += sc._count;
            if (sc.source === 'GMAIL' && sc.gmailSourceAccount) {
                sourceStats.gmail.push({ email: sc.gmailSourceAccount, count: sc._count });
            }
        });

        // Process Level Counts
        const statsMap: Record<string, number> = { "Active": 0, "Warm Lead": 0, "Past Client": 0 };
        levelCounts.forEach(c => {
            if (c.relationshipLevel in statsMap) statsMap[c.relationshipLevel] = c._count;
        });

        // Process Chart Data & Sparklines
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(startOfDay(new Date()), 6 - i);
            return {
                label: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dateString: date.toDateString(),
                campaigns: 0,
                clients: 0
            };
        });

        dailyCampaignsRaw.forEach((c: any) => {
            const dateStr = new Date(c.dateCreated).toDateString();
            const day = last7Days.find(d => d.dateString === dateStr);
            if (day) day.campaigns++;
        });

        dailyClientsRaw.forEach((c: any) => {
            const dateStr = new Date(c.createdAt).toDateString();
            const day = last7Days.find(d => d.dateString === dateStr);
            if (day) day.clients++;
        });

        return ok({
            stats: {
                totalClients,
                activeClients: statsMap["Active"],
                warmLeads: statsMap["Warm Lead"],
                pastClients: statsMap["Past Client"],
                trends: {
                    clients: `+${newClientsLastMonth}`,
                    engagement: `+${campaignsLastMonth}`,
                    growth: totalClients > 0 ? `+${Math.round((newClientsLastMonth / totalClients) * 100)}%` : "0%",
                    sparklines: {
                        clients: last7Days.map(d => d.clients),
                        campaigns: last7Days.map(d => d.campaigns)
                    }
                }
            },
            chartData: last7Days.map(({ label, campaigns }) => ({ label, value: campaigns })),
            industryDistribution: industryCountsRaw.map(i => ({ label: i.industry || "Other", value: i._count })),
            serviceUtilization: serviceUtilizationRaw.map((s: any) => ({ label: s.serviceName, value: s._count?.clients || 0 })),
            integrityScore: totalClients > 0 ? Math.round((completeProfiles / totalClients) * 100) : 100,
            recentCampaigns: recentCampaigns.map(c => ({
                id: c.id,
                clientName: c.client?.clientName || "Unknown Client",
                industry: c.client?.industry || "Market",
                type: c.campaignType,
                date: c.dateCreated,
                status: "Sent"
            })),
            sourceStats
        });
    } catch (err) {
        console.error("Failed to fetch stats:", err);
        return error("INTERNAL_ERROR", "Failed to fetch stats");
    }
}
