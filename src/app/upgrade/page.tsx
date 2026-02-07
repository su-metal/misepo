"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useStartFlow } from "@/hooks/useStartFlow";
import { Icons } from "@/components/LandingPageIcons";
import { PricingGrid } from "@/components/PricingGrid";

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay z-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

function UpgradePageContent() {
    const {
        loading,
        goCheckout,
        isRedirecting
    } = useStartFlow({ skipRedirect: true });

    if (isRedirecting) {
        return (
            <main className="min-h-screen bg-[#f0eae4] flex items-center justify-center relative overflow-hidden font-inter selection:bg-[#1823ff] selection:text-white">
                <NoiseOverlay />
                <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-premium rounded-[3rem] p-16 flex flex-col items-center gap-10">
                        <div className="relative">
                            <div className="w-24 h-24 border-[3px] border-slate-200 border-t-[#1823ff] rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-4 h-4 bg-[#1823ff] rounded-full animate-pulse shadow-[0_0_20px_rgba(24,35,255,0.3)]"></div>
                            </div>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-[#282d32] tracking-tighter mb-3">チェックアウトへ移動中...</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">安全な決済ページへ転送しています</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f0eae4] text-[#282d32] flex flex-col items-center px-4 py-12 relative overflow-hidden bg-gradient-mesh font-inter selection:bg-[#1823ff] selection:text-white pb-32">
            <NoiseOverlay />

            <div className="glow-orb absolute w-[30rem] h-[30rem] bg-rose-500/10 -top-20 -right-20 animate-pulse-gentle rounded-full blur-[120px] pointer-events-none" />
            <div className="glow-orb absolute w-[20rem] h-[20rem] bg-[#1823ff]/10 bottom-0 -left-20 animate-spin-slow rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-4xl relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">

                <Link
                    href="/generate"
                    className="group mb-8 inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-white/50 hover:bg-white px-5 py-2 rounded-full border border-white transition-all shadow-sm"
                >
                    <Icons.ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    ダッシュボードへ戻る
                </Link>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[#282d32] tracking-tighter mb-4 leading-none">
                        プランをアップグレードして<br /><span className="text-[#1823ff]">制限を解除。</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
                        より多くの生成回数と、高度な機能で、<br />
                        お店の発信力を最大化しましょう。
                    </p>
                </div>

                <PricingGrid
                    loading={loading}
                    onSelectPlan={(p) => goCheckout(p)}
                />

                <div className="mt-20 pt-10 border-t border-slate-100 w-full text-center">
                    <div className="flex flex-col items-center gap-8 opacity-70">
                        <div className="flex items-center gap-10 text-slate-500">
                            <Icons.Lock size={28} />
                            <Icons.Shield size={28} />
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                            決済はStripeを通じて安全に行われます。<br />
                            MisePo Security Shield Active.
                        </p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .shadow-premium {
          box-shadow: 0 30px 60px -12px rgba(0,0,0,0.06), 0 18px 36px -18px rgba(0,0,0,0.02);
        }
        .animate-pulse-gentle {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
        </main>
    );
}

export default function UpgradePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#f0eae4] flex items-center justify-center font-black uppercase tracking-[0.6em] text-[#1823ff] animate-pulse text-xs">Loading...</div>}>
            <UpgradePageContent />
        </Suspense>
    );
}
