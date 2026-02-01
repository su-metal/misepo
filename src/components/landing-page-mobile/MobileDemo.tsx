"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

const scenarios = [
    { id: 'insta', label: 'Instagram', icon: <Icons.Instagram size={14} />, result: "✨新作ドーナツ登場！✨\nふわふわ食感のハニーディップ🍯\n\n#misepo #新作 #ドーナツ" },
    { id: 'line', label: 'LINE', icon: <Icons.MessageCircle size={14} />, result: "＼週末限定クーポン🎉／\n\nこんにちは！MisePoカフェです☕\n今週末だけ使える50円OFFクーポンをお届け🎁\n\nぜひ遊びに来てくださいね！" },
    { id: 'gmap', label: '返信', icon: <Icons.MapPin size={14} />, result: "高評価ありがとうございます！\n気に入っていただけて嬉しいです😊\nまたのご来店をお待ちしております。" },
];

export const MobileDemo = () => {
    const [active, setActive] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 1500);
    };

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">30秒で投稿作成</h3>
                <p className="text-xs text-slate-500 mt-2">モードを選んでタップするだけ。</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide justify-center">
                {scenarios.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setActive(idx)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${active === idx
                                ? 'bg-[var(--ichizen-blue)] text-white shadow-md'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        {s.icon}
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Editor Mock */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 h-48 relative">
                {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10 rounded-2xl">
                        <Icons.Sparkles className="animate-spin text-[var(--ichizen-blue)] mb-2" />
                        <span className="text-xs font-bold text-slate-400">AI思考中...</span>
                    </div>
                ) : (
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {scenarios[active].result}
                    </div>
                )}
            </div>

            <button
                onClick={handleGenerate}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <Icons.Sparkles size={16} className="text-[#F5CC6D]" />
                <span className="text-sm">AIで生成する</span>
            </button>

        </section>
    );
};
