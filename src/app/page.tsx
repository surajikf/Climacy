"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Users,
  Zap,
  Activity,
  ChevronRight,
  Target,
  BarChart3,
  Mail,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Shield,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { SmartLoader } from "@/components/SmartLoader";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <SmartLoader label="Analyzing Dashboard" description="Fetching real-time business metrics..." />;

  const totalClients = data?.stats?.totalClients || 0;
  const activeClients = data?.stats?.activeClients || 0;
  const pastClients = data?.stats?.pastClients || 0;
  const integrityScore = data?.integrityScore || 0;

  const healthSuggestions: string[] = [];
  const opportunitySuggestions: string[] = [];
  const riskSuggestions: string[] = [];

  if (totalClients > 0 && activeClients / totalClients < 0.5) {
    opportunitySuggestions.push("Large portion of your database is cold. Consider a Reactivation or Broadcast campaign.");
  }

  if (data?.recentCampaigns?.length === 0 && totalClients > 0) {
    opportunitySuggestions.push("No recent outreach detected. Launch a quick Broadcast to re-introduce your services.");
  }

  if (integrityScore < 80) {
    healthSuggestions.push("Profile Health is below 80%. Improve data quality from Integrations Studio or by enriching client records.");
  }

  if (pastClients > 0) {
    riskSuggestions.push("You have past clients in the database. A focused Reactivation campaign could win back business.");
  }

  if (healthSuggestions.length === 0 && opportunitySuggestions.length === 0 && riskSuggestions.length === 0) {
    opportunitySuggestions.push("Your system looks healthy. Create a Targeted campaign for your best-fit clients.");
  }

  const stats = [
    {
      label: "Client Database",
      description: "Total contacts stored",
      value: data?.stats?.totalClients || 0,
      icon: Users,
      trend: data?.stats?.trends?.growth,
      sparkline: data?.stats?.trends?.sparklines?.clients || [0, 0, 0, 0, 0, 0, 0],
      color: "blue"
    },
    {
      label: "Active Clients",
      description: "Recently engaged contacts",
      value: data?.stats?.activeClients || 0,
      icon: UserCheck,
      sparkline: [12, 15, 14, 18, 22, 25, 24],
      color: "indigo"
    },
    {
      label: "Email Impact",
      description: "Total messages sent",
      value: (data?.stats?.trends?.engagement || "0").toString().replace('+', '') || 0,
      icon: Mail,
      sparkline: data?.stats?.trends?.sparklines?.campaigns || [0, 0, 0, 0, 0, 0, 0],
      color: "emerald"
    },
    {
      label: "Growth Trend",
      description: "Monthly database expansion",
      value: data?.stats?.trends?.growth || "0%",
      icon: TrendingUp,
      sparkline: [2, 4, 3, 5, 8, 12, 15],
      color: "amber"
    }
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col p-6 gap-6 max-w-[1600px] mx-auto box-border bg-slate-50/20">
      {/* Friendly Header */}
      <header className="flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="relative space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Business Overview</h4>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-xs font-medium text-slate-500 max-w-md">
            One place for client health, communication activity, and quick actions. You have {totalClients} clients synced.
          </p>
        </div>

        <div className="relative flex items-center gap-6">
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Sync</p>
            <p className="text-xs font-bold text-emerald-600 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live & Up to Date
            </p>
          </div>
          <div className="h-10 w-px bg-slate-200 hidden md:block" />
          <button
            onClick={() => router.push("/clients")}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[.2em] hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Manage Clients
          </button>
        </div>
      </header>

      {/* Stats - More Compact (Health Overview) */}
      <div className="flex-shrink-0 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-[.2em] text-slate-500">Health Overview</h2>
          <span className="text-[10px] text-slate-400 font-medium">
            Quick view of database size, engagement and growth.
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-lg hover:border-blue-200 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-50/30 rounded-full blur-xl -mr-12 -mt-12 transition-all duration-500 group-hover:bg-${stat.color}-100/50`} />

            <div className="relative flex items-center justify-between mb-4">
              <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:scale-110 transition-all duration-300`}>
                <stat.icon className="w-4 h-4" />
              </div>
              {stat.trend && (
                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <ArrowUpRight className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">{stat.trend}</span>
                </div>
              )}
            </div>

            <div className="relative space-y-0.5">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h2>
            </div>

            <div className="mt-4 h-8 flex items-end gap-1 px-0.5">
              {stat.sparkline.map((val: number, si: number) => {
                const max = Math.max(...stat.sparkline, 1);
                const h = (val / max) * 100;
                return (
                  <motion.div
                    key={si}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(h, 15)}%` }}
                    transition={{ delay: 0.3 + (si * 0.05) }}
                    className={`flex-1 bg-${stat.color}-500/20 rounded-full`}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
        </div>
      </div>

      {/* Main Grid - Flexible height */}
      <div className="flex-1 min-h-0 grid lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Column: Analytics + Small Blocks */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
          {/* Communication Pulse - Flexible */}
          <div className="flex-1 min-h-0 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 flex-shrink-0 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-1 bg-blue-600 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Email Activity</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium">Daily count of emails sent to your clients.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Last 7 Days</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex items-end gap-3 px-2 mb-2">
              {data?.chartData?.map((item: any, i: number) => {
                const maxValue = Math.max(...data.chartData.map((d: any) => d.value), 1);
                const height = (item.value / maxValue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full">
                    <div className="w-full relative flex flex-col justify-end h-full">
                      <div className="w-full bg-slate-50 rounded-2xl group-hover/bar:bg-blue-50/50 transition-all duration-500 relative h-full border border-transparent group-hover/bar:border-blue-100/50">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-700 to-blue-500 rounded-2xl"
                        />
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[.15em]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Row - Flexible */}
          <div className="h-64 grid md:grid-cols-2 gap-6 flex-shrink-0 min-h-0">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[.2em]">Recent Outreach</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {data?.recentCampaigns?.map((camp: any, i: number) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all group/item border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs border border-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                        {camp.clientName?.[0]}
                      </div>
                      <div className="truncate max-w-[120px]">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{camp.clientName}</h4>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{camp.type}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover/item:text-blue-600" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[.2em]">Profile Health</h3>
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                </div>

                <div className="flex justify-center flex-1 items-center">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="3" strokeDasharray="100, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${data?.integrityScore || 0}, 100` }}
                        className="text-blue-600" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">{data?.integrityScore || 0}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Complete</span>
                    </div>
                  </div>
                </div>

                <button onClick={() => router.push("/import")} className="w-full py-2.5 bg-blue-50 text-blue-700 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100">
                  Improve Profiles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Industry Hub + Suggestions */}
        <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
          <div className="flex-1 min-h-0 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-6 flex-shrink-0">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Client Distribution</h3>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Main categories in your database.</p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-1">
              {data?.serviceUtilization?.slice(0, 5).map((s: any, i: number) => {
                const colors = ["bg-blue-600", "bg-indigo-500", "bg-emerald-500", "bg-amber-400", "bg-rose-500"];
                const maxValue = Math.max(...data.serviceUtilization.map((d: any) => d.value), 1);
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-tight">
                      <span className="text-slate-600 truncate mr-2">{s.label}</span>
                      <span className="text-slate-900 bg-slate-50 px-1.5 rounded">{s.value}</span>
                    </div>
                    <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-100/50 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(s.value / maxValue) * 100}%` }}
                        className={cn("h-full rounded-full shadow-sm", colors[i % colors.length])}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex-shrink-0">
              <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Sectors</h4>
              <div className="flex flex-wrap gap-1.5">
                {data?.industryDistribution?.slice(0, 6).map((ind: any, i: number) => (
                  <span key={i} className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-200">
                    {ind.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-[.2em]">Smart Suggestions</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">
                  Suggested next steps based on current data.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {healthSuggestions.length > 0 && (
                <div className="border border-emerald-100 bg-emerald-50/40 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1.5">Health</p>
                  <ul className="space-y-1.5">
                    {healthSuggestions.map((s, idx) => (
                      <li key={`health-${idx}`} className="text-xs text-emerald-900 leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {opportunitySuggestions.length > 0 && (
                <div className="border border-blue-100 bg-blue-50/40 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1.5">Opportunities</p>
                  <ul className="space-y-1.5">
                    {opportunitySuggestions.map((s, idx) => (
                      <li key={`opp-${idx}`} className="text-xs text-slate-900 leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {riskSuggestions.length > 0 && (
                <div className="border border-amber-100 bg-amber-50/40 rounded-2xl p-3">
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1.5">Risks</p>
                  <ul className="space-y-1.5">
                    {riskSuggestions.map((s, idx) => (
                      <li key={`risk-${idx}`} className="text-xs text-slate-900 leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="h-44 flex-shrink-0 bg-blue-600 p-7 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Grow Your Business</h3>
                <p className="text-blue-100 text-[10px] font-medium leading-relaxed">
                  Start a new campaign to connect with your database.
                </p>
              </div>
              <button onClick={() => router.push("/campaigns")} className="w-full py-3 bg-white text-blue-600 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-md">
                New Campaign
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
