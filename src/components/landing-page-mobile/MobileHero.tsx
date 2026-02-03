"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileHero = () => {
    return (
        <section className="bg-white rounded-3xl p-8 shadow-sm mb-6 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0071b9]"></div>

            <div className="py-8">
                <h2 className="text-3xl font-bold text-[#122646] tracking-tight leading-tight mb-4">
                    <span className="block text-sm font-medium text-[#0071b9] mb-2 tracking-widest uppercase">For Restaurant Owners</span>
                    もう、SNS投稿で<br />
                    <span className="text-[#0071b9]">悩まない。</span>
                </h2>

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    MisePoは、あなたのお店の「専属ライター」。<br />
                    日々の投稿作成から、クチコミ返信まで。<br />
                    もう、言葉に詰まる夜はありません。
                </p>

                {/* Mock Typing Animation Container */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2">
                        <div className="bg-white p-1 rounded-lg shadow-sm">
                            <Icons.Sparkles size={14} className="text-[#0071b9]" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">AI Generating...</span>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-2 bg-slate-200 rounded w-full animate-pulse delay-75"></div>
                        <div className="h-2 bg-slate-200 rounded w-5/6 animate-pulse delay-150"></div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-400">#Cafe</span>
                        <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-400">#Lunch</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
