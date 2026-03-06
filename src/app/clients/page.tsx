"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Mail,
    ChevronRight,
    Upload,
    Trash2,
    Edit3,
    Loader2,
    X,
    Tag,
    ChevronDown,
    Check,
    RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientModal } from "@/components/ClientModal";
import { toast } from "sonner";
import { categorizeEmail, CATEGORIES, CATEGORY_COLORS, EmailCategory } from "@/lib/emailCategorization";
import { motion, AnimatePresence } from "framer-motion";
import { SmartLoader } from "@/components/SmartLoader";

export default function ClientManager() {
    const [view, setView] = useState<"clients" | "services" | "rolebased">("clients");
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterIndustry, setFilterIndustry] = useState<string[]>([]);
    const [filterLevel, setFilterLevel] = useState<string[]>([]);
    const [filterService, setFilterService] = useState<string[]>([]);
    const [filterSource, setFilterSource] = useState<string[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [clientToDelete, setClientToDelete] = useState<string | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<any>(null);
    const [newServiceData, setNewServiceData] = useState({ serviceName: "", category: "Digital", description: "" });

    const abortControllerRef = useRef<AbortController | null>(null);
    const initialLoadRef = useRef(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            console.log("🎬 Component mount init");
            await fetchServices();
            await fetchClients();
            initialLoadRef.current = false;
        };
        init();
    }, []);

    useEffect(() => {
        if (!initialLoadRef.current) {
            console.log("🔄 Filter update trigger");
            fetchClients();
        }
    }, [filterIndustry, filterLevel, filterService, filterSource, view]);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            if (res.ok) {
                setServices(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchClients = async () => {
        console.log("🚀 fetchClients triggered");
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        setLoading(true);
        try {
            const query = new URLSearchParams();
            filterIndustry.forEach(v => query.append("industry", v));
            filterLevel.forEach(v => query.append("level", v));
            filterService.forEach(v => query.append("service", v));
            filterSource.forEach(v => query.append("source", v));
            if (view === "rolebased") query.append("roleBased", "true");

            const res = await fetch(`/api/clients?${query.toString()}`, { signal: abortControllerRef.current.signal });
            const data = await res.json();
            setClients(Array.isArray(data) ? data : []);
        } catch (err: any) {
            if (err.name !== 'AbortError') console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!clientToDelete) return;
        try {
            const res = await fetch(`/api/clients/${clientToDelete}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Entity removed from the database.");
                fetchClients();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setClientToDelete(null);
        }
    };

    const handleServiceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
            const method = editingService ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newServiceData),
            });
            if (res.ok) {
                toast.success(editingService ? "Service record recalibrated." : "New service record integrated.");
                fetchServices();
                setIsServiceModalOpen(false);
                setEditingService(null);
                setNewServiceData({ serviceName: "", category: "Digital", description: "" });
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to sync service record.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Transmission failure during service sync.");
        }
    };

    const confirmServiceDelete = async () => {
        if (!serviceToDelete) return;
        try {
            const res = await fetch(`/api/services/${serviceToDelete}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Service record purged.");
                fetchServices();
                fetchClients(); // Update client tags
            }
        } catch (err) {
            console.error(err);
        } finally {
            setServiceToDelete(null);
        }
    };

    const handleEdit = (client: any) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const filteredClients = useMemo(() => {
        return clients.filter(c => {
            const matchesSearch = !search ||
                c.clientName.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.industry.toLowerCase().includes(search.toLowerCase()) ||
                (c.contactPerson && c.contactPerson.toLowerCase().includes(search.toLowerCase()));

            if (!matchesSearch) return false;

            if (filterIndustry.length > 0 && !filterIndustry.includes(c.industry)) return false;
            if (filterLevel.length > 0 && !filterLevel.includes(c.relationshipLevel)) return false;
            if (filterSource.length > 0 && !filterSource.includes(c.source)) return false;

            if (filterService.length > 0) {
                const clientServiceIds = c.services?.map((s: any) => s.id) || [];
                if (!filterService.some(id => clientServiceIds.includes(id))) return false;
            }

            return true;
        });
    }, [clients, search, filterIndustry, filterLevel, filterService, filterSource]);

    const industries = useMemo(() => {
        const set = new Set(clients.map(c => c.industry).filter(Boolean));
        return Array.from(set).sort();
    }, [clients]);

    const levels = ["Active", "Warm Lead", "Past Client"];
    const sources = ["MANUAL", "ZOHO_BIGIN", "GMAIL", "INVOICE_SYSTEM"];

    const toggleFilter = (setter: any, current: string[], value: string) => {
        if (current.includes(value)) {
            setter(current.filter(v => v !== value));
        } else {
            setter([...current, value]);
        }
    };

    const clearAllFilters = () => {
        setSearch("");
        setFilterIndustry([]);
        setFilterLevel([]);
        setFilterService([]);
        setFilterSource([]);
    };

    const activeFilterCount = filterIndustry.length + filterLevel.length + filterService.length + filterSource.length;

    const FilterPopover = ({ label, options, selected, onToggle, icon: Icon }: any) => {
        const [isOpen, setIsOpen] = useState(false);
        const popoverRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div className="relative" ref={popoverRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                        selected.length > 0
                            ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                >
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    <span>{label}</span>
                    {selected.length > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                            {selected.length}
                        </span>
                    )}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute z-50 mt-2 w-64 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl p-2 top-full right-0 md:left-0"
                        >
                            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                {options.map((opt: any) => {
                                    const value = typeof opt === 'string' ? opt : opt.value;
                                    const display = typeof opt === 'string' ? opt : opt.label;
                                    const isSelected = selected.includes(value);

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => onToggle(value)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5",
                                                isSelected
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            )}
                                        >
                                            <span className="truncate">{display}</span>
                                            {isSelected && <Check className="w-4 h-4 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="space-y-8 w-full max-w-[100vw] px-4 md:px-6 lg:px-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                        {view === "clients" ? "Portfolio" : view === "services" ? "Capabilities" : "Role-Based Contacts"}
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                        {view === "clients" ? "Manage and segment your company records." :
                            view === "services" ? "Configure service offerings and categories." :
                                "Isolated generic business and system emails."}
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
                        <button
                            onClick={() => setView("clients")}
                            className={cn(
                                "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all",
                                view === "clients" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Clients
                        </button>
                        <button
                            onClick={() => setView("services")}
                            className={cn(
                                "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all",
                                view === "services" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => setView("rolebased")}
                            className={cn(
                                "text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-all",
                                view === "rolebased" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Role-Based
                        </button>
                    </div>
                    {view === "clients" ? (
                        <button
                            onClick={() => { setSelectedClient(null); setIsModalOpen(true); }}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
                        >
                            Add Client
                        </button>
                    ) : view === "services" ? (
                        <button
                            onClick={() => { setEditingService(null); setNewServiceData({ serviceName: "", category: "Digital", description: "" }); setIsServiceModalOpen(true); }}
                            className="bg-slate-900 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.98]"
                        >
                            Add Service
                        </button>
                    ) : null}
                </div>
            </div>

            {view === "clients" || view === "rolebased" ? (
                <>
                    <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-1 min-w-[300px] items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl group focus-within:bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by company, industry, or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium text-slate-900"
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <FilterPopover
                                    label="Industry"
                                    options={industries}
                                    selected={filterIndustry}
                                    onToggle={(val: string) => toggleFilter(setFilterIndustry, filterIndustry, val)}
                                    icon={Filter}
                                />
                                <FilterPopover
                                    label="Services"
                                    options={services.map(s => ({ label: s.serviceName, value: s.id }))}
                                    selected={filterService}
                                    onToggle={(val: string) => toggleFilter(setFilterService, filterService, val)}
                                    icon={Plus}
                                />
                                <FilterPopover
                                    label="Level"
                                    options={levels}
                                    selected={filterLevel}
                                    onToggle={(val: string) => toggleFilter(setFilterLevel, filterLevel, val)}
                                    icon={ChevronRight}
                                />
                                <FilterPopover
                                    label="Source"
                                    options={sources}
                                    selected={filterSource}
                                    onToggle={(val: string) => toggleFilter(setFilterSource, filterSource, val)}
                                    icon={Upload}
                                />

                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all group border border-transparent hover:border-red-100"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Chips */}
                        <AnimatePresence>
                            {activeFilterCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-wrap gap-2 pt-2 border-t border-slate-100"
                                >
                                    {filterIndustry.map(val => (
                                        <span key={val} className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                            {val}
                                            <button onClick={() => toggleFilter(setFilterIndustry, filterIndustry, val)} className="p-0.5 hover:bg-blue-100 rounded-full"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    {filterService.map(val => {
                                        const s = services.find(srv => srv.id === val);
                                        return (
                                            <span key={val} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                                {s?.serviceName}
                                                <button onClick={() => toggleFilter(setFilterService, filterService, val)} className="p-0.5 hover:bg-emerald-100 rounded-full"><X className="w-3 h-3" /></button>
                                            </span>
                                        );
                                    })}
                                    {filterLevel.map(val => (
                                        <span key={val} className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-[10px] font-bold border border-orange-100 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                            {val}
                                            <button onClick={() => toggleFilter(setFilterLevel, filterLevel, val)} className="p-0.5 hover:bg-orange-100 rounded-full"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    {filterSource.map(val => (
                                        <span key={val} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-bold border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                            {val}
                                            <button onClick={() => toggleFilter(setFilterSource, filterSource, val)} className="p-0.5 hover:bg-slate-200 rounded-full"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-[11px]">
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Company</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Contact Person</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Services</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Email ID</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Last Contact</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Status</th>
                                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-slate-500">Source</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-slate-100" />
                                                    <div className="h-2.5 bg-slate-100 rounded-full w-32" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-2 bg-slate-100 rounded-full w-24" /></td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1.5">
                                                    <div className="h-4 bg-slate-100 rounded w-12" />
                                                    <div className="h-4 bg-slate-100 rounded w-10" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><div className="h-2 bg-slate-100 rounded-full w-24" /></td>
                                            <td className="px-6 py-4"><div className="h-2 bg-slate-100 rounded-full w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-5 bg-slate-100 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                                            <td className="px-6 py-4 text-right"></td>
                                        </tr>
                                    ))
                                ) : filteredClients.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="px-8 py-20 text-center text-slate-300 italic">No records found.</td>
                                    </tr>
                                ) : (
                                    filteredClients.map((client, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03, duration: 0.3 }}
                                            key={client.id}
                                            className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group relative"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center font-semibold text-slate-500 text-xs border border-slate-200">
                                                        {client.clientName[0]}
                                                    </div>
                                                    <div className="font-medium text-slate-900">{client.clientName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-600">{client.contactPerson || "---"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {client.services?.map((s: any) => (
                                                        <span key={s.id} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-tight">{s.serviceName}</span>
                                                    ))}
                                                    {!client.services?.length && <span className="text-[10px] text-slate-300 italic">--</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    {(() => {
                                                        const emails = client.email?.split(',').map((e: string) => e.trim()).filter(Boolean) || [];
                                                        const primary = emails.slice(0, 2);
                                                        const overflow = emails.slice(2);

                                                        return (
                                                            <>
                                                                {primary.map((email: string, idx: number) => (
                                                                    <a
                                                                        key={idx}
                                                                        href={`mailto:${email}`}
                                                                        className="text-sm text-slate-600 hover:text-blue-600 transition-colors lowercase font-medium w-fit block"
                                                                    >
                                                                        {email}
                                                                    </a>
                                                                ))}
                                                                {overflow.length > 0 && (
                                                                    <div className="mt-1 space-y-1">
                                                                        {overflow.map((email: string, idx: number) => (
                                                                            <div key={idx} className="flex items-center gap-2 group/email">
                                                                                <div className="w-1 h-1 rounded-full bg-slate-300 group-hover/email:bg-blue-400 transition-colors" />
                                                                                <a
                                                                                    href={`mailto:${email}`}
                                                                                    className="text-[11px] text-slate-400 hover:text-blue-500 transition-colors lowercase font-medium"
                                                                                >
                                                                                    {email}
                                                                                </a>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                    {client.lastContacted ? formatDistanceToNow(new Date(client.lastContacted), { addSuffix: true }) : "Never"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        client.relationshipLevel === "Active" ? "bg-emerald-500" :
                                                            client.relationshipLevel === "Warm Lead" ? "bg-amber-500" :
                                                                "bg-slate-300"
                                                    )} />
                                                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-tight">{client.relationshipLevel}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {client?.source === "INVOICE_SYSTEM" && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest">
                                                        Invoice Sys
                                                    </span>
                                                )}
                                                {client?.source === "ZOHO_BIGIN" && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-widest">
                                                        Zoho Bigin
                                                    </span>
                                                )}
                                                {client?.source === "GMAIL" && (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest w-fit">
                                                            Gmail
                                                        </span>
                                                        <span className="text-[9px] text-slate-400 font-bold ml-1 truncate max-w-[80px]">{client.gmailSourceAccount || 'Contact'}</span>
                                                    </div>
                                                )}
                                                {(client?.source === "MANUAL" || !client?.source) && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 uppercase tracking-widest">
                                                        Manual
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(client)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => setClientToDelete(client.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <AnimatePresence>
                            {loading && (
                                <SmartLoader label="Syncing Database" description="Optimizing client view..." />
                            )}
                        </AnimatePresence>
                    </div>
                </>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {services.map((service) => (
                        <div key={service.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                    {service.category || "General"}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => { setEditingService(service); setNewServiceData({ serviceName: service.serviceName, category: service.category || "Digital", description: service.description || "" }); setIsServiceModalOpen(true); }}
                                        className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-md"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setServiceToDelete(service.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-bold text-slate-900 tracking-tight">{service.serviceName}</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                                    {service.description || "No description provided for this service node."}
                                </p>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                            <p className="text-sm font-medium text-slate-400 italic">No service records configured in the database.</p>
                            <button
                                onClick={() => setIsServiceModalOpen(true)}
                                className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
                            >
                                Integrate First Service
                            </button>
                        </div>
                    )}
                </div>
            )}

            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchClients}
                client={selectedClient}
            />

            {/* Client Delete Modal */}
            {clientToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-all" onClick={() => setClientToDelete(null)} />
                    <div className="bg-white p-6 rounded-xl shadow-xl relative w-full max-w-sm border border-slate-200">
                        <div className="space-y-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Remove Client</h3>
                                <p className="text-sm text-slate-500 mt-1">This action will permanently delete this client record. Are you sure?</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-6">
                            <button onClick={() => setClientToDelete(null)} className="flex-1 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-md shadow-sm">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md shadow-sm active:scale-[0.98]">Remove</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Delete Modal */}
            {serviceToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-all" onClick={() => setServiceToDelete(null)} />
                    <div className="bg-white p-6 rounded-xl shadow-xl relative w-full max-w-sm border border-slate-200">
                        <div className="space-y-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-100">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Purge Service Node</h3>
                                <p className="text-sm text-slate-500 mt-1">This will remove this service from the catalog and all linked clients. Continue?</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-6">
                            <button onClick={() => setServiceToDelete(null)} className="flex-1 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-md shadow-sm">Cancel</button>
                            <button onClick={confirmServiceDelete} className="flex-1 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors rounded-md shadow-sm active:scale-[0.98]">Purge</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Edit/Add Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={() => setIsServiceModalOpen(false)} />
                    <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900 uppercase tracking-widest text-xs">{editingService ? "Recalibrate Service" : "Integrate New Service"}</h3>
                            <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-slate-900"><X className="w-4 h-4" /></button>
                        </div>
                        <form onSubmit={handleServiceSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newServiceData.serviceName}
                                    onChange={(e) => setNewServiceData({ ...newServiceData, serviceName: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                                    placeholder="e.g., Strategic Advisory"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                                <select
                                    value={newServiceData.category}
                                    onChange={(e) => setNewServiceData({ ...newServiceData, category: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                                >
                                    {["Digital", "Strategy", "Creative", "Marketing", "Technology", "Other"].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                                <textarea
                                    value={newServiceData.description}
                                    onChange={(e) => setNewServiceData({ ...newServiceData, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium h-24 resize-none"
                                    placeholder="Briefly describe the service vector..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] mt-2 shadow-lg"
                            >
                                {editingService ? "Update Node" : "Deploy Service"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
