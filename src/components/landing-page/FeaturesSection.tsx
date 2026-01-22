"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const FeaturesSection = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <section id="features" className="py-20 md:py-32 bg-[#f9f5f2] overflow-hidden border-b-[6px] border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="bg-[#D4849A] text-white font-black tracking-tight text-sm uppercase mb-6 px-4 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl inline-block">All-in-One Platform</span>
                    <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tight leading-tight">
                        必要なのは、<br />
                        <span className="underline decoration-[8px] decoration-[#E5C58C]">このアプリひとつだけ。</span>
                    </h2>
                    <p className="text-black text-xl font-bold opacity-80">
                        店舗集客に必要な<br className="md:hidden" />3大プラットフォームを完全網羅。<br />
                        それぞれの媒体特性に合わせて、<br className="md:hidden" />AIが最適な「振る舞い」をします。
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(300px,auto)]">
                    {/* Main Feature */}
                    <div className="md:col-span-2 bg-white border-[4px] border-black rounded-2xl p-8 md:p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="relative z-10 flex flex-col h-full items-start">
                            <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start mb-8 md:mb-0">
                                <div className="w-16 h-16 bg-[#9B98C2] border-[3px] border-black rounded-2xl flex items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform shrink-0 md:mb-8">
                                    <Icons.Maximize2 size={isMobile ? 28 : 32} />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-black text-black leading-tight uppercase italic">3大プラットフォーム<br className="md:hidden" />一括管理</h3>
                            </div>
                            <p className="text-black text-lg font-bold opacity-80 mb-8 max-w-md mt-6 md:mt-0">
                                Instagram、X (Twitter)、Googleビジネスプロフィールの投稿・返信を1つのアプリで完結。
                                <br />
                                媒体ごとのアプリを行き来する手間をゼロにします。
                            </p>
                            <div className="mt-auto w-full flex gap-6 items-center justify-start flex-wrap">
                                {[
                                    { icon: <Icons.Instagram size={24} />, bg: "bg-[#D4849A]", text: "text-white" },
                                    { icon: <Icons.Twitter size={24} />, bg: "bg-[#88B0A5]", text: "text-white" },
                                    { icon: <Icons.MapPin size={24} />, bg: "bg-[#E5C58C]", text: "text-black" },
                                ].map((item, i) => (
                                    <div key={i} className={`w-14 h-14 ${item.bg} ${item.text} border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl flex items-center justify-center group-hover:-translate-y-1 transition-transform`} style={{ transitionDelay: `${i * 100}ms` }}>
                                        {item.icon}
                                    </div>
                                ))}
                                <div className="hidden sm:block h-[3px] w-12 bg-black" />
                                <div className="text-sm font-black text-black uppercase tracking-widest bg-white px-3 py-1 border-[2px] border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-2xl">Sync All</div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Translation */}
                    <div className="bg-white border-[4px] border-black rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start">
                            <div className="w-14 h-14 bg-[#88B0A5] border-[3px] border-black rounded-2xl text-white flex items-center justify-center md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-6 transition-transform shrink-0"><Icons.Globe size={28} /></div>
                            <h3 className="text-2xl md:text-3xl font-black text-black leading-tight uppercase italic">多言語翻訳 &<br className="hidden md:block" />インバウンド</h3>
                        </div>
                        <p className="text-black text-lg font-bold opacity-80 mt-6 md:mt-2 mb-6">
                            日本語の投稿から、英語・中国語・韓国語をワンタップで生成。外国人観光客へのアピールも自動化できます。
                        </p>
                        <div className="bg-[#f9f5f2] p-4 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
                            <div className="flex gap-2 mb-3">
                                <span className="bg-white px-2 py-1 text-[10px] font-black border-[2px] border-black rounded-2xl">EN</span>
                                <span className="bg-white px-2 py-1 text-[10px] font-black border-[2px] border-black rounded-2xl">CN</span>
                                <span className="bg-white px-2 py-1 text-[10px] font-black border-[2px] border-black rounded-2xl">KR</span>
                            </div>
                            <div className="text-xs font-black text-black italic">Welcome to our cafe...</div>
                        </div>
                    </div>

                    {/* Feature 3: Database */}
                    <div className="bg-white border-[4px] border-black rounded-2xl p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="flex flex-row md:flex-col items-center gap-6 md:gap-0 md:items-start">
                            <div className="w-14 h-14 bg-[#E5C58C] border-[3px] border-black rounded-2xl text-black flex items-center justify-center md:mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform shrink-0"><Icons.History size={28} /></div>
                            <h3 className="text-2xl md:text-3xl font-black text-black leading-tight uppercase italic">過去投稿の<br className="hidden md:block" />スタイル同期</h3>
                        </div>
                        <p className="text-black text-lg font-bold opacity-80 mt-6 md:mt-2 mb-6">
                            過去数年分の投稿データを解析し、あなただけの「書き癖」データベースを構築。使えば使うほど精度が向上します。
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="flex-1 h-4 bg-black border-[2px] border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden">
                                <div className="h-full w-[85%] bg-[#E5C58C]" />
                            </div>
                            <span className="text-sm font-black text-black italic">85% Match</span>
                        </div>
                    </div>

                    {/* Feature 4: Performance */}
                    <div className="md:col-span-2 bg-black border-[4px] border-white rounded-2xl p-8 md:p-12 text-white relative shadow-[10px_10px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[14px_14px_0px_0px_rgba(255,255,255,0.2)] transition-all">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 bg-[#D4849A] text-white px-4 py-1 border-[2px] border-white rounded-2xl font-black text-xs uppercase tracking-widest mb-6"><Icons.Zap size={16} /> Performance</div>
                                <h3 className="text-3xl md:text-5xl font-black mb-6 uppercase italic leading-tight">圧倒的な<br className="md:hidden" />スピード</h3>
                                <p className="text-white/70 text-lg font-bold">PWA（プログレッシブウェブアプリ）技術により、ネイティブアプリ同等の起動速度を実現。お客様対応の合間にもストレスなく利用できます。</p>
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="text-center relative">
                                    <div className="text-7xl md:text-9xl font-black text-white italic mb-2 tracking-tighter shadow-text">0.5s</div>
                                    <div className="text-sm font-black text-white/40 uppercase tracking-[0.3em] bg-white/10 px-4 py-1 border-[1px] border-white rounded-2xl/20">Startup Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
