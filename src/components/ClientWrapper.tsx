"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { SessionProvider } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isDashboard = pathname === "/";
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        setIsNavigating(true);
        const timer = setTimeout(() => setIsNavigating(false), 500);
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <SessionProvider>
            {/* Global Top Loading Bar */}
            <AnimatePresence>
                {isNavigating && (
                    <motion.div
                        initial={{ scaleX: 0, opacity: 1 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 origin-left z-[9999]"
                    />
                )}
            </AnimatePresence>

            <div className={`flex bg-background min-h-screen ${isAuthPage ? "items-center justify-center" : ""}`}>
                {!isAuthPage && <Sidebar />}
                <main className={cn(isAuthPage ? "w-full" : isDashboard ? "flex-1 overflow-hidden" : "flex-1 p-8 mx-auto")}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            className={isDashboard ? "h-full" : ""}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </SessionProvider>
    );
}

// Utility for cleaner classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
