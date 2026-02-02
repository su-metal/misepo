"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const NoiseOverlay = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }} />
);

export const ExperienceSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="relative bg-[#f0eae4] pt-24 overflow-hidden">
            {/* Top Transition - Curved Entrance to Blue */}
            <div className="relative z-20 flex flex-col items-center">
                <div className="w-full bg-[#1823ff] pt-48 pb-24 md:pb-64 relative overflow-hidden" style={{ borderTopLeftRadius: '50% 300px', borderTopRightRadius: '50% 300px' }}>
                    <NoiseOverlay />

                    <div className="max-w-6xl mx-auto px-8 md:px-12 relative z-10">
                        {/* Section 1: Intro with Phone Card */}
                        <div className="flex flex-col md:flex-row items-center gap-16 md:gap-32 mb-48 md:mb-64">
                            <div className="flex-1 order-2 md:order-1 lg:pl-8">
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.2] mb-10">
                                    SNS投稿を、<br />
                                    もっと身近に、<br />
                                    もっと楽しく。
                                </h3>
                                <p className="text-white/80 text-xl md:text-2xl font-bold leading-relaxed">
                                    お店の「いつも」が、お客様の「楽しみ」に変わる。<br />
                                    あなたらしい言葉で、毎日をもっと自由に。
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
                                    MisePoが心に響く言葉に変えます。<br />
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
            </div>

            {/* Bottom Transition - Large Curve back to Gray */}
            <div className="h-48 bg-[#1823ff] rounded-b-[50%] md:rounded-b-[80%] relative z-0 mt-[-50px]" />
        </section>
    );
};
