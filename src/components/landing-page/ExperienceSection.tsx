"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-overlay hidden md:block" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

export const ExperienceSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="relative bg-[#f0eae4] overflow-hidden">
            {/* Top Transition - Simple Wave */}
            <div className="relative w-full h-[180px] md:h-[300px] -mb-1">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#1823ff]">
                    <path d="M0,160 C480,320 960,0 1440,160 V320 H0 Z" />
                </svg>

                <NoiseOverlay />

                {/* Centered Message sitting at the boundary */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-30 pointer-events-none select-none w-full px-4">
                    <div className={`font-black tracking-tighter leading-[0.8] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[7.5rem]'}`}>
                        <div className="text-white whitespace-nowrap">SOCIAL MEDIA,</div>
                        <div className="text-[#282d32] whitespace-nowrap">ENJOYED.</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Solid Blue Background */}
            <div className="relative bg-[#1823ff] pb-16 md:pb-64 z-20">
                <NoiseOverlay />

                {/* Background Large Text Accent */}
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.08] whitespace-nowrap z-0">
                    <span className="text-[20rem] md:text-[40rem] font-black text-white italic tracking-tighter">EMOTION</span>
                </div>

                <div className="max-w-6xl mx-auto px-8 md:px-12 relative z-10">
                    {/* Section 1: Intro with Phone Card */}
                    <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32 pt-8 md:pt-48 mb-48 md:mb-64">
                        <div className="flex-1 order-2 md:order-1 lg:pl-8">
                            <span className="text-lg md:text-2xl font-bold text-white/70 block mb-2 tracking-tight">MisePoなら</span>
                            <h3 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[1.2] mb-10">
                                投稿が、<br />
                                続けられる。
                            </h3>
                            <p className="text-white/80 text-xl md:text-2xl font-bold leading-relaxed">
                                「何を書けばいいか分からない」から解放。<br />
                                メモするだけで、負担なく投稿が続きます。
                            </p>
                        </div>
                        <div className="flex-1 order-1 md:order-2 relative">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                            <div className="relative group transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/shop_owner_smartphone_cafe_1769987142891.png"
                                    alt="Shop Owner"
                                    className="w-full max-w-[450px] rounded-[48px] shadow-2xl rotate-[-3deg] transform-gpu border-4 border-white/10"
                                />
                                <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/20" />
                            </div>
                        </div>
                    </div>

                    {/* Dotted Decorative Line */}
                    <div className="absolute left-1/2 top-1/4 w-[120%] h-full pointer-events-none opacity-20 -translate-x-1/2">
                        <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 0 Q 300 300 800 200 T 950 800" stroke="white" strokeWidth="6" strokeDasharray="12 12" strokeLinecap="round" />
                            <path d="M950 0 Q 700 300 200 200 T 50 800" stroke="white" strokeWidth="6" strokeDasharray="12 12" strokeLinecap="round" opacity="0.5" />
                        </svg>
                    </div>

                    {/* Section 2: Tilted Cards and Feelings */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                        <div className="w-full md:w-5/12 relative">
                            <div className="relative group transition-transform duration-500 hover:scale-[1.02]">
                                <img
                                    src="/delicious_pastry_coffee_close_up_1769987156597.png"
                                    alt="Experience"
                                    className="w-full rounded-[48px] shadow-2xl rotate-[3deg] transform-gpu border-4 border-white/10"
                                />
                                <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/20" />
                            </div>
                        </div>

                        <div className="w-full md:w-4/12 flex flex-col items-start md:items-end text-left md:text-right text-white space-y-8">
                            <p className="text-2xl md:text-3xl font-black leading-tight">
                                「今日は新作が綺麗に焼けた」<br />
                                「あのお客様、また来てくれた」
                            </p>
                            <p className="text-lg md:text-xl font-bold text-white/70 leading-relaxed">
                                そんな小さな瞬間を、<br />
                                misepoが心に響く言葉に変えます。<br />
                                あなたの毎日に、もっと寄りそうパートナー。
                            </p>
                        </div>
                    </div>

                    {/* Last Experience Card */}
                    <div className="mt-48 md:mt-64 flex flex-col md:flex-row items-center gap-16 md:gap-32">
                        <div className="w-full md:w-4/12 order-2 md:order-1 text-white">
                            <h4 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
                                想いを、<br />
                                <span className="opacity-50 tracking-tighter italic">みつかる、<br />つながる。</span>
                            </h4>
                        </div>
                        <div className="w-full md:w-6/12 order-1 md:order-2 relative">
                            <div className="relative group transition-transform duration-500 rotate-[-5deg] hover:rotate-0 hover:scale-[1.02]">
                                <img
                                    src="/shop_customer_greeting_experience_1769987174470.png"
                                    alt="Communication"
                                    className="w-full rounded-[48px] shadow-2xl transform-gpu border-4 border-white/10"
                                />
                                <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Transition - Curved Sweep back to Kinari */}
            <div className="relative w-full h-[150px] md:h-[300px] bg-[#1823ff] z-10">
                <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full fill-[#f0eae4]">
                    <path d="M0,160 C480,320 960,0 1440,160 V320 H0 Z" />
                </svg>
            </div>
        </section>
    );
};
