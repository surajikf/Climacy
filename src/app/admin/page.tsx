"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, CheckCircle2, Ban, Clock, ShieldHalf, ShieldCheck, Mail, User as UserIcon, Trash2 } from "lucide-react";
import { isPrimaryAdminEmail, PRIMARY_ADMIN_EMAIL } from "@/lib/auth-primary";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.user_metadata?.role !== "ADMIN") {
                    router.push("/");
                } else {
                    setUser(user);
                    fetchUsers();
                }
            } else {
                router.push("/login");
            }
            setAuthLoading(false);
        };
        checkAuth();
    }, [router, supabase]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch node access logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (
        userId: string,
        action: "APPROVE" | "BAN" | "MAKE_ADMIN" | "REVOKE_ADMIN" | "DELETE_USER",
    ) => {
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action }),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                toast.success(action === "DELETE_USER" ? "User removed from Supabase Auth." : `Access policy updated for node.`);
                fetchUsers();
            } else {
                toast.error(data.error?.message || data.error || "Failed to update access policy.");
            }
        } catch (error) {
            toast.error("Network instability detected.");
        }
    };

    const handlePurgeOthers = async () => {
        const typed = window.prompt(
            `This deletes every Supabase Auth user except ${PRIMARY_ADMIN_EMAIL} and matching database rows. Type PURGE to confirm:`,
        );
        if (typed !== "PURGE") {
            if (typed !== null) toast.error("Confirmation text did not match.");
            return;
        }
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "PURGE_ALL_EXCEPT_PRIMARY" }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                toast.success(
                    `Removed ${data.data?.deletedAuthUsers ?? 0} other auth account(s); Prisma rows removed: ${data.data?.deletedPrismaUsers ?? 0}.`,
                );
                fetchUsers();
            } else {
                toast.error(data.error?.message || "Purge failed. Ensure SUPABASE_SERVICE_ROLE_KEY is set on the server.");
            }
        } catch {
            toast.error("Network error during purge.");
        }
    };

    if (loading || authLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-500 pb-20 px-3 sm:px-4 lg:px-6">
            <header className="px-2">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                    <ShieldAlert className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Level-5 Clearance Zone</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Access Management</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">
                    Users are loaded from <strong>Supabase Auth</strong> (admin API). Only{" "}
                    <code className="text-xs bg-slate-100 px-1 rounded">{PRIMARY_ADMIN_EMAIL}</code> can register; all
                    access checks use Supabase sessions.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handlePurgeOthers}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-700"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove all other accounts
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Personnel</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Level</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Directives</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {users.map((userItem) => (
                            <tr key={userItem.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                            <UserIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {userItem.name || "Unknown Entity"}
                                                {userItem.id === user?.id && (
                                                    <span className="text-[9px] uppercase tracking-wider bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">You</span>
                                                )}
                                            </div>
                                            <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3 h-3" />
                                                {userItem.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {userItem.role === "ADMIN" ? (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 w-fit px-2.5 py-1 rounded-md border border-red-100">
                                            <ShieldAlert className="w-3.5 h-3.5" />
                                            Admin
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 w-fit px-2.5 py-1 rounded-md border border-slate-200">
                                            <ShieldHalf className="w-3.5 h-3.5" />
                                            Standard User
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {userItem.status === "APPROVED" && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                            <CheckCircle2 className="w-4 h-4" /> Approved
                                        </span>
                                    )}
                                    {userItem.status === "PENDING" && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                                            <Clock className="w-4 h-4 animate-pulse" /> Pending
                                        </span>
                                    )}
                                    {userItem.status === "BANNED" && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                                            <Ban className="w-4 h-4" /> Revoked
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {userItem.id !== user?.id && (
                                            <>
                                                {userItem.status !== "APPROVED" && (
                                                    <button onClick={() => handleAction(userItem.id, "APPROVE")} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors tooltip-trigger" title="Approve Access">
                                                        <ShieldCheck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {userItem.status !== "BANNED" && (
                                                    <button onClick={() => handleAction(userItem.id, "BAN")} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors tooltip-trigger" title="Revoke Access">
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {userItem.status === "APPROVED" && userItem.role !== "ADMIN" && (
                                                    <button onClick={() => handleAction(userItem.id, "MAKE_ADMIN")} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors tooltip-trigger" title="Elevate to Admin">
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {userItem.status === "APPROVED" && userItem.role === "ADMIN" && (
                                                    <button onClick={() => handleAction(userItem.id, "REVOKE_ADMIN")} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors tooltip-trigger" title="Revoke Admin Rights">
                                                        <ShieldHalf className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {!isPrimaryAdminEmail(userItem.email) && (
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                window.confirm(
                                                                    `Permanently delete ${userItem.email} from Supabase Auth?`,
                                                                )
                                                            ) {
                                                                handleAction(userItem.id, "DELETE_USER");
                                                            }
                                                        }}
                                                        className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors tooltip-trigger"
                                                        title="Delete user from Supabase Auth"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-sm font-medium text-slate-400">No personnel records found in the matrix.</div>
                )}
            </div>
        </div>
    );
}
