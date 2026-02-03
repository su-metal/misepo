"use client";
import React from 'react';

export const MobileAbout = () => {
    const mockups = [
        { id: 1, title: "Calendar View", color: "bg-white" },
        { id: 2, title: "Detail View", color: "bg-slate-50" },
        { id: 3, title: "Generator View", color: "bg-blue-50" },
    ];

    return (
        <section className="bg-[var(--ichizen-beige)] py-16 px-6 overflow-hidden">
            <div className="mb-8 overflow-hidden">
                <p className="text-[#1f29fc] font-black text-sm mb-2 tracking-tight">
                    MisePoってなに？
                </p>
                <h2 className="text-[#1f29fc] text-7xl font-black tracking-tighter mb-8 italic">
                    ABOUT
                </h2>
                <p className="text-[#122646] text-sm font-bold leading-relaxed max-w-[300px]">
                    MisePo（ミセポ）は、「AIがあなたに代わって投稿案を作成」し、SNS運用を劇的に効率化する店主のためのAIパートナーツールです。
                </p>
            </div>

            {/* Horizontal Scroll Mockups */}
            <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide -mx-6 px-6 snap-x">
                {mockups.map((mock) => (
                    <div key={mock.id} className="flex-none w-[280px] snap-center">
                        {/* Phone Mockup Frame */}
                        <div className="relative w-full aspect-[9/19] bg-slate-900 rounded-[48px] p-2 shadow-2xl ring-4 ring-slate-800/10">
                            {/* Screen */}
                            <div className={`w-full h-full ${mock.color} rounded-[40px] overflow-hidden relative border border-slate-700/50`}>
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-b-2xl z-10"></div>

                                {/* Screen Content Placeholder */}
                                <div className="p-4 pt-10 space-y-4">
                                    <div className="h-4 w-2/3 bg-slate-100 rounded-full"></div>
                                    <div className="aspect-[4/3] bg-slate-200 rounded-2xl w-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                        <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
                                        <div className="h-2 w-4/6 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <div className="h-12 bg-[#1f29fc]/10 rounded-xl"></div>
                                        <div className="h-12 bg-[#00b900]/10 rounded-xl"></div>
                                    </div>
                                </div>

                                {/* Status bar symbols */}
                                <div className="absolute top-2 right-6 flex gap-1 items-center opacity-30">
                                    <div className="w-3 h-1.5 bg-black rounded-sm"></div>
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Decorative dots follow path from previous section potentially */}
            <div className="relative h-12">
                <svg width="100%" height="100%" viewBox="0 0 400 50" fill="none" className="opacity-20">
                    <path
                        d="M0,25 Q100,0 200,25 T400,25"
                        stroke="#1f29fc"
                        strokeWidth="3"
                        strokeDasharray="6 10"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        </section>
    );
};
