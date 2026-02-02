"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

export const ReviewResponseSection = () => {
    return (
        <section className="py-24 md:py-32 bg-gradient-to-br from-[#FF9F1C]/5 via-white to-[#FF9F1C]/10 relative overflow-hidden">
            <NoiseOverlay />

            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#FF9F1C]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1823ff]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div className="order-2 md:order-1">
                        <span className="text-[10px] font-black text-[#FF9F1C] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#FF9F1C]/5 rounded-full border border-[#FF9F1C]/10 inline-block">
                            Review Response AI
                        </span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-[#282d32] mb-8">
                            口コミ返信も、<br />
                            <span className="text-[#FF9F1C]">AIにおまかせ。</span>
                        </h2>
                        <p className="text-xl md:text-2xl font-bold text-slate-400 leading-tight mb-12">
                            「何て返せばいいか分からない」を解消。<br />
                            誠実で温かい返信文を、AIが数秒で下書きします。
                        </p>

                        {/* Benefits List */}
                        <div className="space-y-6">
                            {[
                                { icon: "Clock", text: "返信時間を90%削減" },
                                { icon: "ShieldCheck", text: "炎上リスクを回避する言葉選び" },
                                { icon: "TrendingUp", text: "MEO対策で検索順位アップ" }
                            ].map((item, idx) => {
                                const IconComponent = Icons[item.icon];
                                return (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FF9F1C]/10 flex items-center justify-center shrink-0">
                                            <IconComponent className="text-[#FF9F1C]" size={20} />
                                        </div>
                                        <span className="text-lg font-black text-[#282d32]">{item.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Visual Mock */}
                    <div className="order-1 md:order-2 relative">
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-900/10 border border-slate-100">
                            {/* Google Maps Review Card Mock */}
                            <div className="space-y-6">
                                {/* Review Header */}
                                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                                    <div className="w-12 h-12 rounded-full bg-slate-200" />
                                    <div className="flex-1">
                                        <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Icons.Star key={i} size={16} fill="#FFB800" className="text-[#FFB800]" />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-slate-100 rounded" />
                                    <div className="h-3 w-5/6 bg-slate-100 rounded" />
                                    <div className="h-3 w-4/6 bg-slate-100 rounded" />
                                </div>

                                {/* AI Response */}
                                <div className="bg-gradient-to-br from-[#FF9F1C]/5 to-[#FF9F1C]/10 rounded-2xl p-6 border-2 border-[#FF9F1C]/20 relative">
                                    <div className="absolute -top-3 left-6 px-3 py-1 bg-[#FF9F1C] text-white text-[10px] font-black rounded-full flex items-center gap-1">
                                        <Icons.Sparkles size={10} />
                                        AI下書き
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <div className="h-3 w-full bg-[#FF9F1C]/20 rounded" />
                                        <div className="h-3 w-full bg-[#FF9F1C]/20 rounded" />
                                        <div className="h-3 w-3/4 bg-[#FF9F1C]/20 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
