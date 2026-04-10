"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Bot,
    Mail,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RotateCcw,
    ShieldCheck,
    Eye,
    EyeOff,
    Zap,
    Globe,
    Cpu,
    ArrowLeft,
    Network,
    Info,
    Send,
    Settings2,
    Shield,
    LayoutDashboard,
    Users,
    UserPlus,
    RefreshCw,
    Smartphone,
    ChevronRight,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLoader } from "@/components/SmartLoader";
import { PageHeader } from "@/components/ui/page-header";
import { apiPath } from "@/lib/app-path";

const MASK = "••••••••••••••••";

export default function SettingsPage() {
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
        projectName: "IKF Outreach",
        projectLogo: "",
        emailProvider: "GMAIL",
        brevoApiKey: "",
        brevoSenderEmail: "",
        brevoSenderName: "",
        brevoReplyTo: "",
        gmailAccounts: [] as any[]
    };

    const [formData, setFormData] = useState(defaultSettings);
    const [brevoSenders, setBrevoSenders] = useState<any[]>([]);
    const [brevoAccount, setBrevoAccount] = useState<any>(null);
    const [brevoAccountError, setBrevoAccountError] = useState<string | null>(null);
    const [isSyncingSenders, setIsSyncingSenders] = useState(false);
    const [activeTab, setActiveTab] = useState<"GMAIL" | "BREVO">("GMAIL");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(apiPath("/settings"));
            const result = await res.json();
            if (result.success) {
                setFormData({
                    ...defaultSettings,
                    ...result.data,
                    gmailAccounts: result.data.gmailAccounts || []
                });
                setActiveTab(result.data.emailProvider || "GMAIL");
                if (result.data.emailProvider === "BREVO" && result.data.brevoApiKey) {
                    fetchBrevoSenders();
                }
            } else {
                // If API call was successful but returned an error (e.g., recovery mode)
                console.warn("API returned error, possibly recovery mode:", result.error?.message);
                setFormData({
                    ...defaultSettings,
                    ...result.data, // This will contain recovery data if API is resilient
                    projectName: result.data.projectName || "IKF Outreach (Recovery)",
                    brevoApiKey: result.data.brevoApiKey || MASK, // Ensure masked if from .env
                    gmailAccounts: result.data.gmailAccounts || []
                });
                setActiveTab(result.data.emailProvider || "GMAIL");
                if (result.data.emailProvider === "BREVO" && result.data.brevoApiKey) {
                    fetchBrevoSenders();
                }
                if (result.data.isRecoveryMode) {
                    toast.warning("Configuration loaded in recovery mode. Some settings may be default.");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load configuration from database. Displaying defaults.");
            // Fallback to default settings if network/server completely fails
            setFormData({
                ...defaultSettings,
                projectName: "IKF Outreach (Recovery)",
                brevoApiKey: MASK, // Mask it if we can't even fetch
                emailProvider: "GMAIL",
                gmailAccounts: []
            });
            setActiveTab("GMAIL");
        } finally {
            setLoading(false);
        }
    };

    const fetchBrevoSenders = async () => {
        setIsSyncingSenders(true);
        try {
            // Implicit save before sync to ensure API key is persisted
            await handleSave();
            
            const res = await fetch(apiPath("/settings/brevo/senders"));
            const result = await res.json();
            if (result.success) {
                setBrevoSenders(result.data);
                // Also fetch account info when syncing senders
                fetchBrevoAccount();
            } else {
                console.warn("Failed to fetch Brevo senders:", result.error?.message);
            }
        } catch (err) {
            console.error("Brevo sync error:", err);
        } finally {
            setIsSyncingSenders(false);
        }
    };
    const fetchBrevoAccount = async () => {
        setBrevoAccountError(null);
        try {
            const res = await fetch(apiPath("/settings/brevo/account"));
            const result = await res.json();
            if (result.success) {
                setBrevoAccount(result.data);
            } else {
                setBrevoAccountError(result.error?.message || "Failed to fetch stats");
            }
        } catch (err) {
            console.error("Brevo account fetch error:", err);
            setBrevoAccountError("Network error while fetching stats");
        }
    };

    const toggleKeyVisibility = (key: string) => {
        setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTestAI = async () => {
        setTestStatus({ status: 'testing' });
        try {
            const res = await fetch(apiPath(`/test-ai?provider=${formData.aiProvider}`));
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

    const handleSave = async (dataToSave = formData) => {
        setSaving(true);
        try {
            const res = await fetch(apiPath("/settings"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSave),
            });
            const result = await res.json();

            if (result.success) {
                // IMPORTANT: update state with fresh server data (masks/encryptions handle correctly)
                setFormData(prev => ({ ...prev, ...result.data }));
                setSaved(true);
                toast.success("Synchronized: Database configuration persisted.");
                setTimeout(() => setSaved(false), 3000);
                return result.data;
            } else {
                toast.error(result.error?.message || "Database failure.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Network instability detected. Ensure the local server is operational.");
        } finally {
            setSaving(false);
        }
        return null;
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
        <form onSubmit={handleFormSubmit} className="w-full space-y-8 pb-20 animate-in fade-in duration-500 px-3 sm:px-4 lg:px-6">
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

                {/* 1.2 Branding & Identity */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Branding & Identity</h3>
                            <p className="text-xs font-medium text-slate-400">Customize the project name and logo for white-labeling.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Project Name</label>
                                <input
                                    type="text"
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold text-slate-900 text-sm"
                                    placeholder="e.g. IKF Outreach"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">Logo URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.projectLogo}
                                    onChange={(e) => setFormData({ ...formData, projectLogo: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2.5 outline-none focus:bg-white focus:border-blue-500 transition-all font-semibold text-slate-900 text-sm"
                                    placeholder="https://example.com/logo.png"
                                />
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex items-center justify-center min-h-[140px]">
                            <div className="text-center space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Live Preview</p>
                                <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    {formData.projectLogo ? (
                                        <div className="bg-slate-900 p-2 rounded-lg flex items-center justify-center min-w-[3rem]">
                                            <img src={formData.projectLogo} alt="Preview" className="h-6 w-auto object-contain" />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg">
                                                {(formData.projectName || "I").charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900 tracking-tight">{(formData.projectName || "IKF Outreach")}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
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

                        <div className="space-y-4">
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
                                        placeholder="http://192.168.2.79/invoice/api/ApiService.asmx"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-400 italic ml-1 leading-relaxed">
                                    <span className="text-amber-500 font-bold uppercase not-italic mr-1">Cloud Sync:</span>
                                    Requires a public URL (via ngrok/tunnel) for Vercel synchronization.
                                </p>
                            </div>

                            <div className="pt-2">
                                <CredentialInput 
                                    label="Internal API Key" 
                                    value={formData.invoiceApiKey} 
                                    field="invoiceApiKey" 
                                    placeholder="Enter your system access key"
                                />
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
                        <div className="flex items-center gap-4">
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("GMAIL")}
                                    className={cn(
                                        "relative px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === "GMAIL" ? "bg-white text-blue-600 shadow-md border border-slate-200" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Gmail OAuth
                                    {formData.emailProvider === "GMAIL" && (
                                        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-full text-[7px] border border-white shadow-sm ring-2 ring-emerald-50 animate-in zoom-in-50 duration-300">
                                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                            LIVE
                                        </div>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("BREVO")}
                                    className={cn(
                                        "relative px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeTab === "BREVO" ? "bg-white text-blue-600 shadow-md border border-slate-200" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    Brevo API
                                    {formData.emailProvider === "BREVO" && (
                                        <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-full text-[7px] border border-white shadow-sm ring-2 ring-emerald-50 animate-in zoom-in-50 duration-300">
                                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                            LIVE
                                        </div>
                                    )}
                                </button>
                            </div>
                            {((formData.emailProvider === "GMAIL" && formData.gmailAccounts.some((a: any) => a.isDefault)) || 
                              (formData.emailProvider === "BREVO" && formData.brevoSenderEmail)) && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                    <ShieldCheck className="w-3 h-3" />
                                    Neural Link Active
                                </div>
                            )}
                        </div>
                    </div>

                    {activeTab === "GMAIL" ? (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50/50 border border-slate-100 mb-8 overflow-hidden group">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                        Gmail Dispatch Service
                                        {formData.emailProvider === "GMAIL" ? (
                                            <span className="text-[8px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black border border-emerald-200 uppercase tracking-tighter shadow-sm animate-in fade-in zoom-in duration-500">Currently Active</span>
                                        ) : (
                                            <span className="text-[8px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-black border border-slate-300 uppercase tracking-tighter">Inactive</span>
                                        )}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">Manage authorized Google identities for high-volume localized outreach.</p>
                                </div>
                                {formData.emailProvider !== "GMAIL" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newData = { ...formData, emailProvider: "GMAIL" };
                                            setFormData(newData);
                                            handleSave(newData);
                                        }}
                                        className="relative group/btn overflow-hidden px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
                                    >
                                        <div className="relative z-10 flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 fill-white" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Activate Gmail Delivery</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] transition-all" />
                                    </button>
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
            const res = await fetch(apiPath("/settings/google/default"), {
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
                        </>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-50/50 border border-slate-100 mb-4 overflow-hidden group">
                                <div className="space-y-1 text-slate-500">
                                    <h4 className="text-xs font-black uppercase tracking-tight flex items-center gap-2">
                                        Brevo Matrix Configuration
                                        <span className="text-[8px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-black border border-blue-200 uppercase tracking-tighter">System Locked</span>
                                    </h4>
                                    <p className="text-[10px] font-medium leading-relaxed italic">API access is managed securely via server-side environment variables.</p>
                                </div>
                                {formData.emailProvider !== "BREVO" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newData = { ...formData, emailProvider: "BREVO" };
                                            setFormData(newData);
                                            handleSave(newData);
                                        }}
                                        className="relative group/btn overflow-hidden px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
                                    >
                                        <div className="relative z-10 flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 fill-white" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Activate Brevo Delivery</span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/10 to-blue-400/0 -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] transition-all" />
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-1 gap-8 items-end">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">API Authentication</span>
                                        </div>
                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-tighter border border-emerald-200">Loaded from .env</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-400 text-xs font-medium font-mono select-none">
                                            {MASK}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 italic">Key derived from secure environment</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Mail className="w-3.5 h-3.5 text-blue-500" />
                                            Custom Reply-To Email
                                            <span className="text-[8px] text-slate-400 font-bold lowercase tracking-normal">(optional)</span>
                                        </label>
                                    </div>
                                    <div className="relative group">
                                        <input
                                            type="email"
                                            value={formData.brevoReplyTo}
                                            onChange={(e) => setFormData({ ...formData, brevoReplyTo: e.target.value })}
                                            placeholder="replies@yourdomain.com"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-300 transition-all focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none group-hover:bg-white group-hover:border-slate-300"
                                        />
                                        <p className="mt-2 text-[9px] text-slate-400 font-medium italic px-1">Overrides the default sender for incoming replies.</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleSave()}
                                    className="w-full relative group/btn overflow-hidden h-12 rounded-xl bg-slate-900 hover:bg-black text-white shadow-lg transition-all active:scale-95"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Update Configuration</span>
                                    </div>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={fetchBrevoSenders}
                                    disabled={isSyncingSenders || !formData.brevoApiKey}
                                    className="flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-100 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <RotateCcw className={cn("w-3.5 h-3.5", isSyncingSenders && "animate-spin")} />
                                    {isSyncingSenders ? "Syncing..." : "Sync Verified Senders & Stats"}
                                </button>
                                <p className="text-[9px] text-slate-400 font-medium max-w-[200px] leading-tight italic">
                                    Fetches verified senders and live account usage statistics from Brevo.
                                </p>
                            </div>

                            {/* Brevo Insights Card */}
                            {brevoAccountError && (
                                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <AlertCircle className="w-4 h-4 text-amber-600" />
                                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">Sync Notice: {brevoAccountError}</p>
                                </div>
                            )}
                            {brevoAccount && !brevoAccountError && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Level</p>
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-black text-slate-900 uppercase">{(brevoAccount.plan?.[0]?.type) || "Free Tier"}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Credits Used</p>
                                        <div className="flex items-center gap-2">
                                            <Zap className={cn("w-4 h-4", (brevoAccount.plan?.[0]?.credits || 0) === 0 ? "text-red-500" : "text-amber-500")} />
                                            <span className={cn("text-sm font-black", (brevoAccount.plan?.[0]?.credits || 0) === 0 ? "text-red-600" : "text-slate-900")}>
                                                {(brevoAccount.plan?.[0]?.creditsUsed || 0).toLocaleString()} / {(brevoAccount.plan?.[0]?.credits || 0).toLocaleString()}
                                                {(brevoAccount.plan?.[0]?.credits || 0) === 0 && (
                                                    <span className="ml-2 text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-tighter border border-red-200">Exhausted</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-black text-slate-900 uppercase">Operational</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Strategic Identity</h4>
                                
                                {brevoSenders.length > 0 ? (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {brevoSenders.map((sender: any) => (
                                            <button
                                                key={sender.id}
                                                type="button"
                                                onClick={() => {
                                                    const newData = { 
                                                        ...formData, 
                                                        brevoSenderEmail: sender.email,
                                                        brevoSenderName: sender.name 
                                                    };
                                                    setFormData(newData);
                                                    handleSave(newData);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                                                    formData.brevoSenderEmail === sender.email 
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" 
                                                        : "bg-white border-slate-100 hover:border-slate-200 text-slate-900 shadow-sm"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center border",
                                                    formData.brevoSenderEmail === sender.email 
                                                        ? "bg-white/20 border-white/30" 
                                                        : "bg-slate-50 text-slate-400 border-slate-100"
                                                )}>
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className={cn("text-xs font-black uppercase tracking-tight truncate", formData.brevoSenderEmail === sender.email ? "text-white" : "text-slate-900")}>
                                                            {sender.name}
                                                        </span>
                                                        {formData.brevoSenderEmail === sender.email && (
                                                            <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter text-white border border-white/20">
                                                                <Zap className="w-2.5 h-2.5 fill-white" />
                                                                Live Node
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className={cn("text-[10px] font-bold lowercase truncate", formData.brevoSenderEmail === sender.email ? "text-blue-100" : "text-slate-400")}>
                                                        {sender.email}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Senders Found</p>
                                        <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Sync with Brevo API to populate verified strategic identities.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
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
