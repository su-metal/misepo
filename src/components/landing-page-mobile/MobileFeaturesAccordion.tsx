"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

interface FeatureItem {
    id: number;
    emoji: string;
    title: string;
    description: string;
}

export const MobileFeaturesAccordion = () => {
    const [expandedId, setExpandedId] = useState<number | null>(1);

    const features: FeatureItem[] = [
        {
            id: 1,
            emoji: "🤖",
            title: "AI投稿案の自動作成",
            description: "あなたのお店に合わせた最適な投稿文をAIが提案。一から文章を考える手間をなくし、クリエイティブな時間を創出します。"
        },
        {
            id: 2,
            emoji: "📲",
            title: "SNS・マップ一括連携",
            description: "LINE, Instagram, X, Googleマップへワンタップで連携。複数のアプリを行き来することなく、一箇所ですべて完結します。"
        },
        {
            id: 3,
            emoji: "🤝",
            title: "お店の「らしさ」を学習", // matches screenshot emoji style partially
            description: "過去の投稿や店主のこだわりを学習。AIなのに感情がこもった、あなたらしい言葉のトーンを再現します。"
        },
        {
            id: 4,
            emoji: "🎨",
            title: "洗練された操作体験",
            description: "シンプルで見やすく、直感的に使えるインターフェース。スマートフォンの隙間時間で、日々の運用を楽しく管理できます。"
        }
    ];

    const toggleFeature = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section className="bg-[var(--ichizen-beige)] py-12 px-6">
            <div className="space-y-4">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className={`bg-white rounded-[32px] overflow-hidden transition-all duration-300 shadow-sm border ${expandedId === feature.id ? 'border-[var(--ichizen-blue)] shadow-md' : 'border-transparent'}`}
                    >
                        {/* Header */}
                        <button
                            onClick={() => toggleFeature(feature.id)}
                            className="w-full text-left p-6 flex items-center justify-between group"
                        >
                            <div className="space-y-1">
                                <p className="text-[var(--ichizen-blue)] font-black text-[10px] tracking-widest uppercase">
                                    Feature. {feature.id}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{feature.emoji}</span>
                                    <h3 className="text-slate-800 font-black text-lg">
                                        {feature.title}
                                    </h3>
                                </div>
                            </div>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${expandedId === feature.id ? 'bg-[var(--ichizen-blue)] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                {expandedId === feature.id ? <Icons.ChevronUp size={20} /> : <Icons.ChevronDown size={20} />}
                            </div>
                        </button>

                        {/* Expandable Content */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedId === feature.id ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-6 pb-6 space-y-6">
                                {/* Dotted line separator */}
                                <div className="flex justify-center h-4 items-center">
                                    <div className="w-full flex justify-around opacity-20">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--ichizen-blue)]"></div>
                                        ))}
                                    </div>
                                </div>

                                <p className="text-slate-600 text-sm font-bold leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Placeholder Image/Illustration like in screenshot */}
                                <div className="relative aspect-[4/3] bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                                    <div className="relative z-10 flex flex-col items-center gap-2 opacity-30">
                                        <div className="w-32 h-48 bg-white rounded-xl shadow-lg border border-slate-200 relative overflow-hidden">
                                            <div className="h-4 w-full bg-slate-50 flex items-center px-2 gap-1">
                                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                            </div>
                                            <div className="p-2 space-y-2">
                                                <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
                                                <div className="h-20 bg-slate-50 rounded-lg"></div>
                                                <div className="grid grid-cols-2 gap-1">
                                                    <div className="h-8 bg-[var(--ichizen-blue)]/5 rounded-md"></div>
                                                    <div className="h-8 bg-[var(--ichizen-green)]/5 rounded-md"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
