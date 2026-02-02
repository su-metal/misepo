"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';
import { CountUp } from './CountUp';

export const BenefitSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className="py-24 md:py-48 bg-[#f0eae4] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">The Market Gap</span>
                    <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.85] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                        なぜ、<br />
                        <span className="text-[#1823ff]">ミセポ？</span>
                    </h2>
                </div>

                <div className={`grid gap-12 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'} mb-32`}>
                    {/* Card 1 */}
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex items-baseline gap-4 text-[#282d32]">
                            <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums"><CountUp end={85} /></span>
                            <span className="text-2xl font-black">%</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#282d32]">採用力</h3>
                        <p className="text-lg font-bold text-slate-400 leading-tight">
                            若者の85%は、応募前に店主のSNSで「職場環境」を確かめています。
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-start gap-8">
                        <div className="flex items-baseline gap-4 text-[#1823ff]">
                            <span className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums">1.7</span>
                            <span className="text-2xl font-black">x</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#282d32]">信頼指数</h3>
                        <p className="text-lg font-bold text-slate-400 leading-tight">
                            丁寧なレスポンスがある店は、そうでない店に比べ、信頼度が1.7倍に跳ね上がります。
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-start gap-8 text-[#282d32]">
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl md:text-5xl font-black tracking-tighter leading-none">EVERY<br />OTHER</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#282d32]">機会損失</h3>
                        <p className="text-lg font-bold text-slate-400 leading-tight">
                            2人に1人が「最新情報が不明な店」への来店をあきらめた経験があります。
                        </p>
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
                            desc: "季節のイベントや地域のトレンドをAIが分析し、最適な投稿タイミングを提案。",
                            icon: "Calendar",
                            color: "text-[#FF6B6B]",
                            bg: "bg-[#FF6B6B]/5"
                        },
                        {
                            title: "独自の文体学習機能",
                            desc: "過去の投稿を学習し、あなたの口癖やリズムを忠実に再現。使うほど馴染みます。",
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
                            title: "Googleマップ口コミ返信",
                            desc: "誠実で温かい返信文をAIが丁寧に下書き。 MEO対策とファンづくりを同時に。",
                            icon: "MapPin",
                            color: "text-[#FF9F1C]",
                            bg: "bg-[#FF9F1C]/5"
                        },
                        {
                            title: "お店情報への完全最適化",
                            desc: "お店の基本情報を登録しておくだけで、全ての投稿があなたのビジネスに特化されます。",
                            icon: "Store",
                            color: "text-[#7F5AF0]",
                            bg: "bg-[#7F5AF0]/5"
                        }
                    ].map((feature, idx) => {
                        const IconComponent = Icons[feature.icon];
                        return (
                            <div key={idx} className="bg-white rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border border-white/50 shadow-xl shadow-slate-200/40 transition-all hover:translate-y-[-4px] hover:shadow-2xl">
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] ${feature.bg} flex items-center justify-center shrink-0`}>
                                    <IconComponent className={`${feature.color}`} size={isMobile ? 32 : 44} />
                                </div>
                                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                    <h4 className="text-xl md:text-2xl font-black text-[#282d32] mb-2 tracking-tight">{feature.title}</h4>
                                    <p className="text-base md:text-lg font-bold text-slate-400 leading-snug">
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
