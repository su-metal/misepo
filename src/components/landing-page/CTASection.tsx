"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const CTASection = () => {
    return (
        <section className="py-32 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500 rounded-full blur-[120px]" />
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="mb-8">
                    <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-sm font-bold mb-6">
                        最後に、店主様へ。
                    </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                    365日の<br className="md:hidden" />SNSの悩み、<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300">これでおしまい。</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed mb-12 max-w-2xl mx-auto">
                    あなたの情熱は、<br className="md:hidden" />本来のお客様のために。<br />
                    文章作成は、あなたの『分身』に任せてください。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => window.location.href = '/start'}
                        className="group px-8 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                    >
                        今すぐ無料で始める
                        <Icons.ChevronUp className="rotate-90 group-hover:translate-x-1 transition-transform" size={20} />
                    </button>
                    <p className="text-sm text-slate-400">
                        まずは7日間、無料で体験
                    </p>
                </div>
            </div>
        </section>
    );
};
