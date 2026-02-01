"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const FeaturesSection = ({ isMobile }: { isMobile: boolean }) => {
    return (
        <section id="features" className="py-24 md:py-48 bg-[#F4F6F9] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">Platforms</span>
                    <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.9] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[7.5rem]'}`}>
                        SYNC<br />
                        <span className="text-[#1823ff]">ALL.</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-slate-400 mt-12 max-w-2xl leading-tight">
                        店舗集客に必要なプラットフォームを完全網羅。
                        AIがそれぞれの媒体に最適な「振る舞い」を自動生成します。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-slate-200/20 border border-slate-100 flex flex-col items-start text-left group">
                        <div className="w-16 h-16 bg-[#1823ff]/5 rounded-2xl flex items-center justify-center text-[#1823ff] mb-10 group-hover:scale-110 transition-all">
                            <Icons.Maximize2 size={32} />
                        </div>
                        <h3 className="text-4xl font-black text-[#282d32] mb-6">Omni-Channel</h3>
                        <p className="text-lg font-bold text-slate-400 leading-tight mb-8">
                            Instagram, X, LINE, Google Mapsへ一括配信。中身は同じでも、口調は媒体に合わせて変幻自在。
                        </p>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icons.Instagram size={20} /></div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icons.Twitter size={20} /></div>
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100"><Icons.MessageCircle size={20} /></div>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#282d32] rounded-[48px] p-12 shadow-2xl shadow-[#282d32]/20 text-white flex flex-col items-start text-left group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-20 bg-[#1823ff]/20 rounded-full blur-[80px] -z-10" />

                        <div className="w-16 h-16 bg-[#1823ff]/20 rounded-2xl flex items-center justify-center text-[#1823ff] mb-10 group-hover:scale-110 transition-all">
                            <Icons.Globe size={32} />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-6">Global Ready</h3>
                        <p className="text-lg font-bold text-slate-400 leading-tight mb-8">
                            日本語の投稿から、英語・中国語・韓国語をワンタップ生成。インバウンド集客の壁をゼロに。
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest">ENGLISH</span>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest">CHINESE</span>
                        </div>
                    </div>

                    {/* Feature 3: Performance */}
                    <div className="md:col-span-2 bg-[#1823ff] rounded-[48px] p-12 md:p-24 text-white flex flex-col md:flex-row items-center justify-between group">
                        <div className="flex flex-col items-start text-left">
                            <h3 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-6">ULTRA<br />FAST.</h3>
                            <p className="text-xl md:text-2xl font-black text-white/70 max-w-md leading-tight">
                                PWA技術により、ネイティブアプリ同等の起動速度を実現。
                            </p>
                        </div>
                        <div className="text-center mt-12 md:mt-0">
                            <div className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none mb-4">0.5<span className="text-4xl md:text-6xl italic">s</span></div>
                            <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-50">Startup Speed</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
