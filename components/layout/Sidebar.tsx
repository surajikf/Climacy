"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Users,
    Send,
    Settings,
    Zap,
    FolderKanban,
    ShieldAlert,
    LogOut,
    UserCircle2,
    DownloadCloud,
    ChevronLeft,
    ChevronRight,
    Menu
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBranding } from "@/hooks/useBranding";
import { apiPath, appPath } from "@/lib/app-path";

const topNavigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
];

const navigation = [
    { name: "Integrations", href: "/import", icon: DownloadCloud },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Control Panel", href: "/admin", icon: ShieldAlert, adminOnly: true },
    { name: "Settings", href: "/settings", icon: Settings },
];

const campaignNavigation = [
    { name: "1. Create Campaign", href: "/campaigns", icon: Send },
    { name: "2. Campaign List", href: "/campaigns/list", icon: Zap },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status: authStatus } = useSession();
    const user = session?.user;
    const [stats, setStats] = useState({ totalClients: 0, integrationReady: false });
    const { projectName, projectLogo } = useBranding();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Load collapse state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar_collapsed");
        if (saved === "true") setIsCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem("sidebar_collapsed", String(newState));
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    // 2. Fetch Sidebar Stats (Fast/Smart)
    useEffect(() => {
        if (authStatus === "authenticated") {
            const fetchSidebarStats = async () => {
                try {
                    const res = await fetch(apiPath("/dashboard-stats"));
                    if (res.ok) setStats(await res.json());
                } catch (error) {
                    console.error("Sidebar stats failure", error);
                }
            };
            fetchSidebarStats();
        }
    }, [pathname, authStatus]);

    // 2. Keyboard Shortcuts (Smart)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Only trigger if no input is focused
        if (["INPUT", "TEXTAREA"].includes((document.activeElement as HTMLElement)?.tagName)) return;

        if (e.key?.toLowerCase() === "g") {
            const nextKeyHandler = (ne: KeyboardEvent) => {
                const key = ne.key?.toLowerCase();
                if (key === "d") router.push(appPath("/"));
                if (key === "c") router.push(appPath("/clients"));
                if (key === "m") router.push(appPath("/campaigns/list"));
                if (key === "s") router.push(appPath("/settings"));
                if (key === "i") router.push(appPath("/import"));
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
        <motion.div 
            animate={{ width: isCollapsed ? 64 : 256 }}
            transition={{ type: "spring", stiffness: 400, damping: 40, mass: 1 }}
            className={cn(
                "h-screen border-r border-slate-200 bg-slate-50 flex flex-col z-50 sticky top-0 hidden md:flex transition-all group/sidebar",
                isCollapsed ? "items-center" : ""
            )}
        >
            <div className={cn("p-6 pt-8 pb-4 flex items-center relative", isCollapsed ? "justify-center" : "justify-between")}>
                <div className="flex items-center gap-3 group">
                    {projectLogo ? (
                        <div className="bg-slate-900 p-2 rounded-xl shadow-sm border border-slate-800 flex items-center justify-center min-w-[3rem]">
                            <img src={projectLogo} alt={projectName} className="h-8 w-auto object-contain" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-sm">
                                {projectName.charAt(0)}
                            </div>
                            {!isCollapsed && (
                                <motion.span 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-bold text-slate-900 tracking-tight text-lg"
                                >
                                    {projectName}
                                </motion.span>
                            )}
                        </div>
                    )}
                </div>
                
                <button
                    onClick={toggleCollapse}
                    className={cn(
                        "absolute -right-3 top-9 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 shadow-md transition-all z-50",
                        isCollapsed ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100"
                    )}
                >
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4 custom-scrollbar overflow-y-auto">
                {!isCollapsed && <div className="px-4 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Overview</div>}
                {topNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center rounded-xl transition-all duration-200 group/nav relative",
                                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-3 py-2.5 mb-1",
                                isActive
                                    ? isCollapsed ? "bg-blue-50 text-blue-600" : "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="absolute -left-2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                />
                            )}
                            <item.icon className={cn(
                                "w-[20px] h-[20px] transition-all",
                                isActive ? "text-blue-600 scale-105" : "text-slate-400 group-hover/nav:text-slate-600 group-hover/nav:scale-110"
                            )} strokeWidth={isActive ? 2.5 : 2} />
                            {!isCollapsed && <span className="text-xs font-semibold tracking-tight">{item.name}</span>}
                        </Link>
                    );
                })}

                <div className={cn("px-4 mt-5 mb-2 flex items-center gap-2", isCollapsed ? "justify-center" : "")}>
                    <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                    {!isCollapsed && <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Campaigns</span>}
                </div>
                {campaignNavigation.map((item) => {
                    const href = item.href;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={appPath(href)}
                            className={cn(
                                "w-full flex items-center rounded-xl transition-all duration-200 group/nav relative",
                                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-3 py-2.5 mb-1",
                                isActive
                                    ? isCollapsed ? "bg-blue-50 text-blue-600" : "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="active-indicator-campaign"
                                    className="absolute -left-2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                />
                            )}
                            <item.icon className={cn(
                                "w-[20px] h-[20px] transition-all",
                                isActive ? "text-blue-600 scale-105" : "text-slate-400 group-hover/nav:text-slate-600 group-hover/nav:scale-110"
                            )} strokeWidth={isActive ? 2.5 : 2} />
                            {!isCollapsed && <span className="text-xs font-semibold tracking-tight">{item.name}</span>}
                        </Link>
                    );
                })}

                {!isCollapsed && <div className="px-4 mt-5 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Operations</div>}
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    if ((item as any).adminOnly && (user as any)?.role !== "ADMIN") return null;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "w-full flex items-center rounded-xl transition-all duration-200 group/nav relative",
                                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "gap-3 px-3 py-2.5 mb-1",
                                isActive
                                    ? isCollapsed ? "bg-blue-50 text-blue-600" : "bg-white text-blue-600 shadow-sm border border-slate-200/60"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                            title={isCollapsed ? item.name : ""}
                        >
                            {isActive && (
                                <motion.div 
                                    layoutId="active-indicator-ops"
                                    className="absolute -left-2 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                />
                            )}
                            <item.icon className={cn(
                                "w-[20px] h-[20px] transition-all",
                                isActive ? "text-blue-600 scale-105" : "text-slate-400 group-hover/nav:text-slate-600 group-hover/nav:scale-110"
                            )} strokeWidth={isActive ? 2.5 : 2} />
                            
                            {!isCollapsed && (
                                <div className="flex flex-col items-start translate-y-[1px]">
                                    <span className="text-xs font-semibold tracking-tight">{item.name}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-0 group-hover/nav:opacity-100 transition-opacity">
                                        G + {item.name[0].toUpperCase()}
                                    </span>
                                </div>
                            )}

                            {/* Smart Badges */}
                            {item.name === "Clients" && stats.totalClients > 0 && (
                                <motion.span
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={cn(
                                        "font-bold transition-all",
                                        isCollapsed 
                                            ? "absolute top-2 right-2 text-[9px] min-w-[14px] h-[14px] flex items-center justify-center bg-blue-600 text-white rounded-full ring-2 ring-slate-50" 
                                            : "ml-auto text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full group-hover/nav:bg-blue-50 group-hover/nav:text-blue-600"
                                    )}
                                >
                                    {stats.totalClients > 999 && isCollapsed ? "1k+" : stats.totalClients}
                                </motion.span>
                            )}
                            {item.name === "Integrations" && stats.integrationReady && (
                                <div className={cn(
                                    "rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                                    isCollapsed ? "absolute top-2.5 right-2.5 w-2 h-2 ring-2 ring-slate-50" : "ml-auto w-1.5 h-1.5"
                                )} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={cn("p-2 border-t border-slate-200/80 bg-slate-50/50", isCollapsed ? "flex flex-col items-center" : "p-4")}>
                <div className={cn("bg-white border border-slate-200 shadow-sm transition-all", isCollapsed ? "rounded-full p-1" : "rounded-xl p-4 space-y-3")}>
                    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                        <div className={cn(
                            "rounded-lg flex items-center justify-center shrink-0",
                            isCollapsed ? "w-10 h-10 bg-slate-900 text-white" : "w-8 h-8 bg-slate-100 text-slate-500"
                        )}>
                            {(user as any)?.role === "ADMIN" ? <ShieldAlert className={cn(isCollapsed ? "w-5 h-5" : "w-4 h-4 text-red-500")} /> : <UserCircle2 className={cn(isCollapsed ? "w-5 h-5" : "w-4 h-4")} />}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-[10px] font-medium text-slate-500 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>
                    {!isCollapsed && (
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100 uppercase tracking-[0.1em]"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    )}
                </div>
                {isCollapsed && (
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}
