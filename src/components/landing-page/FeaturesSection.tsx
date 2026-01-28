"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const FeaturesSection = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <section id="features" className="py-20 md:py-32 bg-[#F9F7F2] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="bg-white text-slate-500 font-bold tracking-widest text-xs uppercase mb-6 px-4 py-1.5 border border-slate-200 rounded-full shadow-sm inline-block">All-in-One Platform</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8 tracking-tight leading-tight">
                        必要なのは、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5CC6D] to-[#E88BA3]">このアプリひとつだけ。</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        店舗集客に必要な<br className="md:hidden" />4大プラットフォームを完全網羅。<br />
                        それぞれの媒体特性に合わせて、<br className="md:hidden" />AIが最適な「振る舞い」をします。
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(300px,auto)]">
                    {/* Main Feature */}
                    <div className="md:col-span-2 bg-white border border-slate-100 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                        <div className="relative z-10 flex flex-col h-full items-start">
                            <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start mb-8 md:mb-0">
                                <div className="w-16 h-16 bg-[#9B8FD4]/20 rounded-2xl flex items-center justify-center text-[#9B8FD4] shadow-inner shrink-0 md:mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Icons.Maximize2 size={isMobile ? 28 : 32} />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-800 leading-tight">4大プラットフォーム<br className="md:hidden" />一括管理</h3>
                            </div>
                            <p className="text-slate-500 text-lg font-medium opacity-90 mb-8 max-w-md mt-6 md:mt-0 leading-relaxed">
                                Instagram、X (Twitter)、公式LINE、Googleマップの投稿・返信を1つのアプリで完結。
                                <br />
                                媒体ごとのアプリを行き来する手間をゼロにします。
                            </p>
                            <div className="mt-auto w-full flex gap-4 items-center justify-start flex-wrap">
                                {[
                                    { icon: <Icons.Instagram size={24} />, bg: "bg-[#E88BA3]/10", text: "text-[#E88BA3]", border: "border-[#E88BA3]/20" },
                                    { icon: <Icons.Twitter size={24} />, bg: "bg-slate-100", text: "text-slate-900", border: "border-slate-200" },
                                    { icon: <Icons.MessageCircle size={24} />, bg: "bg-[#06C755]/10", text: "text-[#06C755]", border: "border-[#06C755]/20" },
                                    { icon: <Icons.MapPin size={24} />, bg: "bg-[#F5CC6D]/10", text: "text-[#F5CC6D]", border: "border-[#F5CC6D]/20" },
                                ].map((item, i) => (
                                    <div key={i} className={`w-14 h-14 ${item.bg} ${item.text} border ${item.border} rounded-2xl flex items-center justify-center group-hover:-translate-y-1 transition-transform`} style={{ transitionDelay: `${i * 100}ms` }}>
                                        {item.icon}
                                    </div>
                                ))}
                                <div className="hidden sm:block h-px w-12 bg-slate-200" />
                                <div className="text-xs font-bold text-white uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-full shadow-lg shadow-slate-900/20">Sync All</div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Translation */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                        <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start">
                            <div className="w-14 h-14 bg-[#4DB39A]/20 rounded-2xl text-[#4DB39A] flex items-center justify-center md:mb-8 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500"><Icons.Globe size={28} /></div>
                            <h3 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">多言語翻訳 &<br className="hidden md:block" />インバウンド</h3>
                        </div>
                        <p className="text-slate-500 text-base font-medium mt-6 md:mt-4 mb-8 leading-relaxed">
                            日本語の投稿から、英語・中国語・韓国語をワンタップで生成。外国人観光客へのアピールも自動化できます。
                        </p>
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex gap-2 mb-3">
                                <span className="bg-white px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full">EN</span>
                                <span className="bg-white px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full">CN</span>
                                <span className="bg-white px-3 py-1 text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full">KR</span>
                            </div>
                            <div className="text-xs font-medium text-slate-600 italic">"Welcome to our cafe..."</div>
                        </div>
                    </div>

                    {/* Feature 3: Database */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_40px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                        <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start">
                            <div className="w-14 h-14 bg-[#F5CC6D]/20 rounded-2xl text-[#F5CC6D] flex items-center justify-center md:mb-8 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500"><Icons.History size={28} /></div>
                            <h3 className="text-xl md:text-3xl font-bold text-slate-800 leading-tight">お手本学習 /<br className="hidden md:block" />分身機能</h3>
                        </div>
                        <p className="text-slate-500 text-base font-medium mt-6 md:mt-4 mb-8 leading-relaxed">
                            数件のお手本を読み込ませるだけで、あなた独自の「書き癖」をAIが忠実に再現。使えば使うほど生成のコツが掴めます。
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-gradient-to-r from-[#F5CC6D] to-[#E88BA3] rounded-full" />
                            </div>
                            <span className="text-xs font-bold text-slate-400">85% Match</span>
                        </div>
                    </div>

                    {/* Feature 4: Performance */}
                    <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 text-white relative shadow-2xl overflow-hidden group hover:-translate-y-2 hover:shadow-slate-900/40 transition-all duration-500">
                        {/* Abstract Gradient Blob */}
                        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-[#E88BA3]/20 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#4DB39A]/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-slate-800 text-[#E88BA3] px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest mb-6 border border-slate-700/50"><Icons.Zap size={14} /> Performance</div>
                                <h3 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">圧倒的な<br className="md:hidden" />スピード</h3>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed">PWA（プログレッシブウェブアプリ）技術により、ネイティブアプリ同等の起動速度を実現。お客様対応の合間にもストレスなく利用できます。</p>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="text-center relative">
                                    <div className="text-7xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 mb-2 tracking-tighter">0.5s</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">Startup Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
