"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Bot,
    Mail,
    Save,
    CheckCircle2,
    Loader2,
    RotateCcw,
    ShieldCheck,
    Eye,
    EyeOff,
    Zap,
    Globe,
    Cpu,
    ArrowLeft,
    Network
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLoader } from "@/components/SmartLoader";
import { PageHeader } from "@/components/ui/page-header";

export default function Settings() {
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});
    const [testStatus, setTestStatus] = useState<{ status: 'idle' | 'testing' | 'success' | 'error', message?: string }>({ status: 'idle' });

    const defaultSettings = {
        aiProvider: "Groq",
        aiModel: "llama-3.3-70b-versatile",
        groqApiKey: "",
        openaiApiKey: "",
        googleClientId: "",
        googleClientSecret: "",
        googleRefreshToken: "",
        googleEmail: "",
        invoiceApiKey: "",
        invoiceApiUrl: "",
        gmailAccounts: [] as any[]
    };

    const [formData, setFormData] = useState(defaultSettings);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const result = await res.json();
            if (result.success) {
                setFormData({
                    ...defaultSettings,
                    ...result.data,
                    gmailAccounts: result.data.gmailAccounts || []
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load configuration from database.");
        } finally {
            setLoading(false);
        }
    };

    const toggleKeyVisibility = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTestAI = async () => {
        setTestStatus({ status: 'testing' });
        try {
            const res = await fetch(`/api/test-ai?provider=${formData.aiProvider}`);
            const result = await res.json();
            if (result.success) {
                setTestStatus({ status: 'success', message: `Connected to ${formData.aiProvider}` });
                toast.success(`Neural link established with ${formData.aiProvider} nodes.`);
            } else {
                setTestStatus({ status: 'error', message: result.error?.message || "Connection failed" });
                toast.error(result.error?.message || "Neural link failure - Check credentials.");
            }
        } catch (err) {
            setTestStatus({ status: 'error', message: "Network error" });
            toast.error("Network instability detected in transmission grid.");
        } finally {
            setTimeout(() => setTestStatus({ status: 'idle' }), 5000);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await res.json();

            if (result.success) {
                setFormData(prev => ({ ...prev, ...result.data }));
                setSaved(true);
                toast.success("Synchronized: Database configuration persisted.");
                setTimeout(() => setSaved(false), 3000);
            } else {
                toast.error(result.error?.message || "Database failure.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network instability detected. Ensure the local server is operational.");
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setFormData(defaultSettings);
        setResetModalOpen(false);
        toast.info("Configuration reverted to baseline defaults.");
    };

    if (loading) return <SmartLoader label="Loading Configuration" description="Reading system node settings..." />;

    const CredentialInput = ({ label, value, field, placeholder }: { label: string, value: string, field: string, placeholder?: string }) => (
        <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">{label}</label>
            <div className="relative group">
                <input
                    type={showKeys[field] ? "text" : "password"}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 pr-10 outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                />
                <button
                    type="button"
                    onClick={() => toggleKeyVisibility(field)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    {showKeys[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    return (
        <form onSubmit={handleFormSubmit} className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            <PageHeader
                title="Configuration"
                subtitle="Manage your system nodes and operational vectors."
                eyebrow="System Settings"
                actions={
                    <>
                    <button
                        type="button"
                        onClick={() => setResetModalOpen(true)}
                        className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2 px-4 py-2 rounded-md hover:bg-slate-100 border border-transparent hover:border-slate-200"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98] flex items-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        {saved && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 animate-in fade-in slide-in-from-left-2 transition-all">
                                <CheckCircle2 className="w-3 h-3" />
                                Synchronized
                            </span>
                        )}
                    </>
                }
            />

            <div className="grid gap-6">
                {/* 1. Intelligence Hub */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                    {/* ... items ... */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Intelligence Hub</h3>
                            <p className="text-xs font-medium text-slate-400">Configure AI providers and authorization nodes.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Provider</label>
                                    <select
                                        value={formData.aiProvider}
                                        onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold text-slate-700 text-sm cursor-pointer"
                                    >
                                        <option value="Groq">Groq Synthesis</option>
                                        <option value="OpenAI">OpenAI Intelligence</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Model</label>
                                    <select
                                        value={formData.aiModel}
                                        onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold text-slate-700 text-sm cursor-pointer"
                                    >
                                        <option value={formData.aiModel}>{formData.aiModel}</option>
                                        {formData.aiProvider === "Groq" && <option value="llama-3.3-70b-versatile">llama-3.3-70b</option>}
                                        {formData.aiProvider === "OpenAI" && <option value="gpt-4o">gpt-4o</option>}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={handleTestAI}
                                    disabled={testStatus.status === 'testing'}
                                    className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-md border transition-all flex items-center gap-2",
                                        testStatus.status === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                                            testStatus.status === 'error' ? "bg-red-50 border-red-200 text-red-600" :
                                                "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                                    )}
                                >
                                    <Zap className={cn("w-3.5 h-3.5", testStatus.status === 'testing' && "animate-pulse")} />
                                    {testStatus.status === 'testing' ? "Pinging..." :
                                        testStatus.status === 'success' ? "Connection Verified" : "Verify Pipeline"}
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex flex-col justify-center">
                            {formData.aiProvider === "Groq" ? (
                                <CredentialInput
                                    label="Groq Strategic Key"
                                    value={formData.groqApiKey}
                                    field="groqApiKey"
                                    placeholder="gsk_••••••••"
                                />
                            ) : (
                                <CredentialInput
                                    label="OpenAI Project Key"
                                    value={formData.openaiApiKey}
                                    field="openaiApiKey"
                                    placeholder="sk-••••••••"
                                />
                            )}
                            <p className="text-[10px] text-slate-400 font-medium mt-3 flex items-center gap-1.5 uppercase tracking-tight">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                Encrypted node storage active.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1.5 Internal Connection Hub */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                                <Network className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Internal Connection Hub</h3>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Sync Pipeline Configuration</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Invoice System Endpoint</label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.invoiceApiUrl}
                                    onChange={(e) => setFormData({ ...formData, invoiceApiUrl: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="http://your-public-url/api/ApiService.asmx/GetClients"
                                />
                            </div>
                            <p className="text-[9px] text-slate-400 italic ml-1 leading-relaxed">
                                <span className="text-amber-500 font-bold uppercase not-italic mr-1">Cloud Sync:</span>
                                Requires a public URL (via ngrok/tunnel) for Vercel synchronization.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Transmission Grid */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-600">
                                <Globe className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Transmission Grid</h3>
                                <p className="text-xs font-medium text-slate-400">Manage Google OAuth2 identities for campaign delivery.</p>
                            </div>
                        </div>
                        {formData.gmailAccounts.some((a: any) => a.isDefault) && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" />
                                Neural Link Active
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                        <CredentialInput
                            label="Google Client ID"
                            value={formData.googleClientId}
                            field="googleClientId"
                            placeholder="••••••••.apps.googleusercontent.com"
                        />
                        <CredentialInput
                            label="Google Client Secret"
                            value={formData.googleClientSecret}
                            field="googleClientSecret"
                            placeholder="GOCSPX-••••••••"
                        />
                    </div>

                    {/* Account List */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Sync Nodes</h4>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!formData.googleClientId || !formData.googleClientSecret) {
                                        toast.error("Google App ID and Secret required to link accounts.");
                                        return;
                                    }
                                    await handleSave();
                                    const label = window.prompt("Enter a label for this account (e.g. Sales, Support):", "Primary");
                                    if (label === null) return; // Cancelled
                                    window.location.href = `/api/auth/google?state=${encodeURIComponent(label)}`;
                                }}
                                className="flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all active:scale-95"
                            >
                                <Zap className="w-3 h-3" />
                                Connect New Identity
                            </button>
                        </div>

                        {formData.gmailAccounts.length > 0 ? (
                            <div className="grid gap-3">
                                {formData.gmailAccounts.map((account: any) => (
                                    <div key={account.id} className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                                        account.isDefault ? "bg-blue-50/30 border-blue-200" : "bg-white border-slate-100 hover:border-slate-200"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border",
                                                account.isDefault ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-200" : "bg-slate-50 text-slate-400 border-slate-100"
                                            )}>
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{account.accountName}</span>
                                                    {account.isDefault && (
                                                        <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm">Default Node</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 lowercase">{account.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!account.isDefault && (
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const res = await fetch("/api/settings/google/default", {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({ accountId: account.id })
                                                        });
                                                        const result = await res.json();
                                                        if (result.success) {
                                                            toast.success("Operational node set as default.");
                                                            fetchSettings();
                                                        } else {
                                                            toast.error("Failed to reconfigure neural priority.");
                                                        }
                                                    }}
                                                    className="text-[9px] font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Identities Connected</p>
                                <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Initialize the Neural Bridge to establish your first link.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {resetModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setResetModalOpen(false)} />
                    <div className="bg-white p-6 rounded-xl shadow-xl relative w-full max-w-sm border border-slate-200 animate-in zoom-in-95 duration-200 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
                            <RotateCcw className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Reset Configuration</h3>
                            <p className="text-sm text-slate-500 mt-1">This will revert all matrix settings to project defaults. Are you sure?</p>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button onClick={() => setResetModalOpen(false)} className="flex-1 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-md shadow-sm">Cancel</button>
                            <button onClick={handleReset} className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md shadow-sm active:scale-[0.98]">Reset All</button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
