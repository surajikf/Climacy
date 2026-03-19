"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Send,
    Settings,
    History,
    Zap,
    ShieldAlert,
    LogOut,
    UserCircle2,
    DownloadCloud
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Campaigns", href: "/campaigns", icon: Send },
    { name: "Composer", href: "/campaigns/results", icon: Zap },
    { name: "History", href: "/history", icon: History },
    { name: "Integrations", href: "/import", icon: DownloadCloud },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({ totalClients: 0, integrationReady: false });
    const supabase = createClient();

    // 1. Fetch Auth Session (Supabase)
    useEffect(() => {
        const getSession = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) router.push("/login");
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // 2. Fetch Sidebar Stats (Fast/Smart)
    useEffect(() => {
        const fetchSidebarStats = async () => {
            try {
                const res = await fetch("/api/dashboard-stats");
                if (res.ok) setStats(await res.json());
            } catch (error) {
                console.error("Sidebar stats failure", error);
            }
        };
        fetchSidebarStats();
    }, [pathname]);

    // 2. Keyboard Shortcuts (Smart)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Only trigger if no input is focused
        if (["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)) return;

        if (e.key.toLowerCase() === "g") {
            const nextKeyHandler = (ne: KeyboardEvent) => {
                const key = ne.key.toLowerCase();
                if (key === "d") router.push("/");
                if (key === "c") router.push("/clients");
                if (key === "s") router.push("/settings");
                if (key === "i") router.push("/import");
                window.removeEventListener("keydown", nextKeyHandler);
            };
            window.addEventListener("keydown", nextKeyHandler, { once: true });
        }
    }, [router]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="w-64 h-screen border-r border-slate-200 bg-slate-50 flex flex-col z-50 sticky top-0 hidden md:flex">
            <div className="p-6 pt-8 pb-8 flex justify-start">
                <Link href="https://www.ikf.co.in/" target="_blank" className="flex items-center gap-2 group cursor-pointer">
                    <img src="/logo.png" alt="I Knowledge Factory Pvt. Ltd." className="h-12 w-auto object-contain" />
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4 custom-scrollbar overflow-y-auto">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider">OVERVIEW</div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;

                    const defaultLink = (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 group",
                                isActive
                                    ? "bg-white text-slate-900 font-medium shadow-sm border border-slate-200/60"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            <item.icon className={cn(
                                "w-[18px] h-[18px] transition-transform group-hover:scale-110",
                                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                            )} strokeWidth={isActive ? 2.5 : 2} />
                            <div className="flex flex-col items-start translate-y-[1px]">
                                <span className="text-sm">{item.name}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                    G + {item.name[0].toUpperCase()}
                                </span>
                            </div>

                            {/* Smart Badges */}
                            {item.name === "Clients" && stats.totalClients > 0 && (
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="ml-auto text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                                >
                                    {stats.totalClients}
                                </motion.span>
                            )}
                            {item.name === "Integrations" && stats.integrationReady && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            )}
                        </Link>
                    );

                    if (item.name === "Settings" && user?.user_metadata?.role === "ADMIN") {
                        const adminLink = (
                            <Link
                                key="admin-panel"
                                href="/admin"
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-150 group",
                                    pathname === "/admin"
                                        ? "bg-red-50 text-red-600 font-medium shadow-sm border border-red-100"
                                        : "text-slate-500 hover:text-red-600 hover:bg-red-50/50"
                                )}
                            >
                                <ShieldAlert className={cn(
                                    "w-[18px] h-[18px]",
                                    pathname === "/admin" ? "text-red-600" : "text-slate-400 group-hover:text-red-500"
                                )} strokeWidth={pathname === "/admin" ? 2.5 : 2} />
                                <span className="text-sm">Control Panel</span>
                            </Link>
                        );
                        return [adminLink, defaultLink];
                    }

                    return defaultLink;
                })}
            </nav>

            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            {user?.user_metadata?.role === "ADMIN" ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <UserCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                                {user?.user_metadata?.full_name || "Neural Operator"}
                            </p>
                            <p className="text-[10px] font-medium text-slate-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
