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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 w-full max-w-[1280px] mx-auto p-4 md:p-8 lg:p-10 space-y-10">
        {/* Modern Compact Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Analytics Engine v1.0</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="text-xs font-medium text-slate-500">
              Monitoring <span className="text-slate-900 font-bold">{totalClients} clients</span> across your strategic matrix.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/clients")}
              title="Navigate to the full client database."
              className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              Open Matrix
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </header>

        {/* Global Stats - Compact Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              title={`${stat.label}: ${stat.description}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors duration-300`}>
                  <stat.icon className="w-4 h-4" />
                </div>
                {stat.trend && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {stat.trend}
                  </span>
                )}
              </div>

              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</h2>
                <p className="text-[10px] text-slate-500 font-medium h-0 overflow-hidden group-hover:h-auto transition-all duration-300 pt-1">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Intelligence Layer */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Activity Trends */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col mb-10 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  <h3 className="text-lg font-bold text-slate-900">Communication Pulse</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium italic">Analyzed daily outreach volume across your network.</p>
              </div>

              <div className="h-[280px] flex items-end gap-4 px-2">
                {data?.chartData?.map((item: any, i: number) => {
                  const maxValue = Math.max(...data.chartData.map((d: any) => d.value), 1);
                  const height = (item.value / maxValue) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar h-full">
                      <div className="w-full relative flex flex-col justify-end h-full">
                        <div 
                          className="w-full bg-slate-50 rounded-xl group-hover/bar:bg-slate-100 transition-all relative h-full border border-slate-100"
                          title={`${item.label}: ${item.value} units`}
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-xl group-hover/bar:bg-blue-600 transition-colors"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Side Intelligence */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Source Breakdown */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Data Sources</h3>
                <p className="text-[10px] text-slate-500 font-medium">Provenance breakdown</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: "Zoho Bigin", value: data?.sourceStats?.zoho, icon: Zap, color: "blue" },
                  { label: "Invoice System", value: data?.sourceStats?.invoice, icon: Target, color: "emerald" },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-900 group transition-all rounded-2xl border border-slate-100 cursor-help"
                    title={`Source: ${item.label}. Total: ${item.value || 0}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-white text-slate-400 rounded-lg group-hover:bg-slate-800 transition-colors`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors">{item.value || 0}</span>
                  </div>
                ))}

                {data?.sourceStats?.gmail?.map((g: any, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-900 group transition-all rounded-2xl border border-slate-100 cursor-help"
                    title={`Direct import from: ${g.email}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white text-slate-400 rounded-lg group-hover:bg-slate-800 transition-colors shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-white transition-colors truncate">{g.email}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-white transition-colors">{g.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach Accelerator */}
            <div className="p-8 bg-slate-900 rounded-3xl shadow-xl space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white tracking-tight">Expand Reach</h3>
                <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
                  Initiate AI-assisted outreach cycles to drive strategic growth.
                </p>
              </div>
              <button 
                onClick={() => router.push("/campaigns")}
                className="w-full py-3.5 bg-white text-slate-900 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95"
              >
                Start Campaign
                <Zap className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </aside>
        </div>
      </div>
      
      <footer className="h-20 shrink-0 flex items-center justify-center border-t border-slate-200 mt-10">
        <div className="h-1 w-16 bg-slate-200 rounded-full" />
      </footer>
    </div>
  );
}
