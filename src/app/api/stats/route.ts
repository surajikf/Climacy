import prisma from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";
import { ok, error } from "@/lib/api-response";
import {
    buildProcessChecklist,
    computeAudienceState,
    computeCampaignState,
    computeDataHealth,
    pickNextBestAction,
} from "@/lib/dashboard-logic";

export async function GET() {
    try {
        type SourceCount = { source: string; gmailSourceAccount: string | null; _count: number };
        type DailyCampaign = { dateCreated: Date };
        type DailyClient = { createdAt: Date };
        type ServiceUsage = { serviceName: string; _count?: { clients?: number } };

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
            sourceCountsRaw,
            campaigns7dCount
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
            }),
            prisma.campaignHistory.count({
                where: { dateCreated: { gte: sevenDaysAgo } }
            }),
        ]);

        const totalClients = dataIntegrityRaw[0];
        const completeProfiles = dataIntegrityRaw[1];
        const [newClientsLastMonth, campaignsLastMonth] = trendCounts;
        const [dailyCampaignsRaw, dailyClientsRaw] = dailyActivityRaw;
        const noContact30d = await prisma.client.count({
            where: {
                OR: [
                    { lastContacted: null },
                    { lastContacted: { lt: thirtyDaysAgo } },
                ],
            },
        });

        // Process Source Counts
        const sourceStats = {
            zoho: 0,
            invoice: 0,
            gmail: [] as { email: string, count: number }[]
        };

        (sourceCountsRaw as SourceCount[]).forEach((sc) => {
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
        const activeClientsCount = statsMap["Active"] || 0;
        const warmLeadsCount = statsMap["Warm Lead"] || 0;
        const pastClientsCount = statsMap["Past Client"] || 0;
        const lastCampaignAt = recentCampaigns[0]?.dateCreated ?? null;
        const dataHealth = computeDataHealth(totalClients, completeProfiles, noContact30d);
        const audienceState = computeAudienceState(totalClients, activeClientsCount, warmLeadsCount, pastClientsCount, noContact30d);
        const campaignState = computeCampaignState(campaigns7dCount, campaignsLastMonth, lastCampaignAt);
        const recommendedAction = pickNextBestAction({
            totalClients,
            activeClients: activeClientsCount,
            warmLeads: warmLeadsCount,
            pastClients: pastClientsCount,
            completeProfiles,
            campaigns7d: campaigns7dCount,
            campaigns30d: campaignsLastMonth,
            noContact30d,
            lastCampaignAt,
        });
        const processChecklist = buildProcessChecklist(dataHealth, campaignState, recommendedAction);

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

        (dailyCampaignsRaw as DailyCampaign[]).forEach((c) => {
            const dateStr = new Date(c.dateCreated).toDateString();
            const day = last7Days.find(d => d.dateString === dateStr);
            if (day) day.campaigns++;
        });

        (dailyClientsRaw as DailyClient[]).forEach((c) => {
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
            serviceUtilization: (serviceUtilizationRaw as ServiceUsage[]).map((s) => ({ label: s.serviceName, value: s._count?.clients || 0 })),
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
            ,
            dataHealth,
            audienceState,
            campaignState,
            recommendedAction,
            processChecklist,
            updatedAt: new Date().toISOString(),
            confidence: totalClients >= 20 ? "High" : totalClients >= 5 ? "Medium" : "Low",
        });
    } catch (err) {
        console.error("Failed to fetch stats:", err);
        return error("INTERNAL_ERROR", "Failed to fetch stats");
    }
}
