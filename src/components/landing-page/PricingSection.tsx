"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className="py-24 md:py-48 bg-[#F4F6F9] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-start mb-24">
                        <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">Cost Performance</span>
                        <h2 className={`font-black tracking-tighter leading-[0.9] text-[#282d32] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                            BETTER<br />
                            <span className="text-[#1823ff]">VALUE.</span>
                        </h2>
                    </div>

                    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                        <div className="bg-white rounded-[40px] p-10 flex flex-col items-start border border-slate-100">
                            <span className="text-[10px] font-black text-slate-300 uppercase mb-6 tracking-widest">Manual Staff</span>
                            <div className="text-4xl font-black text-[#282d32] mb-8">¥0<span className="text-base text-slate-300 ml-2">?</span></div>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                コストはゼロですが、あなたとスタッフの貴重な「時間」と「精神」を削り続けます。
                            </p>
                        </div>

                        <div className="bg-white rounded-[40px] p-10 flex flex-col items-start border border-slate-100">
                            <span className="text-[10px] font-black text-slate-300 uppercase mb-6 tracking-widest">Agency</span>
                            <div className="text-4xl font-black text-[#282d32] mb-8">¥50k<span className="text-base text-slate-300 ml-2">+</span></div>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                質は安定しますが、多額の固定費がかかり、店独自の個性が薄れがちです。
                            </p>
                        </div>

                        <div className="bg-[#1823ff] rounded-[40px] p-10 flex flex-col items-start shadow-2xl shadow-[#1823ff]/20">
                            <span className="text-[10px] font-black text-white/50 uppercase mb-6 tracking-widest">MisePo AI</span>
                            <div className="text-4xl font-black text-white mb-8">¥1,980<span className="text-base text-white/50 ml-2">/mo</span></div>
                            <p className="text-lg font-bold text-white/80 leading-tight">
                                圧倒的な低コストで、あなたの人格を100%継承。24時間365日、理想の言葉を発信します。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className="py-24 md:py-48 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1 items-start text-left">
                            <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10 inline-block">Plan Details</span>
                            <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.9] mb-12 ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'}`}>
                                SIMPLE<br />
                                <span className="text-[#1823ff]">PRICING.</span>
                            </h2>
                            <p className="text-xl md:text-2xl font-bold text-slate-400 leading-tight mb-12">
                                お店の成長に必要なすべてを。
                                追加料金なしのワンプランで、全機能を解放します。
                            </p>

                            <div className="space-y-4">
                                {["AI投稿生成 (300回/月)", "SNS / Google 全対応", "口コミ返信 AI自動生成", "お手本学習 (分身機能)"].map((f, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#1823ff]/5 flex items-center justify-center text-[#1823ff]"><Icons.Check size={14} /></div>
                                        <span className="text-lg font-bold text-slate-600">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-lg">
                            <div className="bg-[#282d32] rounded-[48px] p-10 md:p-16 text-white text-center shadow-2xl shadow-[#282d32]/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-20 bg-[#1823ff]/20 rounded-full blur-[80px] -z-10" />

                                <div className="flex justify-center mb-10">
                                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                                        <button onClick={() => setIsYearly(false)} className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${!isYearly ? 'bg-white text-[#282d32]' : 'text-white/50'}`}>MONTHLY</button>
                                        <button onClick={() => setIsYearly(true)} className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${isYearly ? 'bg-white text-[#282d32]' : 'text-white/50'}`}>YEARLY</button>
                                    </div>
                                </div>

                                <div className="text-[12rem] font-black tracking-tighter leading-none mb-4 absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                                    {isYearly ? 'ANNUAL' : 'PRO'}
                                </div>

                                <h3 className="text-2xl font-black text-[#1823ff] mb-6 uppercase tracking-[0.2em]">{isYearly ? 'Yearly Pro' : 'Monthly Pro'}</h3>
                                <div className="text-7xl md:text-8xl font-black tracking-tighter mb-4">
                                    {isYearly ? '¥19,800' : '¥1,980'}
                                </div>
                                <p className="text-xs font-bold text-slate-400 mb-12 uppercase tracking-widest">
                                    {isYearly ? 'Equivalent to ¥1,650/month' : '300 Generations per month'}
                                </p>

                                <button onClick={() => window.location.href = '/start'} className="w-full py-6 bg-[#1823ff] text-white font-black rounded-full shadow-2xl shadow-[#1823ff]/30 hover:scale-[1.02] transition-all text-xl">
                                    7日間無料で始める
                                </button>

                                <div className="mt-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    *Cancel anytime during trial
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
