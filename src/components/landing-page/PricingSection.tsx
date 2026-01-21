"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PricingSection = () => {
    return (
        <>
            {/* Comparison (Cost Performance) */}
            <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            賢い店主は、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">「コスト」と「質」で<br className="md:hidden" />選んでいます。</span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            「自分でやる」のは限界。<br className="md:hidden" />「業者に頼む」のは高すぎる。<br />
                            MisePoは、第3の選択肢です。
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 text-center opacity-70 scale-95 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-100 transition-all duration-300">
                            <h3 className="text-xl font-bold text-slate-600 mb-4">自分・スタッフ</h3>
                            <div className="text-4xl font-black text-slate-400 mb-2">¥0</div>
                            <p className="text-sm text-slate-400 mb-8">（ただし、残業代・疲労）</p>
                            <ul className="space-y-4 text-sm text-slate-500 text-left">
                                <li className="flex gap-2"><Icons.X className="text-slate-300" /> 閉店後の作業が辛い</li>
                                <li className="flex gap-2"><Icons.X className="text-slate-300" /> 文才に自信がない</li>
                                <li className="flex gap-2"><Icons.X className="text-slate-300" /> 投稿が続かない</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 text-center opacity-70 scale-95 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-100 transition-all duration-300 relative">
                            <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-bl-xl rounded-tr-2xl font-bold">一般的</div>
                            <h3 className="text-xl font-bold text-slate-600 mb-4">SNS運用代行</h3>
                            <div className="text-4xl font-black text-slate-900 mb-2">¥50,000<span className="text-sm font-normal text-slate-400 ml-1">~</span></div>
                            <p className="text-sm text-slate-400 mb-8">/月 （非常に高額）</p>
                            <ul className="space-y-4 text-sm text-slate-500 text-left">
                                <li className="flex gap-2"><Icons.X className="text-red-400" /> コストが高すぎる</li>
                                <li className="flex gap-2"><Icons.X className="text-red-400" /> 確認のやり取りが面倒</li>
                                <li className="flex gap-2"><Icons.X className="text-red-400" /> "お店らしさ"が出ない</li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border-2 border-indigo-500 text-center shadow-2xl shadow-indigo-200 relative transform md:-translate-y-4 z-10">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                                コスパ最強の第3の選択
                            </div>
                            <h3 className="text-2xl font-bold text-indigo-900 mb-4 mt-2">MisePo (分身AI)</h3>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-gray-400 line-through font-bold text-lg">¥2,980</span>
                                <span className="text-4xl md:text-5xl font-black text-slate-900">¥1,480</span>
                            </div>
                            <p className="text-sm text-indigo-600 font-bold mb-8">1日あたり49円</p>
                            <ul className="space-y-4 text-sm text-slate-700 text-left bg-indigo-50 rounded-2xl p-6">
                                <li className="flex gap-3 items-start"><Icons.CheckCircle className="text-indigo-600 shrink-0" /> <span className="font-bold">圧倒的な低コスト</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle className="text-indigo-600 shrink-0" /> <span className="font-bold">30秒で即完成・修正</span></li>
                                <li className="flex gap-3 items-start"><Icons.CheckCircle className="text-indigo-600 shrink-0" /> <span className="font-bold">あなたの言葉で書ける</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Details */}
            <section id="pricing" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div className="text-left">
                            <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-4 block">Simple Pricing</span>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                                お店の成長に<br />
                                <span className="text-indigo-600">必要なすべてを。</span>
                            </h2>
                            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
                                追加料金なしで、プロフェッショナルな機能を好きなだけ。<br />
                                複雑なオプション料金はありません。
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                        <Icons.Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">AI投稿生成 無制限</h3>
                                        <p className="text-slate-500">納得いくまで何度でも作り直せます。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 shrink-0">
                                        <Icons.Instagram size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">全プラットフォーム対応</h3>
                                        <p className="text-slate-500">Instagram, X, Googleマップすべてに対応。</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                                        <Icons.MessageCircle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-1">多言語 & 口コミ返信</h3>
                                        <p className="text-slate-500">インバウンド対応も、丁寧な返信もお任せください。</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 flex flex-col bg-slate-900 text-white shadow-2xl ring-1 ring-white/20 overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-indigo-600/40 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] -ml-20 -mb-20 group-hover:bg-purple-600/40 transition-colors" />

                            <div className="relative z-10 text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-lg mb-6 animate-pulse">
                                    <Icons.Sparkles size={16} fill="currentColor" />
                                    人数限定 モニター価格
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-indigo-200">Proプラン</h3>
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <span className="text-slate-500 line-through font-bold text-xl decoration-2 decoration-slate-500">¥2,980</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl md:text-6xl font-black tracking-tight">¥1,480</span>
                                        <span className="text-slate-400 font-bold text-lg">/月</span>
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white mb-1">
                                    1日わずか49円。
                                </p>
                                <p className="text-xs text-slate-400">
                                    時給1時間分のコストで、1ヶ月分の心の余裕を。
                                </p>
                            </div>

                            <div className="h-px w-full bg-slate-800 mb-8" />

                            <ul className="space-y-4 mb-10 text-left relative z-10 pl-4">
                                {[
                                    "AI投稿生成 (無制限)",
                                    "Instagram / X / Google 全対応",
                                    "3パターン同時提案",
                                    "書き癖学習 (分身機能)",
                                    "多言語翻訳 (英・中・韓)",
                                    "チャットサポート"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="rounded-full p-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                            <Icons.Check size={16} strokeWidth={3} />
                                        </div>
                                        <span className="font-medium text-slate-200 text-lg">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button onClick={() => window.location.href = '/start'} className="w-full py-5 rounded-2xl font-bold text-xl bg-white text-slate-900 hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] relative z-10 flex items-center justify-center gap-2 group-hover:shadow-indigo-500/20">
                                今すぐ「分身」を作る <Icons.ChevronUp className="rotate-90" size={20} />
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-6">
                                ✓ 7日間の無料体験を実施中（※要クレジットカード登録）<br />
                                ※8日目以降は月額1,480円で自動更新。違約金なしでいつでも解約OK。
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
