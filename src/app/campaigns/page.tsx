"use client";

import { useState, useEffect } from "react";
import {
    Send,
    Target,
    RefreshCcw,
    Zap,
    Users,
    Briefcase,
    Radio,
    RefreshCw,
    Network,
    TerminalSquare,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLoader } from "@/components/SmartLoader";
import { toast } from "sonner";

const campaignTypes = [
    { id: "Broadcast", name: "Broadcast", desc: "Inform every client in your database.", icon: Radio, target: "Active & Warm Leads", bestFor: "Company-wide updates or major news." },
    { id: "Targeted", name: "Targeted", desc: "Send specific value to active clients.", icon: Target, target: "Active Clients Only", bestFor: "Project updates or exclusive offers." },
    { id: "Cross-Sell", name: "Cross-Sell", desc: "Suggest new services to current clients.", icon: Briefcase, target: "Active & Warm Leads", bestFor: "Upselling complementary services." },
    { id: "Reactivation", name: "Reactivate", desc: "Reach out to past clients.", icon: RefreshCw, target: "Past Clients Only", bestFor: "Winning back old business." },
];

const tones = [
    { name: "Professional", desc: "Formal, respectful, and standard business communication." },
    { name: "Advisory", desc: "Helpful, expert advice focused on partnership." },
    { name: "Premium", desc: "Elite, high-end, and exclusive communication." },
    { name: "Trust-building", desc: "Warm, reliable, and focused on the relationship." },
];

export default function CampaignGenerator() {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [topic, setTopic] = useState("");
    const [coreMessage, setCoreMessage] = useState("");
    const [tone, setTone] = useState("Advisory");
    const [cta, setCta] = useState("Let's discuss how this aligns with your goals.");

    const [isGenerating, setIsGenerating] = useState(false);
    const [audienceData, setAudienceData] = useState({ count: 0, industries: [] as string[] });
    const [loadingAudience, setLoadingAudience] = useState(false);
    const [terminalStep, setTerminalStep] = useState(0);

    useEffect(() => {
        if (!selectedType) return;
        setLoadingAudience(true);

        fetch(`/api/campaigns/estimate?type=${selectedType}`)
            .then(async res => {
                const contentType = res.headers.get("content-type");
                if (!res.ok || !contentType?.includes("application/json")) {
                    // Handle non-JSON or error responses gracefully
                    const text = await res.text();
                    console.error("Non-OK Response:", text.slice(0, 200));
                    throw new Error("Neural link unstable. Calibration failed.");
                }
                return res.json();
            })
            .then(data => {
                if (data.success) {
                    setAudienceData({ count: data.count, industries: data.industries });
                } else {
                    toast.error(data.error || "Neural analytics failed.");
                    setAudienceData({ count: 0, industries: [] });
                }
            })
            .catch(err => {
                console.error("Audience estimation error:", err);
                toast.error(err.message || "Network synchronization lost.");
                setAudienceData({ count: 0, industries: [] });
            })
            .finally(() => setLoadingAudience(false));
    }, [selectedType]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            setTerminalStep(1);
            await new Promise(r => setTimeout(r, 1200));
            setTerminalStep(2);
            await new Promise(r => setTimeout(r, 1500));
            setTerminalStep(3);

            const res = await fetch("/api/campaigns/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: selectedType, topic, coreMessage, tone, cta }),
            });

            setTerminalStep(4);
            await new Promise(r => setTimeout(r, 800));

            if (res.ok) window.location.href = "/campaigns/results";
        } catch (err) {
            console.error(err);
            setIsGenerating(false);
            setTerminalStep(0);
        }
    };

    if (isGenerating) {
        const labels: Record<number, string> = {
            1: "Connecting to Database",
            2: "Selecting Target Clients",
            3: `Generating Emails`,
            4: "Finalising Campaign"
        };
        const descs: Record<number, string> = {
            1: "Establishing AI communication link...",
            2: `Filtering ${audienceData.count} ${selectedType} clients...`,
            3: `Applying '${tone}' tone and brand identity...`,
            4: "Campaign ready for review..."
        };

        return <SmartLoader label={labels[terminalStep] || "Processing"} description={descs[terminalStep] || "Initializing logic..."} />;
    }

    const isReady = selectedType && topic && coreMessage && tone && cta;

    return (
        <div className="max-w-[1600px] mx-auto pb-20 px-6">
            <div className="mb-8 px-2 md:px-0">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Campaign Builder</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Configure and deploy intelligent multi-node communications.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Pane: Form Inputs */}
                <div className="flex-1 space-y-8 min-w-0 w-full">

                    {/* Section 1: Objective */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-base font-semibold text-slate-900">1. Select Objective</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {campaignTypes.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={cn(
                                        "p-5 rounded-lg border cursor-pointer transition-all",
                                        selectedType === type.id
                                            ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <type.icon className={cn("w-5 h-5", selectedType === type.id ? "text-blue-600" : "text-slate-400")} />
                                            <h4 className="text-sm font-semibold text-slate-900">{type.name}</h4>
                                        </div>
                                        {selectedType === type.id && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{type.desc}</p>
                                    <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{type.target}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-[10px] font-bold text-blue-600/80 uppercase tracking-widest leading-none">Best For: {type.bestFor}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Narrative Context */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-base font-semibold text-slate-900">2. Narrative Context</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Subject Matter</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Q4 Strategy Review"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-md px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <label className="text-sm font-medium text-slate-700">Core Logic</label>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{"{{clientName}}"}</span>
                                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">{"{{industry}}"}</span>
                                    </div>
                                </div>
                                <textarea
                                    rows={5}
                                    placeholder="Detail the main points of your communication..."
                                    value={coreMessage}
                                    onChange={(e) => setCoreMessage(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-md px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-y"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Conversion Vector (CTA)</label>
                                <input
                                    type="text"
                                    value={cta}
                                    onChange={(e) => setCta(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-md px-4 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Resonance Tuning */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-base font-semibold text-slate-900">3. Resonance Tuning</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {tones.map((t) => (
                                <div
                                    key={t.name}
                                    onClick={() => setTone(t.name)}
                                    className={cn(
                                        "p-4 rounded-lg border cursor-pointer transition-all",
                                        tone === t.name
                                            ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500"
                                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-semibold text-slate-900">{t.name}</h4>
                                        {tone === t.name && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                                    </div>
                                    <p className="text-xs text-slate-500">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Pane: Sticky Summary */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 lg:sticky lg:top-8 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <Network className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Pre-Flight Check</h3>
                        </div>
                        <div className="p-6 space-y-6">

                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Audience</p>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-semibold tracking-tight text-slate-900">
                                        {!selectedType ? "-" : loadingAudience ? <RefreshCw className="w-6 h-6 animate-spin text-slate-300 mb-1" /> : audienceData.count}
                                    </span>
                                    {selectedType && !loadingAudience && (
                                        <span className="text-sm font-medium text-slate-500 mb-1.5">{selectedType} Campaign</span>
                                    )}
                                </div>
                            </div>

                            {selectedType && audienceData.industries.length > 0 && (
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Distributions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {audienceData.industries.map(ind => (
                                            <span key={ind} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600">{ind}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Configuration</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-slate-500">Subject</span>
                                        <span className="text-sm font-medium text-slate-900 text-right max-w-[150px] truncate">{topic || "-"}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-slate-500">Tone</span>
                                        <span className="text-sm font-medium text-blue-600">{tone}</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm text-slate-500">Logic Core</span>
                                        <span className="text-sm font-medium text-slate-900">{coreMessage.length > 0 ? "Configured" : "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                            <button
                                onClick={handleGenerate}
                                disabled={!isReady || isGenerating || audienceData.count === 0}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        Create Emails
                                        <Zap className="w-4 h-4 text-blue-300 group-hover:text-amber-400 group-hover:scale-110 transition-all" />
                                    </>
                                )}
                            </button>
                            {!isReady && (
                                <p className="text-xs text-center text-slate-500 mt-3">Complete all sections to initiate.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

