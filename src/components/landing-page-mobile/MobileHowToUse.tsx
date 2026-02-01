"use client";
import React from 'react';

export const MobileHowToUse = () => {
    const steps = [
        {
            id: 1,
            label: "SNS投稿をすぐに作成するために",
            text: "MisePoはAIがあなたのお店のこだわりを分析し、最適な投稿文を数秒で作成します。もう画面の前で悩む必要はありません。",
            bg: "bg-slate-100"
        },
        {
            id: 2,
            label: "手間なく一括配信するために",
            text: "作成した投稿はLINEやInstagram、Googleマップへ一度に連携。複数のアプリを開く手間を省き、最小限の操作で情報を届けます。",
            bg: "bg-blue-50"
        },
        {
            id: 3,
            label: "あなたの個性を守るために",
            text: "使えば使うほどAIがあなたの文章スタイルを学習。機械的な文章ではなく、店主であるあなたの温かみのある言葉を再現します。",
            bg: "bg-green-50"
        }
    ];

    return (
        <section className="bg-[var(--ichizen-beige)] py-20 px-6 relative overflow-hidden">
            {/* Background Dots */}
            <div className="absolute inset-0 z-0">
                <svg width="100%" height="100%" viewBox="0 0 400 1200" fill="none" className="opacity-10">
                    <path
                        d="M350,50 Q450,250 150,450 T350,850"
                        stroke="#1f29fc"
                        strokeWidth="5"
                        strokeDasharray="8 15"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="relative z-10 mb-16">
                <p className="text-[#1f29fc] font-black text-sm mb-2 tracking-tight">
                    MisePoのつかいかた
                </p>
                <h2 className="text-[#1f29fc] text-7xl font-black tracking-tighter italic leading-[0.8]">
                    HOW TO<br />USE
                </h2>
            </div>

            <div className="space-y-24 relative z-10">
                {steps.map((step, index) => (
                    <div key={step.id} className="space-y-8">
                        {/* Image Container */}
                        <div className="relative">
                            <div className={`w-full aspect-[4/3] ${step.bg} rounded-[100px] overflow-hidden shadow-xl border-4 border-white flex items-center justify-center`}>
                                <div className="text-slate-300 font-bold uppercase tracking-widest text-xs">Visual {step.id}</div>
                            </div>

                            {/* Floating Label */}
                            <div className={`absolute bottom-4 ${index % 2 === 0 ? '-left-2' : '-right-2'} transform ${index % 2 === 0 ? '-rotate-3' : 'rotate-2'}`}>
                                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl font-black text-sm whitespace-nowrap border-2 border-white/20">
                                    {step.label}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="px-4">
                            <p className="text-slate-800 text-sm font-bold leading-relaxed">
                                {step.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
