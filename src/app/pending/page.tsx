import { createClient } from "@/lib/supabase/client";
import { Clock, LogOut, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingPage() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                if (user.user_metadata?.status === "APPROVED") {
                    router.push("/");
                }
            } else {
                router.push("/login");
            }
        };
        checkStatus();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden text-center">

                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl mx-auto flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 border border-amber-200 rounded-3xl animate-ping opacity-20" />
                        <Clock className="w-10 h-10" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Clearance Pending</h1>

                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
                        Your neural profile has been generated successfully, but requires <span className="font-bold text-slate-700">Level-5 Admin</span> clearance before you can access the matrix.
                        Please contact the System Administrator to expedite your request.
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-white border border-slate-200 text-slate-700 rounded-xl py-3 text-sm font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Status: Isolated
                    </div>
                </div>
            </div>
        </div>
    );
}
