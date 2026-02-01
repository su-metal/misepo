"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileCTA = () => {
    return (
        <section className="bg-[#0071b9] rounded-3xl p-8 text-center text-white shadow-lg mb-20 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 bg-[#00b900]/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 leading-tight">
                    お店の「言葉」を<br />
                    AIに任せる。
                </h2>
                <p className="text-sm text-white/80 mb-8 leading-relaxed">
                    まずは7日間、無料で体験。<br />
                    あなたの分身を作りましょう。
                </p>

                <button onClick={() => window.location.href = '/start'} className="w-full py-4 bg-white text-[#0071b9] font-bold rounded-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform group relative overflow-hidden">
                    <Icons.Sparkles size={18} className="text-[#00b900] group-hover:rotate-12 transition-transform" />
                    <span>無料で始める</span>
                </button>

                <div className="mt-4 text-[10px] text-white/60">
                    クレジットカード登録不要
                </div>
            </div>
        </section>
    );
};
