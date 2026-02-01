"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobileDetailedFeatures = () => {
    const features = [
        {
            id: 1,
            title: "トレンドキーワード検索",
            desc: "地域や業種を入力するだけで、今SNSで話題のキーワードをランキング形式で表示。人々の興味関心を逃さずキャッチできます。",
            icon: Icons.Search,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            id: 2,
            title: "競合店の投稿分析",
            desc: "気になるライバル店がどんな投稿をして反応を得ているかを分析。良い点を参考にしつつ、差別化のアドバイスも提案します。",
            icon: Icons.TrendingUp,
            color: "bg-purple-100 text-purple-600"
        },
        {
            id: 3,
            title: "天気・イベント連動",
            desc: "「明日は雨だから雨の日クーポンを」「来週は近くで花火大会」など、気象条件や地域イベントに合わせた投稿内容を自動生成。",
            icon: Icons.Sparkles,
            color: "bg-blue-100 text-blue-600"
        },
        {
            id: 4,
            title: "複数店舗の一括管理",
            desc: "各店舗のSNSアカウントをまとめて管理。店舗ごとの反応比較や、全店共通のお知らせ配信もワンタップで完了します。",
            icon: Icons.Settings,
            color: "bg-green-100 text-green-600"
        }
    ];

    return (
        <section className="bg-slate-50 py-20 px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-50 z-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--ichizen-blue)]/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[var(--ichizen-green)]/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center mb-12">
                <p className="text-[var(--ichizen-blue)] font-bold text-sm mb-2">もっと便利になる特別な機能</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <h2 className="text-[var(--ichizen-blue)] text-6xl font-black italic tracking-tighter">
                        MisePo
                    </h2>
                    <span className="text-[var(--ichizen-blue)] text-6xl font-black">+</span>
                </div>

                {/* Checkmark Stamp Graphic */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10 rotate-12 pointer-events-none">
                    <svg width="200" height="200" viewBox="0 0 100 100" fill="currentColor" className="text-[var(--ichizen-blue)]">
                        <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm20 35L45 60l-15-15-5 5 20 20 30-30-5-5z" />
                    </svg>
                </div>

                <p className="text-slate-600 text-sm font-bold leading-relaxed max-w-[300px] mx-auto">
                    スタンダードプランに加え、AIによる高度な分析や自動化機能で、
                    お店のファン作りをさらに加速させます。
                </p>
            </div>

            <div className="space-y-4 relative z-10 pb-12">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className={`shrink-0 w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center`}>
                            <feature.icon size={28} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-black text-slate-800 text-lg leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-4">
                <button className="w-full bg-white text-[var(--ichizen-text)] font-black py-5 rounded-full shadow-lg border border-slate-100 flex items-center justify-center gap-2 group active:scale-95 transition-transform hover:shadow-xl">
                    <span>MisePo + の詳細をみる</span>
                    <div className="bg-[var(--ichizen-text)] text-white p-1 rounded-full group-hover:bg-[var(--ichizen-blue)] transition-colors">
                        <Icons.Plus size={16} />
                    </div>
                </button>
            </div>
        </section>
    );
};
