"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = () => {
    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className="py-20 md:py-32 bg-[#f9f5f2] border-b-[6px] border-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-6xl font-black text-black mb-10 tracking-tight italic uppercase">
                            賢い店主は、<br />
                            <span className="bg-[#E5C58C] px-4 py-2 border-[4px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl inline-block mt-4 -rotate-1">「コスト」と「質」</span>で選んでいます。
                        </h2>
                        <p className="text-black font-bold text-xl max-w-2xl mx-auto opacity-70">
                            「自分でやる」のは限界。「業者に頼む」のは高すぎる。<br />
                            MisePoは、第3の選択肢です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto items-stretch">
                        <div className="bg-white border-[4px] border-black rounded-2xl p-8 text-center opacity-60 scale-95 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-100 transition-all duration-300 flex flex-col">
                            <h3 className="text-xl font-black text-black opacity-40 mb-6 uppercase italic">Staff / Self</h3>
                            <div className="text-5xl font-black text-black opacity-30 mb-2 italic">¥0</div>
                            <p className="text-xs text-black font-black opacity-30 mb-10 uppercase tracking-widest">(But high mental cost)</p>
                            <ul className="space-y-4 text-sm font-bold text-black opacity-40 text-left mt-auto">
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> 閉店後の作業が辛い</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> 文才に自信がない</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> 投稿が続かない</li>
                            </ul>
                        </div>

                        <div className="bg-white border-[4px] border-black rounded-2xl p-8 text-center opacity-60 scale-95 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-100 transition-all duration-300 relative flex flex-col">
                            <div className="absolute -top-3 -right-3 bg-black text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest italic border-[2px] border-white rounded-2xl z-10">Standard</div>
                            <h3 className="text-xl font-black text-black opacity-40 mb-6 uppercase italic">Outsourcing</h3>
                            <div className="text-5xl font-black text-black opacity-30 mb-2 italic">¥50,000<span className="text-xl font-black opacity-50 ml-1">+</span></div>
                            <p className="text-xs text-black font-black opacity-30 mb-10 uppercase tracking-widest">/ MONTH (Premium Price)</p>
                            <ul className="space-y-4 text-sm font-bold text-black opacity-40 text-left mt-auto">
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> コストが高すぎる</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> 確認のやり取りが面倒</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0" /> "お店らしさ"が出ない</li>
                            </ul>
                        </div>

                        <div className="bg-white border-[6px] border-black rounded-2xl p-10 text-center shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative transform md:-translate-y-6 z-10 flex flex-col hover:translate-x-[-4px] hover:translate-y-[-10px] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#D4849A] text-white text-xs font-black px-6 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl uppercase tracking-[0.2em] whitespace-nowrap -rotate-2">
                                Best Choice
                            </div>
                            <h3 className="text-2xl font-black text-black mb-6 mt-4 uppercase italic">MisePo (AI)</h3>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <span className="text-black opacity-20 line-through font-black text-xl italic">¥2,980</span>
                                <span className="text-5xl md:text-6xl font-black text-black italic">¥1,480</span>
                            </div>
                            <p className="text-sm text-[#D4849A] font-black uppercase tracking-widest mb-10 italic">Only ¥49 / Day</p>
                            <ul className="space-y-4 text-sm font-black text-black text-left bg-black/[0.03] border-[2px] border-dashed border-black/20 p-6 mt-auto">
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#88B0A5] shrink-0" /> <span className="uppercase">Cost Performance No.1</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#88B0A5] shrink-0" /> <span className="uppercase">Instant Gen / Edit</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#88B0A5] shrink-0" /> <span className="uppercase">Your Style & Voice</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className="py-20 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="text-left">
                            <span className="inline-block px-4 py-2 bg-[#E5C58C] text-black border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl text-xs font-black uppercase tracking-widest mb-6 -rotate-1">Simple Pricing</span>
                            <h2 className="text-4xl md:text-6xl font-black text-black mb-8 leading-tight italic uppercase">
                                お店の成長に<br />
                                <span className="underline decoration-[6px] decoration-[#D4849A]">必要なすべてを。</span>
                            </h2>
                            <p className="text-black font-bold text-lg mb-12 leading-relaxed opacity-70">
                                追加料金なしで、プロフェッショナルな機能を好きなだけ。<br />
                                複雑なオプション料金はありません。
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-black border-[3px] border-black rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] shrink-0">
                                        <Icons.Sparkles size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-black text-xl mb-1 uppercase tracking-tight">AI投稿生成 無制限</h3>
                                        <p className="text-black font-bold opacity-50">納得いくまで何度でも作り直せます。</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-[#D4849A] border-[3px] border-black rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] shrink-0">
                                        <Icons.Instagram size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-black text-xl mb-1 uppercase tracking-tight">全プラットフォーム対応</h3>
                                        <p className="text-black font-bold opacity-50">Instagram, X, Googleマップすべてに対応。</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-14 h-14 bg-[#88B0A5] border-[3px] border-black rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] shrink-0">
                                        <Icons.MessageCircle size={28} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-black text-xl mb-1 uppercase tracking-tight">多言語 & 口コミ返信</h3>
                                        <p className="text-black font-bold opacity-50">インバウンド対応も、丁寧な返信もお任せください。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative border-[6px] border-black rounded-2xl p-8 md:p-12 flex flex-col bg-black text-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden group">
                            <div className="relative z-10 text-center mb-12">
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#D4849A] text-white text-sm font-black border-[3px] border-white rounded-2xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] mb-10 animate-pulse uppercase tracking-[0.2em] italic">
                                    <Icons.Sparkles size={18} fill="currentColor" />
                                    Limited Monitor Price
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-[#E5C58C] uppercase italic tracking-[0.1em]">Pro Plan</h3>
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <span className="text-white/30 line-through font-black text-2xl italic">¥2,980</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl md:text-7xl font-black tracking-tighter italic">¥1,480</span>
                                        <span className="text-white/50 font-black text-xl italic">/mo</span>
                                    </div>
                                </div>
                                <p className="text-sm font-black text-[#88B0A5] uppercase tracking-[0.3em] mb-2">
                                    ONLY ¥49 PER DAY
                                </p>
                            </div>

                            <div className="h-[4px] w-full bg-white/10 mb-10" />

                            <ul className="space-y-6 mb-12 text-left relative z-10">
                                {[
                                    "AI投稿生成 (無制限)",
                                    "Instagram / X / Google 全対応",
                                    "3パターン同時提案",
                                    "書き癖学習 (分身機能)",
                                    "多言語翻訳 (英・中・韓)",
                                    "チャットサポート"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-[#88B0A5] border-[2px] border-white rounded-2xl flex items-center justify-center shrink-0">
                                            <Icons.Check size={14} className="text-white stroke-[4px]" />
                                        </div>
                                        <span className="font-black text-white text-lg uppercase tracking-tight">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => window.location.href = '/start'} className="w-full py-6 bg-[#E5C58C] text-black font-black text-2xl uppercase italic border-[4px] border-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-3">
                                Start Your AI <Icons.ChevronUp className="rotate-90 stroke-[4px]" size={24} />
                            </button>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-center text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-widest">
                                    ✓ 7-day free trial (Requires credit card registration)<br />
                                    ※ Auto-renews at ¥1,480/mo. Cancel anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
