"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className="py-20 md:py-32 bg-white relative overflow-hidden">
                {/* Background Decor Removed */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-1.5 bg-white border border-[#E88BA3]/20 rounded-full text-[#E88BA3] text-sm font-bold tracking-widest shadow-sm mb-6">
                            COST PERFORMANCE
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
                            納得できる「質」と、<br className="hidden md:block" />
                            <span className="relative inline-block px-2">
                                <span className="absolute inset-0 bg-[#F5CC6D]/30 -skew-y-2 rounded-lg -z-10" />
                                使い続けたい「コスト」
                            </span>
                            の正解。
                        </h2>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
                            「自分でやる」のは限界。「業者に頼む」のは高すぎる。<br />
                            MisePoは、あなたのための第3の選択肢です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-center transition-all duration-300 flex flex-col hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
                            <h3 className="text-lg font-bold text-slate-400 mb-6">自力・スタッフ負担</h3>
                            <div className="text-5xl font-bold text-slate-300 mb-2">¥0</div>
                            <p className="text-xs text-slate-400 font-bold mb-10 tracking-widest">（精神的負担・コストは大）</p>
                            <ul className="space-y-4 text-sm font-medium text-slate-400 text-left mt-auto">
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> 閉店後の作業が辛い</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> 文才に自信がない</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> 投稿が続かない</li>
                            </ul>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-center transition-all duration-300 flex flex-col hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[10px] px-3 py-1 font-bold rounded-full">一般的</div>
                            <h3 className="text-lg font-bold text-slate-400 mb-6">制作会社・外注</h3>
                            <div className="text-5xl font-bold text-slate-300 mb-2">¥50k<span className="text-xl opacity-50 ml-1">+</span></div>
                            <p className="text-xs text-slate-400 font-bold mb-10 tracking-widest">/ 月（高コスト）</p>
                            <ul className="space-y-4 text-sm font-medium text-slate-400 text-left mt-auto">
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> コストが高すぎる</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> 確認のやり取りが面倒</li>
                                <li className="flex gap-3"><Icons.X size={18} className="shrink-0 opacity-50" /> "お店らしさ"が出ない</li>
                            </ul>
                        </div>

                        <div className="bg-white border-2 border-[#E88BA3]/20 rounded-[32px] p-10 text-center shadow-2xl shadow-[#E88BA3]/10 relative transform md:-translate-y-6 z-10 flex flex-col hover:-translate-y-8 transition-all duration-300">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#E88BA3] text-white text-xs font-bold px-6 py-2 rounded-full shadow-lg shadow-[#E88BA3]/30 tracking-widest">
                                ミセポの正解
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 mt-2">MisePo (AI)</h3>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-5xl md:text-6xl font-bold text-slate-800 tracking-tight">¥1,980</span>
                            </div>
                            <p className="text-sm text-[#E88BA3] font-bold tracking-widest mb-10">1ヶ月 300クレジット</p>
                            <ul className="space-y-4 text-sm font-bold text-slate-600 text-left bg-slate-50 rounded-2xl p-6 mt-auto">
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#4DB39A] shrink-0" /> <span>圧倒的なコスパ</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#4DB39A] shrink-0" /> <span>爆速生成・自由編集</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle size={20} className="text-[#4DB39A] shrink-0" /> <span>あなたの「書き癖」を学習</span></li>
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
                            <span className="inline-block px-4 py-2 bg-[#F5CC6D]/20 text-[#D4A017] rounded-full text-xs font-bold tracking-widest mb-6 border border-[#F5CC6D]/30">シンプルな料金プラン</span>
                            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
                                お店の成長に<br />
                                <span className="text-[#E88BA3]">必要なすべてを。</span>
                            </h2>
                            <p className="text-slate-500 font-medium text-lg mb-12 leading-relaxed">
                                追加料金なしで、プロフェッショナルな機能を好きなだけ。<br />
                                複雑なオプション料金はありません。
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-sm group-hover:bg-[#F9F7F2] group-hover:scale-110 transition-all shrink-0">
                                        <Icons.Sparkles size={28} className="text-[#F5CC6D]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-xl mb-1">AI投稿生成 300回/月</h3>
                                        <p className="text-slate-500 text-sm">納得いくまでバリエーションを作れます。</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-sm group-hover:bg-[#F9F7F2] group-hover:scale-110 transition-all shrink-0">
                                        <Icons.Instagram size={28} className="text-[#E88BA3]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-xl mb-1">全プラットフォーム対応</h3>
                                        <p className="text-slate-500 text-sm">Instagram, X, Googleマップすべてに対応。</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-sm group-hover:bg-[#F9F7F2] group-hover:scale-110 transition-all shrink-0">
                                        <Icons.MessageCircle size={28} className="text-[#4DB39A]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-xl mb-1">多言語 & 口コミ返信</h3>
                                        <p className="text-slate-500 text-sm">インバウンド対応も、丁寧な返信もお任せください。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[40px] p-8 md:p-12 flex flex-col bg-slate-900 text-white shadow-2xl shadow-slate-900/20 overflow-hidden group border border-slate-800">
                            <div className="absolute top-0 right-0 p-32 bg-white opacity-0 blur-[100px] rounded-full pointer-events-none" />
                            <div className="relative z-10 text-center mb-12">
                                <div className="flex justify-center items-center gap-6 mb-10 bg-white/5 inline-flex mx-auto p-1.5 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setIsYearly(false)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isYearly ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setIsYearly(true)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50 hover:text-white'}`}
                                    >
                                        Yearly
                                        <span className="bg-[#E88BA3] text-white text-[10px] px-2 py-0.5 rounded-full">お得!</span>
                                    </button>
                                </div>

                                <h3 className="text-2xl font-bold mb-6 text-[#F5CC6D] tracking-wide">
                                    {isYearly ? '年間プロプラン' : '月間プロプラン'}
                                </h3>
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl md:text-7xl font-bold tracking-tight">
                                            {isYearly ? '¥19,800' : '¥1,980'}
                                        </span>
                                        <span className="text-white/50 font-medium text-xl">
                                            /{isYearly ? '年' : '月'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-[#4DB39A] tracking-wider mb-2">
                                    月間300回まで生成可能
                                </p>
                            </div>

                            <div className="h-[1px] w-full bg-white/10 mb-10" />

                            <ul className="space-y-6 mb-12 text-left relative z-10 px-4">
                                {[
                                    "AI投稿生成 (300回/月)",
                                    "Instagram / X / Google 全対応",
                                    "口コミ返信 AI自動生成",
                                    "お手本学習 (分身機能)",
                                    "多言語翻訳 (英・中・韓)",
                                    "マルチデバイス対応 (PC/スマホ/タブ)"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-4 group/item">
                                        <div className="w-6 h-6 bg-[#4DB39A]/20 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-[#4DB39A] transition-colors">
                                            <Icons.Check size={14} className="text-[#4DB39A] group-hover/item:text-white transition-colors" />
                                        </div>
                                        <span className="font-medium text-slate-200 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => window.location.href = `/start?plan=${isYearly ? 'yearly' : 'monthly'}`} className="w-full py-5 bg-gradient-to-r from-[#F5CC6D] to-[#F2994A] text-white font-bold text-xl rounded-2xl shadow-lg shadow-[#F5CC6D]/30 hover:shadow-[#F5CC6D]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                <span className="relative z-10 flex items-center gap-2">7日間無料で始める <Icons.ChevronUp className="rotate-90 stroke-[3px]" size={20} /></span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <p className="text-center text-[10px] text-white/40 font-medium leading-relaxed">
                                    ✓ 7日間の無料体験（Googleログインで即開始 / 1日10回まで）<br />
                                    ※体験終了後、継続する場合のみ月額 ¥1,980 が適用されます。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
