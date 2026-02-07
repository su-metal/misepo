"use client";

import React from "react";
import { Icons } from "./LandingPageIcons";

interface PricingGridProps {
    loading: boolean;
    onSelectPlan: (plan: "entry" | "standard" | "professional") => void;
    mostPopularPlan?: "entry" | "standard" | "professional";
}

export const PricingGrid: React.FC<PricingGridProps> = ({
    loading,
    onSelectPlan,
    mostPopularPlan = "standard"
}) => {
    return (
        <div className="grid md:grid-cols-3 gap-6 w-full">
            {/* Entry Plan Card */}
            <div className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border border-white hover:border-[#1823ff]/30 shadow-premium hover:-translate-y-2 duration-500">
                <div className="mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">ENTRY</span>
                    <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">エントリー</h3>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#282d32]">¥980</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                    {['月間50回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                                <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
                <button
                    className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    onClick={() => onSelectPlan("entry")}
                    disabled={loading}
                >
                    {loading ? "..." : "START PROJECT"}
                </button>
            </div>

            {/* Standard Plan Card */}
            <div className={`group bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border-2 ${mostPopularPlan === 'standard' ? 'border-[#1823ff]/30 scale-[1.05] z-10' : 'border-white'} shadow-premium hover:-translate-y-3 duration-500`}>
                {mostPopularPlan === 'standard' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1823ff] text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-xl shadow-[#1823ff]/30 whitespace-nowrap">
                        MOST POPULAR
                    </div>
                )}
                <div className="mb-6 mt-2">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-widest mb-2 block">STANDARD</span>
                    <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">スタンダード</h3>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-[#1823ff] tracking-tight">¥1,980</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                    {['月間150回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-[#282d32] leading-tight">
                            <div className="w-5 h-5 rounded-full bg-[#1823ff]/10 flex items-center justify-center shrink-0 mt-[-2px]">
                                <Icons.Check size={12} strokeWidth={4} className="text-[#1823ff]" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
                <button
                    className="w-full py-5 bg-[#1823ff] text-white rounded-2xl font-black text-[12px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#1823ff]/20 disabled:opacity-50"
                    onClick={() => onSelectPlan("standard")}
                    disabled={loading}
                >
                    {loading ? "..." : "START NOW"}
                </button>
            </div>

            {/* Pro Plan Card */}
            <div className="group bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 flex flex-col relative transition-all border border-white hover:border-[#7c3aed]/30 shadow-premium hover:-translate-y-2 duration-500">
                <div className="mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">PROFESSIONAL</span>
                    <h3 className="text-2xl font-black text-[#282d32] tracking-tighter">プロ</h3>
                </div>
                <div className="mb-8 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#282d32]">¥2,980</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ month</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                    {['月間300回生成', 'SNS / Google 全対応', '口コミ返信 AI自動生成', 'お手本学習 (分身機能)'].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] font-bold text-slate-600 leading-tight">
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-[-2px]">
                                <Icons.Check size={12} strokeWidth={4} className="text-[#7c3aed]" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
                <button
                    className="w-full py-4 bg-[#282d32] text-white rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    onClick={() => onSelectPlan("professional")}
                    disabled={loading}
                >
                    {loading ? "..." : "UPGRADE PRO"}
                </button>
            </div>
        </div>
    );
};
