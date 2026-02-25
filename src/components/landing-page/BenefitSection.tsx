"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="py-24 md:py-48 relative overflow-hidden bg-gradient-to-b from-[#f0eae4] via-white to-[#eef2ff]">
            {/* Background Soft Blobs */}
            <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-[#ffeff5] rounded-full blur-[120px] opacity-60 hidden md:block" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#eef2ff] rounded-full blur-[100px] opacity-60 hidden md:block" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className={`flex flex-col mb-24 ${isMobile ? 'items-start text-left' : 'items-center text-center'}`}>
                    <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.85] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[5rem]'}`}>
                        <span className="block text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-white rounded-full border border-[#1823ff]/10 shadow-sm w-fit normal-case" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                            実店舗SNSをAIで自動化する5つのメリット
                        </span>
                        SNSを、<br />
                        <span className="text-gradient-primary">お店の資産に。</span>
                    </h2>
                    <p className="text-xl md:text-2xl font-bold text-slate-400 mt-12 max-w-2xl leading-tight">
                        投稿が続くことで、お店の信頼とファンが積み重なっていきます。
                    </p>
                </div>

                <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} mb-32`}>
                    {/* Card 1: Recruit */}
                    <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 border border-white shadow-xl shadow-[#1823ff]/5 transition-transform hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-[#f0efff] rounded-2xl flex items-center justify-center text-[#1823ff]">
                            <Icons.Search size={32} />
                        </div>
                        <div className="flex items-baseline gap-2 text-[#282d32]">
                            <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums"><CountUp end={85} /></span>
                            <span className="text-3xl font-black">%</span>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-[#282d32]">採用・集客の判断基準</h3>
                            <p className="text-base font-bold text-slate-500 leading-snug">
                                求職者の85%は、応募前にSNSで店主の「人柄」や「雰囲気」を確かめています。
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Trust */}
                    <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 border border-white shadow-xl shadow-[#1823ff]/5 transition-transform hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-[#f0efff] rounded-2xl flex items-center justify-center text-[#1823ff]">
                            <Icons.TrendingUp size={32} />
                        </div>
                        <div className="flex items-baseline gap-2 text-[#1823ff]">
                            <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums">1.7</span>
                            <span className="text-3xl font-black">x</span>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-[#282d32]">信頼性を高める継続性</h3>
                            <p className="text-base font-bold text-slate-500 leading-snug">
                                丁寧な情報発信があるお店は、そうでないお店に比べ、お客様の信頼度が1.7倍に向上します。
                            </p>
                        </div>
                    </div>

                    {/* Card 3: Opportunity */}
                    <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 flex flex-col items-center text-center gap-6 border border-white shadow-xl shadow-[#1823ff]/5 transition-transform hover:scale-[1.02]">
                        <div className="w-16 h-16 bg-[#f0efff] rounded-2xl flex items-center justify-center text-[#1823ff]">
                            <Icons.X size={32} />
                        </div>
                        <div className="flex flex-col items-center leading-none">
                            <span className="text-3xl font-black tracking-tighter text-[#1823ff]">EVERY</span>
                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-[#282d32]">OTHER</span>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-[#282d32]">来店機会の最大化</h3>
                            <p className="text-base font-bold text-slate-500 leading-snug">
                                2人に1人が、SNSの情報が止まっているお店への来店を「あきらめた」経験があります。
                            </p>
                        </div>
                    </div>
                </div>

                {/* New Feature List Section */}
                <div className="max-w-4xl mx-auto space-y-6 mt-32">
                    <div className="flex flex-col items-center text-center mb-16">
                        <h3 className="text-3xl md:text-4xl font-black text-[#282d32] mb-4">充実のサポート機能</h3>
                        <p className="text-lg font-bold text-slate-400">SNS運用を「楽しく・簡単に」するための全てが揃っています。</p>
                    </div>

                    {[
                        {
                            title: "AIおまかせ生成",
                            desc: "数行のメモから、各SNSに最適なトーンの投稿文を数秒で作成します。",
                            icon: "Sparkles",
                            color: "text-[#1823ff]",
                            bg: "bg-[#1823ff]/5"
                        },
                        {
                            title: "カレンダー連動トレンド機能",
                            desc: "季節のイベントやトレンドをAIが分析し、最適な投稿トピックを提案。",
                            icon: "Calendar",
                            color: "text-[#FF6B6B]",
                            bg: "bg-[#FF6B6B]/5"
                        },
                        {
                            title: "独自の文体学習機能",
                            desc: "過去の投稿を登録・学習し、あなたの口癖やリズムを忠実に再現。",
                            icon: "MessageCircle",
                            color: "text-[#4ECDC4]",
                            bg: "bg-[#4ECDC4]/5"
                        },
                        {
                            title: "一括同時生成（X/Insta/LINE）",
                            desc: "媒体ごとの文字数制限や文化に合わせて、一度にパーソナライズされた文章を生成。",
                            icon: "Share2",
                            color: "text-[#2CB67D]",
                            bg: "bg-[#2CB67D]/5"
                        },
                        {
                            title: "お店情報への完全最適化",
                            desc: "お店の基本情報を登録しておくだけで、全ての投稿があなたのビジネスに特化されます。",
                            icon: "Store",
                            color: "text-[#7F5AF0]",
                            bg: "bg-[#7F5AF0]/5"
                        },
                        // {
                        //     title: "インバウンド・グローバル対応",
                        //     desc: "日本語の投稿から、英語・中国語・韓国語をワンタップ生成。海外のお客様へのアピールも手間ゼロに。",
                        //     icon: "Globe",
                        //     color: "text-[#1823ff]",
                        //     bg: "bg-[#1823ff]/5"
                        // }
                    ].map((feature, idx) => {
                        const IconComponent = Icons[feature.icon];
                        return (
                            <div key={idx} className="bg-white rounded-[2.5rem] p-6 md:p-8 flex flex-row items-start gap-6 md:gap-8 border border-white/50 shadow-xl shadow-slate-200/40 transition-all hover:translate-y-[-4px] hover:shadow-2xl">
                                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] ${feature.bg} flex items-center justify-center shrink-0`}>
                                    <IconComponent className={`${feature.color}`} size={isMobile ? 28 : 44} />
                                </div>
                                <div className="flex flex-col items-start text-left flex-1">
                                    <h4 className="text-lg md:text-2xl font-black text-[#282d32] mb-2 tracking-tight">{feature.title}</h4>
                                    <p className="text-sm md:text-lg font-bold text-slate-400 leading-snug">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
