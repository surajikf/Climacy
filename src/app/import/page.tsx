"use client";

import { useState, useEffect } from "react";
import { DownloadCloud, FileText, Database, Loader2, RefreshCw, CheckCircle2, Cloud, X, Key, Shield, Mail, User, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { SmartLoader } from "@/components/SmartLoader";

export default function ImportIntegrationsPage() {
    const { data: session } = useSession();

    const [isInvoiceSyncing, setIsInvoiceSyncing] = useState(false);
    const [invoiceLastSync, setInvoiceLastSync] = useState<string | null>("Never");
    const [loading, setLoading] = useState(true);

    const [isZohoSyncing, setIsZohoSyncing] = useState(false);
    const [zohoLastSync, setZohoLastSync] = useState<string | null>("Never");

    // Gmail State
    const [gmailAccounts, setGmailAccounts] = useState<any[]>([]);
    const [isGmailSyncing, setIsGmailSyncing] = useState<Record<string, boolean>>({});
    const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
    const [gmailLabel, setGmailLabel] = useState("Sales Team");

    // Zoho Config State
    const [isZohoModalOpen, setIsZohoModalOpen] = useState(false);
    const [zohoConfig, setZohoConfig] = useState<any>({ hasClientId: false, hasClientSecret: false, hasRefreshToken: false, pipelineName: "Sales Pipeline", stageName: "Closed Won" });
    const [zohoFormData, setZohoFormData] = useState({ clientId: "", clientSecret: "", pipelineName: "", stageName: "" });
    const [isSavingZoho, setIsSavingZoho] = useState(false);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings/zoho");
            if (res.ok) {
                const data = await res.json();
                setZohoConfig(data);
                setZohoFormData(prev => ({
                    ...prev,
                    pipelineName: data.pipelineName,
                    stageName: data.stageName
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchGmailAccounts = async () => {
        try {
            const res = await fetch("/api/settings/gmail");
            if (res.ok) {
                setGmailAccounts(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchSettings(), fetchGmailAccounts()]).finally(() => setLoading(false));
    }, []);

    const handleGmailSync = async (accountId: string, accountName: string) => {
        setIsGmailSyncing(prev => ({ ...prev, [accountId]: true }));
        try {
            const res = await fetch("/api/import/gmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId })
            });
            const data = await res.json();

            if (res.ok) {
                const message = `Successfully imported ${data.count || 0} clients from ${accountName} Gmail.${data.conflicts > 0 ? ` Detected ${data.conflicts} existing record conflicts.` : ""}`;
                toast.success(message);
            } else {
                toast.error(data.error || `Failed to sync from ${accountName}`);
            }
        } catch (error) {
            toast.error(`Network error during ${accountName} sync.`);
        } finally {
            setIsGmailSyncing(prev => ({ ...prev, [accountId]: false }));
        }
    };

    const handleAddGmailAccount = () => {
        // Redirect to Google Auth with the selected label in state
        window.location.href = `/api/auth/google?state=${encodeURIComponent(gmailLabel)}`;
    };

    const handleInvoiceSync = async () => {
        setIsInvoiceSyncing(true);
        try {
            const res = await fetch("/api/import/invoice", { method: "POST" });
            const data = await res.json();

            if (res.ok) {
                toast.success(`Successfully imported ${data.count || 0} clients from internal invoice system.`);
                setInvoiceLastSync(new Date().toLocaleString());
            } else {
                toast.error(data.error || "Failed to sync from Invoice System");
            }
        } catch (error) {
            toast.error("Network error during Invoice Sync.");
        } finally {
            setIsInvoiceSyncing(false);
        }
    };

    const handleZohoSync = async () => {
        setIsZohoSyncing(true);
        try {
            const res = await fetch("/api/import/zoho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pipelineStage: zohoConfig.stageName })
            });
            const data = await res.json();

            if (res.ok) {
                const message = `Successfully imported ${data.count || 0} clients from Zoho Bigin.${data.conflicts > 0 ? ` Detected ${data.conflicts} existing record conflicts.` : ""}`;
                toast.success(message);
                setZohoLastSync(new Date().toLocaleString());
            } else {
                toast.error(data.error || "Failed to sync from Zoho Bigin");
            }
        } catch (error) {
            toast.error("Network error during Zoho Bigin Sync.");
        } finally {
            setIsZohoSyncing(false);
        }
    };

    if (loading) return <SmartLoader label="Initializing Studio" description="Connecting to data nodes..." />;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            <header className="px-2">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                    <DownloadCloud className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Universal Data Ingestion</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Integrations Studio</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Connect external data channels and synchronize your client base.</p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Invoice System Card */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                    <div className="p-8 border-b border-slate-100 flex-1 relative bg-gradient-to-br from-indigo-50/50 to-white">
                        <div className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md flex items-center gap-1.5 border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Internal Invoice System</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            Automatically pulls the master client list from the internal accounting module. Ensures all active billing entities are present in the communication database.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Last Sync: {invoiceLastSync}
                        </div>
                        <button
                            onClick={handleInvoiceSync}
                            disabled={isInvoiceSyncing || (session?.user?.role !== "ADMIN")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isInvoiceSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                            Run Sync
                        </button>
                    </div>
                </div>

                {/* Zoho Bigin Card */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                    <div className="p-8 border-b border-slate-100 flex-1 relative bg-gradient-to-br from-orange-50/50 to-white">
                        <div className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-1 rounded-md flex items-center gap-1.5 border border-amber-100">
                            {zohoConfig.hasRefreshToken ? "Connected" : "Configuration Needed"}
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Cloud className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Zoho Bigin Pipeline</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-5">
                            Extracts won deals and contact entities directly from your Zoho Bigin pipelines.
                        </p>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Pipeline:</span>
                                <span className="font-medium text-slate-700">{zohoConfig.pipelineName || "Not set"}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-widest">Stage:</span>
                                <span className="font-medium text-slate-700">{zohoConfig.stageName || "Not set"}</span>
                            </div>
                            <button
                                onClick={() => setIsZohoModalOpen(true)}
                                className="w-full mt-2 bg-white border border-slate-200 hover:border-orange-200 hover:bg-orange-50 text-orange-600 rounded-xl py-2 text-xs font-bold transition-colors"
                            >
                                Configure API Settings
                            </button>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-6 flex items-center justify-between">
                        <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Last Sync: {zohoLastSync}
                        </div>
                        {zohoConfig.hasRefreshToken ? (
                            <button
                                onClick={handleZohoSync}
                                disabled={isZohoSyncing || (session?.user?.role !== "ADMIN")}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isZohoSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                                Run Sync
                            </button>
                        ) : (
                            <button
                                disabled
                                className="bg-slate-200 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Cloud className="w-4 h-4" />
                                Not Connected
                            </button>
                        )}
                    </div>
                </div>

                {/* Gmail Multi-Account Card */}
                <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                    <div className="p-8 border-b border-slate-100 flex-1 relative bg-gradient-to-br from-blue-50/50 to-white">
                        <div className="absolute top-8 right-8 text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1.5 border border-blue-100">
                            {gmailAccounts.length} Connected
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gmail Connector</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-5">
                            Sync contacts from sent/received headers across multiple Gmail accounts.
                        </p>

                        <div className="space-y-3 pt-4 border-t border-slate-100 max-h-[160px] overflow-y-auto">
                            {gmailAccounts.map(acc => (
                                <div key={acc.id} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-xl border border-slate-100 group/item">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{acc.accountName}</span>
                                        <button
                                            onClick={async () => {
                                                if (confirm(`Remove ${acc.email}?`)) {
                                                    await fetch(`/api/settings/gmail?id=${acc.id}`, { method: 'DELETE' });
                                                    fetchGmailAccounts();
                                                }
                                            }}
                                            className="opacity-0 group-hover/item:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center font-medium text-slate-700 text-xs">
                                        <span className="truncate max-w-[120px]">{acc.email}</span>
                                        <button
                                            onClick={() => handleGmailSync(acc.id, acc.accountName)}
                                            disabled={isGmailSyncing[acc.id]}
                                            className="text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isGmailSyncing[acc.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                                            Sync
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsGmailModalOpen(true)}
                                className="w-full mt-2 bg-white border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Link New Account
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Gmail Link Modal */}
            {isGmailModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setIsGmailModalOpen(false)} />
                    <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-blue-50">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-slate-900">Link Gmail Account</h3>
                            </div>
                            <button onClick={() => setIsGmailModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-xs text-slate-500 font-medium">Select the role for this account to organize incoming contacts.</p>
                            <div className="grid grid-cols-1 gap-2">
                                {["Sales Team", "Accounts Team", "Executive / Boss", "Operations"].map(label => (
                                    <button
                                        key={label}
                                        onClick={() => setGmailLabel(label)}
                                        className={cn(
                                            "w-full px-4 py-3 rounded-xl border text-sm font-bold transition-all text-left flex items-center justify-between",
                                            gmailLabel === label ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300"
                                        )}
                                    >
                                        {label}
                                        {gmailLabel === label && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleAddGmailAccount}
                                className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <Key className="w-4 h-4" />
                                Authenticate with Google
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Zoho Bigin Settings Modal */}
            {isZohoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setIsZohoModalOpen(false)} />
                    <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
                            <div className="flex items-center gap-2">
                                <Cloud className="w-5 h-5 text-orange-600" />
                                <h3 className="font-bold text-slate-900">Zoho Bigin Configuration</h3>
                            </div>
                            <button onClick={() => setIsZohoModalOpen(false)} className="text-slate-400 hover:text-slate-900 bg-white rounded-full p-1 shadow-sm"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-6 space-y-5">
                            {!zohoConfig.hasRefreshToken && (
                                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-xs font-medium leading-relaxed flex gap-2">
                                    <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                                    Provide your Client ID, Secret, Pipeline, and Stage. Once saved, you must click "Connect Zoho Account" to authorize access.
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Client ID</label>
                                    <input
                                        type="text"
                                        value={zohoFormData.clientId}
                                        onChange={(e) => setZohoFormData(prev => ({ ...prev, clientId: e.target.value }))}
                                        placeholder={zohoConfig.hasClientId ? "•••••••••••••••• (Encrypted)" : "Enter Zoho Client ID"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Client Secret</label>
                                    <input
                                        type="password"
                                        value={zohoFormData.clientSecret}
                                        onChange={(e) => setZohoFormData(prev => ({ ...prev, clientSecret: e.target.value }))}
                                        placeholder={zohoConfig.hasClientSecret ? "•••••••••••••••••••••••• (Encrypted)" : "Enter Zoho Client Secret"}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Target Pipeline</label>
                                        <input
                                            type="text"
                                            value={zohoFormData.pipelineName}
                                            onChange={(e) => setZohoFormData(prev => ({ ...prev, pipelineName: e.target.value }))}
                                            placeholder="e.g. Sales Pipeline"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Target Stage</label>
                                        <input
                                            type="text"
                                            value={zohoFormData.stageName}
                                            onChange={(e) => setZohoFormData(prev => ({ ...prev, stageName: e.target.value }))}
                                            placeholder="e.g. Closed Won"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 outline-none focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-400 placeholder:font-normal"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-0 space-y-3">
                            <button
                                onClick={async () => {
                                    setIsSavingZoho(true);
                                    try {
                                        const res = await fetch("/api/settings/zoho", {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(zohoFormData)
                                        });
                                        if (res.ok) {
                                            toast.success("Zoho configuration saved securely.");
                                            setZohoFormData({ clientId: "", clientSecret: "", pipelineName: zohoFormData.pipelineName, stageName: zohoFormData.stageName });
                                            fetchSettings();
                                        } else {
                                            toast.error("Failed to save settings.");
                                        }
                                    } catch (e) {
                                        toast.error("Network error saving settings.");
                                    } finally {
                                        setIsSavingZoho(false);
                                    }
                                }}
                                disabled={isSavingZoho}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
                            >
                                {isSavingZoho ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                                Save Configuration To Database
                            </button>

                            {(zohoConfig.hasClientId || zohoFormData.clientId) && (
                                <button
                                    onClick={() => {
                                        window.location.href = "/api/auth/zoho";
                                    }}
                                    className="w-full py-3 bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-orange-700 transition-all active:scale-[0.98] shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                                >
                                    <Key className="w-4 h-4" />
                                    {zohoConfig.hasRefreshToken ? "Re-Authenticate with Zoho" : "Connect Zoho Account"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
