"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

export const AppScreensSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section id="about" className="py-24 md:py-48 bg-[#f0eae4] relative overflow-hidden">
            <NoiseOverlay />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[16px] font-black text-[#1823ff] uppercase tracking-[0.4em] mb-8">MISEPOってなに？</span>
                    <h2 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-[#1823ff] mb-12">
                        ABOUT
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-slate-400 max-w-2xl leading-tight mb-12">
                        MisePo（ミセポ）は、お店の「今日」をSNS投稿文に変換するAIアプリです。<br />
                        メモ一つで、各プラットフォームに最適な文章が自動で完成します。
                    </p>

                    {/* Platform Icons Overlay */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-5">
                        {[
                            { name: 'Instagram', icon: <Icons.Instagram size={18} /> },
                            { name: 'X (Twitter)', icon: <Icons.Twitter size={16} /> },
                            { name: 'LINE', icon: <span className="font-black text-[10px] tracking-tighter">LINE</span> },
                            { name: 'Google Maps', icon: <Icons.MapPin size={18} /> }
                        ].map((platform) => (
                            <div key={platform.name} className="flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm hover:border-[#1823ff]/30 hover:bg-white transition-all group">
                                <span className="text-slate-400 group-hover:text-[#1823ff] transition-colors">{platform.icon}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{platform.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Smartphone Mocks Row */}
                <div className="relative pt-12">
                    {/* Dotted Line Decoration */}
                    <div className="absolute left-0 top-1/2 w-full h-px pointer-events-none hidden md:block">
                        <svg width="100%" height="200" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 -translate-y-1/2">
                            <path d="M0 100 Q 300 0 600 100 T 1200 100" stroke="#1823ff" strokeWidth="2" strokeDasharray="8 8" opacity="0.1" />
                        </svg>
                    </div>

                    <div className="flex flex-row items-stretch justify-start md:justify-center gap-6 md:gap-12 relative z-10 overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide">
                        {/* Mock 1: Generation */}
                        <div className="min-w-[280px] md:w-full md:max-w-[320px] group transition-all duration-700 hover:-translate-y-4 snap-center">
                            <div className="relative aspect-[9/19] rounded-[3rem] bg-[#282d32] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-[#3a3f45]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#282d32] rounded-b-2xl z-20" />
                                <div className="w-full h-full overflow-hidden rounded-[2.5rem] bg-white">
                                    <img
                                        src="/misepo_input_screen.jpg"
                                        alt="App Generation Support"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 text-center md:text-left">
                                <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-widest block mb-2">Feature 01</span>
                                <h4 className="text-xl font-black text-[#282d32]">想いを、言葉に。</h4>
                            </div>
                        </div>

                        {/* Mock 2: Calendar */}
                        <div className="min-w-[280px] md:w-full md:max-w-[320px] group transition-all duration-700 hover:-translate-y-4 md:translate-y-12 snap-center">
                            <div className="relative aspect-[9/19] rounded-[3rem] bg-[#282d32] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-[#3a3f45]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#282d32] rounded-b-2xl z-20" />
                                <div className="w-full h-full overflow-hidden rounded-[2.5rem] bg-white">
                                    <img
                                        src="/misepo_topic_sommelier.jpg"
                                        alt="Content Calendar"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 text-center md:text-left">
                                <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-widest block mb-2">Feature 02</span>
                                <h4 className="text-xl font-black text-[#282d32]">一緒に考える</h4>
                            </div>
                        </div>

                        {/* Mock 3: Learning */}
                        <div className="min-w-[280px] md:w-full md:max-w-[320px] group transition-all duration-700 hover:-translate-y-4 snap-center">
                            <div className="relative aspect-[9/19] rounded-[3rem] bg-[#282d32] p-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-4 border-[#3a3f45]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#282d32] rounded-b-2xl z-20" />
                                <div className="w-full h-full overflow-hidden rounded-[2.5rem] bg-white">
                                    <img
                                        src="/misepo_profile_selection.jpg"
                                        alt="AI Learning View"
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 text-center md:text-left">
                                <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-widest block mb-2">Feature 03</span>
                                <h4 className="text-xl font-black text-[#282d32]">個性を、分身に。</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
