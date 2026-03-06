"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Building2, Save, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    client?: any;
}

export function ClientModal({ isOpen, onClose, onSuccess, client }: ClientModalProps) {
    const toggleService = (serviceId: string, e: React.MouseEvent) => {
        e.preventDefault();
        setFormData(prev => {
            const isSelected = prev.serviceIds.includes(serviceId);
            if (isSelected) {
                return { ...prev, serviceIds: prev.serviceIds.filter(id => id !== serviceId) };
            } else {
                return { ...prev, serviceIds: [...prev.serviceIds, serviceId] };
            }
        });
    };
    const [formData, setFormData] = useState({
        clientName: "",
        contactPerson: "",
        email: "",
        primaryEmail: "",
        industry: "",
        relationshipLevel: "Active",
        serviceIds: [] as string[]
    });
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchServices();
            if (client) {
                setFormData({
                    clientName: client.clientName || "",
                    contactPerson: client.contactPerson || "",
                    email: client.email || "",
                    primaryEmail: client.primaryEmail || client.email?.split(',')[0].trim() || "",
                    industry: client.industry || "",
                    relationshipLevel: client.relationshipLevel || "Active",
                    serviceIds: client.services?.map((s: any) => s.id) || []
                });
            } else {
                setFormData({
                    clientName: "",
                    contactPerson: "",
                    email: "",
                    primaryEmail: "",
                    industry: "",
                    relationshipLevel: "Active",
                    serviceIds: []
                });
            }
        }
    }, [isOpen, client]);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services");
            if (res.ok) setServices(await res.json());
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        try {
            const url = client ? `/api/clients/${client.id}` : "/api/clients";
            const method = client ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                toast.error(data.error || "A disruption occurred in the matrix. Please verify your inputs.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all" onClick={onClose} />

            <div className="bg-white w-full max-w-lg rounded-xl border border-slate-200 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">
                                {client ? "Edit Client" : "Add Client"}
                            </h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-900">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Client Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g., Tata Consultancy Services"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Contact Person</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Email Addresses</label>
                                    <textarea
                                        required
                                        placeholder="email1@company.com, email2@company.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            const newVal = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                email: newVal,
                                                // If primary email is no longer in the list, or none is set, set first one
                                                primaryEmail: prev.primaryEmail && newVal.includes(prev.primaryEmail) ? prev.primaryEmail : newVal.split(',')[0].trim()
                                            }));
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium h-20 resize-none"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium italic">Separate multiple emails with commas.</p>
                                </div>

                                {(() => {
                                    const emails = formData.email?.split(',').map(e => e.trim()).filter(Boolean) || [];
                                    if (emails.length <= 1) return null;
                                    return (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Designate Primary Email</label>
                                            <div className="flex flex-wrap gap-2">
                                                {emails.map((email, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, primaryEmail: email })}
                                                        className={cn(
                                                            "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-2",
                                                            formData.primaryEmail === email
                                                                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                                                                : "bg-white border-slate-200 text-slate-500 hover:border-blue-500"
                                                        )}
                                                    >
                                                        {formData.primaryEmail === email && <Check className="w-3 h-3" />}
                                                        {email}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Industry</label>
                                <select
                                    required
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Industry</option>
                                    {["Engineering", "Industrial", "Technology", "Retail", "Corporate", "Digital"].map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={formData.relationshipLevel}
                                    onChange={(e) => setFormData({ ...formData, relationshipLevel: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium appearance-none"
                                >
                                    {["Active", "Warm Lead", "Past Client"].map(lvl => (
                                        <option key={lvl} value={lvl}>{lvl}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Services</label>
                                {services.length === 0 ? (
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                        None Configured
                                    </span>
                                ) : (
                                    <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-100">
                                        Select Linked Services
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 bg-slate-50/50 border border-slate-200 p-4 rounded-xl max-h-48 overflow-y-auto custom-scrollbar group">
                                {services.map((service) => {
                                    const isSelected = formData.serviceIds.includes(service.id);
                                    return (
                                        <button
                                            key={service.id}
                                            type="button"
                                            onClick={(e) => toggleService(service.id, e)}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-sm",
                                                isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-blue-100"
                                                    : "bg-white border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-3 h-3 rounded border flex items-center justify-center transition-colors",
                                                isSelected ? "bg-white border-white text-blue-600" : "bg-slate-50 border-slate-200"
                                            )}>
                                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[4px]" />}
                                            </div>
                                            {service.serviceName}
                                        </button>
                                    );
                                })}
                                {services.length === 0 && (
                                    <div className="col-span-2 py-4 text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialize services in the catalog first</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-slate-100 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                        >
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            {client ? "Save Changes" : "Add Client"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
