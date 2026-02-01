"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className={`${isMobile ? 'py-12' : 'py-20 md:py-32'} bg-white relative overflow-hidden`}>
                <div className={`${isMobile ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                    <div className={`${isMobile ? 'mb-12' : 'mb-20'} text-center`}>
                        <span className="inline-block px-4 py-1.5 bg-white border border-[var(--ichizen-blue)]/20 rounded-full text-[var(--ichizen-blue)] text-sm font-bold tracking-widest shadow-sm mb-6">
                            COST PERFORMANCE
                        </span>
                        <h2 className={`font-bold text-slate-800 leading-tight ${isMobile ? 'text-2xl mb-4' : 'text-4xl md:text-6xl mb-8'}`}>
                            納得できる「質」と、<br className={isMobile ? '' : 'hidden md:block'} />
                            <span className="relative inline-block px-1">
                                <span className="absolute inset-x-0 bottom-1 h-3 bg-[var(--ichizen-green)]/30 -skew-y-1 -z-10" />
                                使い続けたい「コスト」
                            </span>
                            の正解。
                        </h2>
                        <p className={`text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed ${isMobile ? 'text-xs px-2' : 'text-lg'}`}>
                            「自分でやる」のは限界。「業者に頼む」のは高すぎる。<br />
                            MisePoは、あなたのための第3の選択肢です。
                        </p>
                    </div>

                    <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3 max-w-6xl mx-auto items-stretch'}`}>
                        <div className={`bg-slate-50 border border-slate-100 rounded-[32px] text-center transition-all duration-300 flex flex-col ${isMobile ? 'p-6' : 'p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1'}`}>
                            <h3 className="text-sm font-bold text-slate-400 mb-4">自力・スタッフ負担</h3>
                            <div className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-slate-300 mb-2`}>¥0</div>
                            <p className="text-[10px] text-slate-400 font-bold mb-6 tracking-widest">（負担は最大）</p>
                            <ul className="space-y-3 text-[10px] font-medium text-slate-400 text-left mt-auto">
                                <li className="flex gap-2"><Icons.X size={14} className="shrink-0 opacity-50" /> 閉店後の作業が辛い</li>
                                <li className="flex gap-2"><Icons.X size={14} className="shrink-0 opacity-50" /> 文才に自信がない</li>
                            </ul>
                        </div>

                        <div className={`bg-slate-50 border border-slate-100 rounded-[32px] text-center transition-all duration-300 flex flex-col relative overflow-hidden ${isMobile ? 'p-6' : 'p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1'}`}>
                            <div className="absolute top-4 right-4 bg-slate-200 text-slate-500 text-[8px] px-2 py-0.5 font-bold rounded-full">一般的</div>
                            <h3 className="text-sm font-bold text-slate-400 mb-4">制作会社・外注</h3>
                            <div className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold text-slate-300 mb-2`}>¥50k<span className="text-sm opacity-50 ml-1">+</span></div>
                            <p className="text-[10px] text-slate-400 font-bold mb-6 tracking-widest">/ 月（高コスト）</p>
                            <ul className="space-y-3 text-[10px] font-medium text-slate-400 text-left mt-auto">
                                <li className="flex gap-2"><Icons.X size={14} className="shrink-0 opacity-50" /> コストが高すぎる</li>
                                <li className="flex gap-2"><Icons.X size={14} className="shrink-0 opacity-50" /> 独自性が出ない</li>
                            </ul>
                        </div>

                        <div className={`bg-white border-2 border-[var(--ichizen-blue)]/20 rounded-[32px] text-center shadow-2xl shadow-[var(--ichizen-blue)]/10 relative z-10 flex flex-col transition-all duration-300 ${isMobile ? 'p-8 mt-4' : 'p-10 transform md:-translate-y-6 hover:-translate-y-8'}`}>
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--ichizen-blue)] text-white text-[10px] font-bold px-6 py-2 rounded-full shadow-lg tracking-widest">
                                ミセポの正解
                            </div>
                            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-slate-800 mb-4 mt-2`}>MisePo (AI)</h3>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-bold text-slate-800 tracking-tight`}>¥1,980</span>
                            </div>
                            <p className="text-[10px] text-[var(--ichizen-blue)] font-bold tracking-widest mb-8">1ヶ月 300クレジット</p>
                            <ul className="space-y-3 text-xs font-bold text-slate-600 text-left bg-slate-50 rounded-2xl p-5 mt-auto">
                                <li className="flex gap-2 items-start"><Icons.CheckCircle size={16} className="text-[var(--ichizen-green)] shrink-0" /> <span>圧倒的なコスパ</span></li>
                                <li className="flex gap-2 items-start"><Icons.CheckCircle size={16} className="text-[var(--ichizen-green)] shrink-0" /> <span>あなたの書き癖を学習</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className={`${isMobile ? 'py-12' : 'py-20 md:py-32'} bg-white`}>
                <div className={`${isMobile ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                    <div className={`grid gap-12 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2 lg:gap-24 items-center'}`}>
                        <div className="text-left">
                            <span className={`inline-block px-4 py-2 bg-[var(--ichizen-blue)]/10 text-[var(--ichizen-blue)] rounded-full text-[10px] font-bold tracking-widest border border-[var(--ichizen-blue)]/30 ${isMobile ? 'mb-4' : 'mb-6'}`}>シンプルな料金プラン</span>
                            <h2 className={`font-bold text-slate-800 leading-tight ${isMobile ? 'text-2xl mb-4' : 'text-4xl md:text-6xl mb-8'}`}>
                                お店の成長に<br />
                                <span className="text-[var(--ichizen-blue)]">必要なすべてを。</span>
                            </h2>
                            <p className={`text-slate-500 font-medium leading-relaxed ${isMobile ? 'text-xs mb-8' : 'text-lg mb-12'}`}>
                                追加料金なしで、プロフェッショナルな機能を好きなだけ。<br />
                                複雑なオプション料金はありません。
                            </p>

                            <div className={`space-y-6 ${isMobile ? 'mb-8' : ''}`}>
                                <div className="flex gap-4 group">
                                    <div className={`bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-sm transition-all shrink-0 ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}`}>
                                        <Icons.Sparkles size={isMobile ? 20 : 28} className="text-[#F5CC6D]" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-slate-800 mb-0.5 ${isMobile ? 'text-base' : 'text-xl'}`}>AI投稿生成 300回/月</h3>
                                        <p className="text-slate-500 text-[10px]">納得いくまでバリエーションを作れます。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className={`bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800 shadow-sm transition-all shrink-0 ${isMobile ? 'w-10 h-10' : 'w-14 h-14'}`}>
                                        <Icons.Instagram size={isMobile ? 20 : 28} className="text-[var(--ichizen-blue)]" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-slate-800 mb-0.5 ${isMobile ? 'text-base' : 'text-xl'}`}>全プラットフォーム対応</h3>
                                        <p className="text-slate-500 text-[10px]">SNS, Googleマップすべてに対応。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`relative rounded-[32px] flex flex-col bg-slate-900 text-white shadow-2xl overflow-hidden group border border-slate-800 ${isMobile ? 'p-8' : 'p-12'}`}>
                            <div className="relative z-10 text-center mb-10">
                                <div className="flex justify-center items-center gap-4 mb-8 bg-white/5 inline-flex mx-auto p-1 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setIsYearly(false)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${!isYearly ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setIsYearly(true)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-2 ${isYearly ? 'bg-white text-slate-900 shadow-lg' : 'text-white/50'}`}
                                    >
                                        Yearly
                                        <span className="bg-[var(--ichizen-blue)] text-white text-[8px] px-1.5 py-0.5 rounded-full">お得!</span>
                                    </button>
                                </div>

                                <h3 className={`font-bold mb-4 text-[#F5CC6D] tracking-wide ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                                    {isYearly ? '年間プロプラン' : '月間プロプラン'}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className={`font-bold tracking-tight ${isMobile ? 'text-4xl' : 'text-6xl'}`}>
                                            {isYearly ? '¥19,800' : '¥1,980'}
                                        </span>
                                        <span className="text-white/50 font-medium text-sm">
                                            /{isYearly ? '年' : '月'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-medium text-[var(--ichizen-green)] tracking-wider">
                                    月間300回まで生成可能
                                </p>
                            </div>

                            <div className="h-[1px] w-full bg-white/10 mb-8" />

                            <ul className="space-y-4 mb-10 text-left relative z-10">
                                {[
                                    "AI投稿生成 (300回/月)",
                                    "SNS / Google 全対応",
                                    "口コミ返信 AI自動生成",
                                    "お手本学習 (分身機能)",
                                    "多言語翻訳 (英・中・韓)",
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-[var(--ichizen-green)]/20 rounded-full flex items-center justify-center shrink-0">
                                            <Icons.Check size={12} className="text-[var(--ichizen-green)]" />
                                        </div>
                                        <span className="font-medium text-slate-200 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => window.location.href = `/start?plan=${isYearly ? 'yearly' : 'monthly'}`} className={`w-full py-4 bg-gradient-to-r from-[#F5CC6D] to-[#F2994A] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden group ${isMobile ? 'text-base' : 'text-xl'}`}>
                                <span className="relative z-10 flex items-center gap-2">7日間無料で始める</span>
                            </button>
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-center text-[8px] text-white/40 font-medium leading-relaxed">
                                    ✓ 7日間の無料体験（即開始）<br />
                                    ※継続する場合のみ月額適用。
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
