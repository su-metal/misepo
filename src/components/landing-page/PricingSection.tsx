"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className="py-24 md:py-48 bg-[#f0eae4] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-start mb-24">
                        <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">Cost Performance</span>
                        <h2 className={`font-black tracking-tighter leading-[0.9] text-[#282d32] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                            より高い、<br />
                            <span className="text-[#1823ff]">価値を。</span>
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
                            <div className="text-4xl font-black text-white mb-8">¥980<span className="text-base text-white/50 ml-2">〜 /mo</span></div>
                            <p className="text-lg font-bold text-white/80 leading-tight">
                                圧倒的な低コストで、あなたの人格を100%継承。24時間365日、理想の言葉を発信します。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className="py-24 md:py-48 bg-[#f0eae4] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center mb-24">
                        <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10 inline-block">Plan Details</span>
                        <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.9] mb-8 ${isMobile ? 'text-6xl' : 'text-8xl md:text-9xl'}`}>
                            シンプルな、<br />
                            <span className="text-[#1823ff]">料金プラン。</span>
                        </h2>
                        <p className="text-xl md:text-3xl font-bold text-slate-400 leading-tight max-w-3xl">
                            お店の成長に必要なすべてを。<br className="hidden md:block" />
                            追加料金なしで、全機能を解放します。
                        </p>
                    </div>

                    <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
                        {[
                            { name: "Entry", price: "980", credits: "50", popular: false, desc: "まずは手軽に始めたい方に" },
                            { name: "Standard", price: "1,980", credits: "150", popular: true, desc: "一番人気のスタンダードプラン" },
                            { name: "Professional", price: "2,980", credits: "300", popular: false, desc: "複数媒体を本格運用する方に" }
                        ].map((plan, idx) => (
                            <div key={idx} className={`relative flex flex-col p-10 md:p-12 rounded-[48px] transition-all duration-500 hover:scale-[1.02] ${plan.popular ? 'bg-[#282d32] text-white shadow-3xl shadow-slate-900/20' : 'bg-white text-[#282d32] border border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                                {plan.popular && (
                                    <div className="absolute top-8 right-8 bg-[#1823ff] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest animate-pulse">Recommended</div>
                                )}

                                <div className="mb-8">
                                    <h3 className={`text-xl font-black uppercase tracking-[0.2em] mb-2 ${plan.popular ? 'text-[#1823ff]' : 'text-slate-300'}`}>{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl md:text-5xl font-black tracking-tighter">¥{plan.price}</span>
                                        <span className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-300'}`}>/月</span>
                                    </div>
                                    <p className={`text-sm font-bold mt-4 ${plan.popular ? 'text-slate-400' : 'text-slate-300'}`}>{plan.desc}</p>
                                </div>

                                <div className="flex-1 space-y-6 mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-white/10 text-white' : 'bg-[#1823ff]/5 text-[#1823ff]'}`}><Icons.Sparkles size={16} /></div>
                                        <div>
                                            <div className="text-base font-black">AI投稿生成</div>
                                            <div className={`text-sm font-bold ${plan.popular ? 'text-slate-400' : 'text-slate-300'}`}>{plan.credits}回 / 月</div>
                                        </div>
                                    </div>
                                    {["SNS / Google 全対応", "口コミ返信 AI自動生成", "お手本学習 (分身機能)"].map((f, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-white/10 text-white' : 'bg-[#1823ff]/5 text-[#1823ff]'}`}><Icons.Check size={16} /></div>
                                            <span className={`text-base font-bold ${plan.popular ? 'text-white/90' : 'text-slate-600'}`}>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => window.location.href = '/start'} className={`w-full py-5 font-black rounded-full transition-all text-lg ${plan.popular ? 'bg-[#1823ff] text-white shadow-2xl shadow-[#1823ff]/30 hover:bg-[#2531ff]' : 'bg-[#282d32] text-white hover:bg-slate-700'}`}>
                                    無料で始める
                                </button>

                                {plan.popular && (
                                    <div className="absolute inset-0 bg-[#1823ff]/5 rounded-[48px] pointer-events-none" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};
