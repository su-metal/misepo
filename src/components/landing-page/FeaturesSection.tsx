"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const FeaturesSection = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <section id="features" className="py-16 md:py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-2 block">All-in-One Platform</span>
                    <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        必要なのは、<br />
                        <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">このアプリひとつだけ。</span>
                    </h2>
                    <p className="text-slate-600 text-lg">
                        店舗集客に必要な<br className="md:hidden" />3大プラットフォームを完全網羅。<br />
                        それぞれの媒体特性に合わせて、<br className="md:hidden" />AIが最適な「振る舞い」をします。
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
                    <div className="md:col-span-2 bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-70" />
                        <div className="relative z-10 flex flex-col h-full items-start">
                            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0 md:items-start mb-6 md:mb-0">
                                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0 md:mb-6"><Icons.Maximize2 size={isMobile ? 22 : 24} /></div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">3大プラットフォーム<br className="md:hidden" />一括管理</h3>
                            </div>
                            <p className="text-slate-600 text-sm md:text-base mb-6 max-w-md mt-4 md:mt-0">
                                Instagram、X (Twitter)、Googleビジネスプロフィールの投稿・返信を1つのアプリで完結。
                                <br />
                                媒体ごとのアプリを行き来する手間をゼロにします。
                            </p>
                            <div className="mt-auto w-full flex gap-4 items-center justify-start">
                                {[
                                    { icon: <Icons.Instagram size={18} />, bg: "bg-pink-100", text: "text-pink-600" },
                                    { icon: <Icons.Twitter size={18} />, bg: "bg-sky-100", text: "text-sky-600" },
                                    { icon: <Icons.MapPin size={18} />, bg: "bg-green-100", text: "text-green-600" },
                                ].map((item, i) => (
                                    <div key={i} className={`w-12 h-12 ${item.bg} ${item.text} rounded-xl flex items-center justify-center`}>
                                        {item.icon}
                                    </div>
                                ))}
                                <div className="h-0.5 w-12 bg-slate-200" />
                                <div className="text-xs font-bold text-slate-500">Sync All</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500" />
                        <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0 md:items-start">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center md:mb-6 shrink-0"><Icons.Globe size={24} /></div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">多言語翻訳 &<br className="hidden md:block" />インバウンド対応</h3>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base mt-4 md:mt-2 mb-4">
                            日本語の投稿から、英語・中国語・韓国語をワンタップで生成。外国人観光客へのアピールも自動化できます。
                        </p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex gap-2 mb-2 text-[10px] font-bold text-slate-400">
                                <span className="bg-white px-1 rounded border border-slate-200">EN</span>
                                <span className="bg-white px-1 rounded border border-slate-200">CN</span>
                                <span className="bg-white px-1 rounded border border-slate-200">KR</span>
                            </div>
                            <div className="text-[10px] text-slate-500">Welcome to our cafe...</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] p-7 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-sky-500" />
                        <div className="flex flex-row md:flex-col items-center gap-4 md:gap-0 md:items-start">
                            <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-xl flex items-center justify-center md:mb-6 shrink-0"><Icons.History size={24} /></div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">過去投稿の<br className="hidden md:block" />スタイル同期</h3>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base mt-4 md:mt-2 mb-4">
                            過去数年分の投稿データを解析し、あなただけの「書き癖」データベースを構築。使えば使うほど精度が向上します。
                        </p>
                        <div className="flex items-center gap-2 mt-auto">
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-sky-500" />
                            </div>
                            <span className="text-[10px] font-bold text-sky-500">85% Match</span>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-full opacity-10">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="none" strokeWidth="2" />
                                <path d="M0 100 C 30 20 70 20 100 100" stroke="white" fill="none" strokeWidth="2" />
                            </svg>
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 bg-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold mb-4 border border-indigo-500/50"><Icons.Zap size={14} /> Performance</div>
                                <h3 className="text-2xl font-bold mb-2">圧倒的なスピード</h3>
                                <p className="text-slate-400">PWA（プログレッシブウェブアプリ）技術により、ネイティブアプリ同等の起動速度を実現。お客様対応の合間にもストレスなく利用できます。</p>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="text-center">
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 mb-1">0.5s</div>
                                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Startup Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
