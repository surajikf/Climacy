"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Server } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(`Authentication Failed: ${error.message}`);
            setLoading(false);
        } else {
            toast.success("Authentication Verified. Establishing neural link...");
            router.push("/");
            router.refresh();
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
                            <Server className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">System Access</h1>
                        <p className="text-sm font-medium text-slate-500 mt-2">I Knowledge Factory Neural Matrix</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Email Endpoint</label>
                            <div className="relative group">
                                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-10 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="Enter your email ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 ml-1">Secure Passkey</label>
                            <div className="relative group">
                                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-10 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:transform-none disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-xs font-medium text-slate-500">
                            No active profile?{" "}
                            <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                                Register Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
