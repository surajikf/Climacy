"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  Loader2,
  CheckCircle2,
  CircleDashed,
  AlertTriangle,
  Database,
  Users,
  Activity,
  Mail,
  LineChart,
  RefreshCw,
  Flame,
} from "lucide-react";
import { SmartLoader } from "@/components/SmartLoader";
import { DashboardStatsResponse } from "@/types/dashboard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      fetchStats(true);
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const fetchStats = async (silent = false) => {
    if (silent) setIsRefreshing(true);
    setLoadError(null);
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/stats");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setLastRefreshedAt(new Date());
      } else {
        setLoadError(result.error?.message || "Unable to fetch dashboard insights.");
      }
    } catch (err) {
      console.error(err);
      setLoadError("Unable to load dashboard right now.");
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  };

  if (loading) return <SmartLoader label="Analyzing Dashboard" description="Fetching real-time business metrics..." />;
  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center">
          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
          <h2 className="text-lg font-semibold text-slate-900">Dashboard unavailable</h2>
          <p className="text-sm text-slate-500">{loadError}</p>
          <button
            onClick={() => fetchStats(false)}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const safe = data || {
    stats: { totalClients: 0, activeClients: 0, warmLeads: 0, pastClients: 0, trends: { clients: "0", engagement: "0", growth: "0%", sparklines: { clients: [], campaigns: [] } } },
    chartData: [],
    industryDistribution: [],
    serviceUtilization: [],
    integrityScore: 100,
    recentCampaigns: [],
    sourceStats: { zoho: 0, invoice: 0, gmail: [] },
    dataHealth: { completeness: 100, staleRecords: 0, profileIntegrity: 100 },
    audienceState: { activeRatio: 0, warmRatio: 0, pastRatio: 0, noContact30d: 0 },
    campaignState: { lastCampaignAt: null, campaigns7d: 0, campaigns30d: 0, testDispatchFailures: 0 },
    recommendedAction: {
      actionType: "launch_targeted",
      reason: "No immediate risk detected.",
      impactEstimate: "Start a focused campaign for your best-fit audience.",
      targetCount: 0,
      ctaRoute: "/campaigns",
    },
    processChecklist: [],
    updatedAt: new Date().toISOString(),
    confidence: "Low" as const,
  };

  const summaryCards = [
    { id: "database", label: "Database", value: safe.stats.totalClients, sub: "total clients", icon: Database },
    { id: "activeRatio", label: "Active Ratio", value: `${safe.audienceState.activeRatio}%`, sub: "currently active", icon: Users },
    {
      id: "lastOutreach",
      label: "Last Outreach",
      value: safe.campaignState.lastCampaignAt
        ? formatDistanceToNow(new Date(safe.campaignState.lastCampaignAt), { addSuffix: true })
        : "No outreach yet",
      sub: "campaign recency",
      icon: Activity,
    },
  ];

  const maxTrendValue = Math.max(1, ...(safe.chartData || []).map((d) => d.value || 0));
  const clientSpark = safe?.stats?.trends?.sparklines?.clients || [];
  const campaignSpark = safe?.stats?.trends?.sparklines?.campaigns || [];
  const clientDelta = clientSpark.length > 1 ? clientSpark[clientSpark.length - 1] - clientSpark[0] : 0;
  const campaignDelta = campaignSpark.length > 1 ? campaignSpark[campaignSpark.length - 1] - campaignSpark[0] : 0;
  const activeWarmTotal = Math.max(1, safe.stats.activeClients + safe.stats.warmLeads + safe.stats.pastClients);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full px-4 md:px-8 xl:px-10 py-6 space-y-5">
        <header className="bg-card border border-border rounded-2xl px-5 py-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Operations Console</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground">Dashboard</h1>
            <div className="mt-2">
              <Breadcrumbs />
            </div>
            <p className="text-sm text-muted-foreground mt-1">One place to decide: what needs attention and what to do next.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(new Date(safe.updatedAt), { addSuffix: true })} · Confidence {safe.confidence}
              {lastRefreshedAt ? ` · Refreshed ${formatDistanceToNow(lastRefreshedAt, { addSuffix: true })}` : ""}
            </div>
            <button
              onClick={() => fetchStats(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div key={card.id} className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">{card.label}</span>
                <card.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-xl font-semibold text-foreground">{card.value}</div>
              <div className="text-xs text-muted-foreground">{card.sub}</div>
            </div>
          ))}
          <div className="bg-card border border-border rounded-2xl px-4 py-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-1">Profile Health</div>
            <div className="text-xl font-semibold text-foreground">{safe.dataHealth.profileIntegrity}%</div>
            <div className="text-xs text-muted-foreground">data integrity</div>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <section className="xl:col-span-4 bg-card border border-border rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Next Best Action</p>
            <h2 className="text-lg font-semibold text-foreground mb-2">{safe.recommendedAction.actionType.replace(/_/g, " ")}</h2>
            <p className="text-sm text-muted-foreground mb-2">{safe.recommendedAction.reason}</p>
            <p className="text-xs text-muted-foreground mb-4">
              Impact: {safe.recommendedAction.impactEstimate} · Target: {safe.recommendedAction.targetCount}
            </p>
            <button
              onClick={() => router.push(safe.recommendedAction.ctaRoute)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Take Action
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>

          <section className="xl:col-span-5 bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Today&apos;s Process</h3>
              <button onClick={() => router.push("/campaigns")} className="text-xs text-muted-foreground hover:text-foreground">Open campaigns</button>
            </div>
            <div className="space-y-2">
              {(safe.processChecklist || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border border-border rounded-xl px-3 py-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {item.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : item.status === "in_progress" ? (
                        <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                      ) : (
                        <CircleDashed className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm text-foreground truncate">{item.label}</span>
                    </div>
                    {item.details ? (
                      <div className="text-[11px] text-muted-foreground truncate mt-1">{item.details}</div>
                    ) : null}
                  </div>
                  <button onClick={() => router.push(item.route)} className="text-xs text-muted-foreground hover:text-foreground">Open</button>
                </div>
              ))}
              {(safe.processChecklist || []).length === 0 && (
                <div className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-3">
                  No process steps available yet. Start from Integrations.
                </div>
              )}
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <LineChart className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">7-day Outreach Trend</span>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {campaignDelta >= 0 ? "+" : ""}{campaignDelta} weekly change
                </span>
              </div>
              <div className="h-20 flex items-end gap-2">
                {(safe.chartData || []).map((point) => (
                  <div key={point.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-14 bg-muted rounded-md relative overflow-hidden">
                      <div
                        className="absolute bottom-0 inset-x-0 bg-primary rounded-md"
                        style={{ height: `${Math.max(6, Math.round((point.value / maxTrendValue) * 100))}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="xl:col-span-3 bg-card border border-border rounded-2xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Live Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">No contact 30d</span><span className="font-medium text-foreground">{safe.audienceState.noContact30d}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Campaigns (7d)</span><span className="font-medium text-foreground">{safe.campaignState.campaigns7d}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Campaigns (30d)</span><span className="font-medium text-foreground">{safe.campaignState.campaigns30d}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Client trend (7d)</span><span className="font-medium text-foreground">{clientDelta >= 0 ? "+" : ""}{clientDelta}</span></div>
            </div>
            <div className="pt-2 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Audience Mix</span>
                <span className="text-muted-foreground">{safe.stats.activeClients + safe.stats.warmLeads + safe.stats.pastClients} tracked</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div className="bg-emerald-500" style={{ width: `${Math.round((safe.stats.activeClients / activeWarmTotal) * 100)}%` }} />
                <div className="bg-amber-500" style={{ width: `${Math.round((safe.stats.warmLeads / activeWarmTotal) * 100)}%` }} />
                <div className="bg-slate-400" style={{ width: `${Math.round((safe.stats.pastClients / activeWarmTotal) * 100)}%` }} />
              </div>
              <div className="grid grid-cols-3 text-[11px] text-muted-foreground gap-2">
                <div className="text-center">Active {safe.stats.activeClients}</div>
                <div className="text-center">Warm {safe.stats.warmLeads}</div>
                <div className="text-center">Past {safe.stats.pastClients}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">Sources</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Invoice</span><span className="text-foreground font-medium">{safe.sourceStats.invoice}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Zoho</span><span className="text-foreground font-medium">{safe.sourceStats.zoho}</span></div>
                {safe.sourceStats.gmail.slice(0, 2).map((g) => (
                  <div key={g.email} className="flex justify-between gap-2">
                    <span className="text-muted-foreground truncate">{g.email}</span>
                    <span className="text-foreground font-medium">{g.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => router.push("/clients")}
              className="w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted"
            >
              Review Clients
            </button>
          </aside>
        </div>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Recent Campaign Activity</h3>
            <button onClick={() => router.push("/campaigns/results")} className="text-xs text-muted-foreground hover:text-foreground">
              View all
            </button>
          </div>
          {safe.recentCampaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No campaign activity yet. Start your first campaign to populate this feed.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
              {safe.recentCampaigns.slice(0, 4).map((c) => (
                <div key={c.id} className="border border-border rounded-xl px-3 py-2">
                  <div className="text-sm font-medium text-foreground truncate">{c.clientName}</div>
                  <div className="text-xs text-muted-foreground">{c.type} · {c.industry}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(c.date), { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">What Changed This Week</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="border border-border rounded-xl p-3">
              <p className="text-muted-foreground mb-1">Client growth signal</p>
              <p className="text-foreground font-medium">{safe.stats.trends.growth} vs total base</p>
            </div>
            <div className="border border-border rounded-xl p-3">
              <p className="text-muted-foreground mb-1">Campaign momentum</p>
              <p className="text-foreground font-medium">{campaignDelta >= 0 ? "Improving" : "Cooling"} ({campaignDelta >= 0 ? "+" : ""}{campaignDelta})</p>
            </div>
            <div className="border border-border rounded-xl p-3">
              <p className="text-muted-foreground mb-1">Data quality pressure</p>
              <p className="text-foreground font-medium">{safe.dataHealth.staleRecords} stale records need follow-up</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
