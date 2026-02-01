"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileFooterCTA = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="relative pt-24 pb-12 overflow-hidden">
            {/* Curved Blue Background */}
            <div className="absolute inset-0 bg-[#0071b9] rounded-t-[50%] scale-x-150 w-full h-full -z-10 transform origin-top"></div>

            {/* Content Container (Counteract scale-x) */}
            <div className="relative z-10 flex flex-col items-center text-white px-6">

                {/* Logo */}
                <div className="mb-8">
                    <span className="font-bold text-7xl tracking-tight italic" style={{ fontFamily: 'cursive' }}>
                        misepo
                    </span>
                </div>

                <h2 className="text-2xl font-black mb-12 text-center leading-relaxed">
                    さっそくMisePoを<br />はじめよう！
                </h2>

                {/* QR Codes / Downloads */}
                <div className="grid grid-cols-2 gap-8 mb-12 w-full max-w-xs">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-2 rounded-xl">
                            {/* Mock QR Code */}
                            <div className="w-24 h-24 bg-white flex flex-wrap content-center justify-center p-1">
                                <div className="w-full h-full border-4 border-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                    <Icons.Smartphone size={32} className="text-slate-900" />
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg w-full justify-center border border-white/20">
                            <div className="text-2xl"></div>
                            <div className="text-left leading-none">
                                <div className="text-[8px]">App Store</div>
                                <div className="text-xs font-bold">からダウンロード</div>
                            </div>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-white p-2 rounded-xl">
                            {/* Mock QR Code */}
                            <div className="w-24 h-24 bg-white flex flex-wrap content-center justify-center p-1">
                                <div className="w-full h-full border-4 border-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 pattern-grid opacity-20"></div>
                                    <Icons.Bot size={32} className="text-slate-900" />
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg w-full justify-center border border-white/20">
                            <div className="text-lg">▶</div>
                            <div className="text-left leading-none">
                                <div className="text-[8px]">Google Play</div>
                                <div className="text-xs font-bold">で手に入れよう</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="text-[10px] text-white/60 text-center space-y-2 mb-20 max-w-md">
                    <p>Apple、Appleのロゴは、米国およびその他の国や地域における Apple Inc. の登録商標です。</p>
                    <p>App Storeは、Apple Inc. のサービスマークです。</p>
                    <p>Google PlayおよびGoogle Playロゴは、Google LLCの商標です。</p>
                </div>

                {/* Mascot & Page Top */}
                <div className="relative w-full max-w-xs flex justify-between items-end px-4">
                    {/* Mascot */}
                    <div className="transform translate-y-2">
                        <div className="text-6xl filter drop-shadow-xl">🐶</div>
                    </div>

                    {/* Page Top Button */}
                    <button
                        onClick={scrollToTop}
                        className="w-24 h-24 rounded-full border border-white/30 flex flex-col items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        <Icons.ChevronUp size={24} />
                        <span className="text-[10px] font-bold mt-1 tracking-widest">PAGE TOP</span>
                    </button>
                </div>

            </div>
        </section>
    );
};
