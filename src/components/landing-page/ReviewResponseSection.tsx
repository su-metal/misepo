"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay hidden md:block" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

export const ReviewResponseSection = () => {
    return (
        <section className="py-24 md:py-32 bg-gradient-to-br from-[#1823ff]/5 via-white to-[#1823ff]/10 relative overflow-hidden">
            <NoiseOverlay />

            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#1823ff]/10 rounded-full blur-[120px] pointer-events-none hidden md:block" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1823ff]/5 rounded-full blur-[100px] pointer-events-none hidden md:block" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-[#282d32] mb-8">
                            <span className="block text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10 w-fit normal-case" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                                Google口コミ返信をAIが自動生成 — 返信時間90%削減
                            </span>
                            口コミ返信も、<br />
                            <span className="text-gradient-primary">AIにおまかせ。</span>
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
                                        <div className="w-12 h-12 rounded-2xl bg-[#1823ff]/10 flex items-center justify-center shrink-0">
                                            <IconComponent className="text-[#1823ff]" size={20} />
                                        </div>
                                        <span className="text-lg font-black text-[#282d32]">{item.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Before / After 実例 */}
                    <div className="order-1 md:order-2 relative space-y-6">
                        {/* Before: 受け取った★2口コミ */}
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-400">T.K</div>
                                <div>
                                    <p className="text-sm font-black text-[#282d32]">T. Kobayashi</p>
                                    <div className="flex gap-0.5 mt-0.5">
                                        {[...Array(2)].map((_, i) => (
                                            <Icons.Star key={i} size={12} fill="#FFB800" className="text-[#FFB800]" />
                                        ))}
                                        {[...Array(3)].map((_, i) => (
                                            <Icons.Star key={i + 2} size={12} fill="none" className="text-slate-300" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed">
                                「待ち時間が長く、スタッフの対応も少し冷たい印象でした。また行くかどうか迷っています。」
                            </p>
                        </div>

                        {/* After: AI生成返信 */}
                        <div className="bg-gradient-to-br from-[#1823ff]/5 to-[#1823ff]/10 rounded-[2rem] p-6 border-2 border-[#1823ff]/20 relative">
                            <div className="absolute -top-3 left-6 px-3 py-1 bg-[#1823ff] text-white text-[10px] font-black rounded-full flex items-center gap-2">
                                <Icons.Sparkles size={10} />
                                MisePo AI返信 — 生成時間: 約8秒
                            </div>
                            <p className="text-sm font-bold text-[#282d32] leading-relaxed mt-2">
                                この度はご来店いただきありがとうございます。お待ちいただいた上に、スタッフの対応でもご不満をおかけしてしまい、誠に申し訳ございませんでした。いただいたご意見をスタッフ全員で共有し、お待たせしない案内とより温かい接客を徹底してまいります。またの機会がございましたら、ぜひ再度お越しいただければ幸いです。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
