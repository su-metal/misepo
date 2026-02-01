"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const MobilePricing = () => {
    const plans = [
        {
            id: 1,
            name: "Light",
            price: "980",
            count: "50",
            color: "bg-white",
            borderColor: "border-slate-200",
            textColor: "text-slate-800",
            recommended: false
        },
        {
            id: 2,
            name: "Standard",
            price: "1,980",
            count: "150",
            color: "bg-[var(--ichizen-blue)]",
            borderColor: "border-[var(--ichizen-blue)]",
            textColor: "text-white",
            recommended: true
        },
        {
            id: 3,
            name: "Pro",
            price: "2,980",
            count: "300",
            color: "bg-white",
            borderColor: "border-slate-200",
            textColor: "text-slate-800",
            recommended: false
        }
    ];

    return (
        <section className="bg-slate-50 py-20 px-6">
            <div className="text-center mb-12">
                <h2 className="text-[var(--ichizen-blue)] text-4xl font-black mb-4">
                    PLAN
                </h2>
                <p className="text-slate-600 font-bold text-sm">
                    お店の規模に合わせて選べる<br />
                    3つのプランをご用意しました。
                </p>
            </div>

            <div className="space-y-6 max-w-sm mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative rounded-[32px] p-6 shadow-lg border-2 ${plan.borderColor} ${plan.color} transition-transform hover:scale-105 duration-300`}
                    >
                        {plan.recommended && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--ichizen-green)] text-white text-xs font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider">
                                Recommended
                            </div>
                        )}

                        <div className={`flex justify-between items-center mb-4 ${plan.textColor}`}>
                            <h3 className="font-black text-xl uppercase tracking-wider">{plan.name}</h3>
                            {plan.recommended ? <Icons.Star size={24} fill="currentColor" /> : <div className="w-6" />}
                        </div>

                        <div className={`flex items-baseline gap-1 mb-6 ${plan.textColor}`}>
                            <span className="text-sm font-bold opacity-80">¥</span>
                            <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                            <span className="text-xs font-bold opacity-60">/ 月</span>
                        </div>

                        <div className={`space-y-3 mb-8 ${plan.textColor === 'text-white' ? 'bg-white/10' : 'bg-slate-100'} p-4 rounded-2xl`}>
                            <div className="flex justify-between items-center">
                                <span className={`text-xs font-bold ${plan.textColor === 'text-white' ? 'text-white/80' : 'text-slate-500'}`}>生成回数</span>
                                <span className={`text-lg font-black ${plan.textColor}`}>{plan.count}回 <span className="text-xs font-normal opacity-70">/ 月</span></span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-6 px-2">
                            <li className={`flex items-center gap-3 text-xs font-bold ${plan.textColor === 'text-white' ? 'text-white/90' : 'text-slate-600'}`}>
                                <Icons.Check size={16} className={plan.textColor === 'text-white' ? 'text-[var(--ichizen-green)]' : 'text-[var(--ichizen-blue)]'} />
                                <span>全機能利用可能</span>
                            </li>
                            <li className={`flex items-center gap-3 text-xs font-bold ${plan.textColor === 'text-white' ? 'text-white/90' : 'text-slate-600'}`}>
                                <Icons.Check size={16} className={plan.textColor === 'text-white' ? 'text-[var(--ichizen-green)]' : 'text-[var(--ichizen-blue)]'} />
                                <span>いつでも解約OK</span>
                            </li>
                        </ul>

                        <button className={`w-full py-4 rounded-xl font-black text-sm shadow-lg transition-transform active:scale-95 ${plan.textColor === 'text-white' ? 'bg-white text-[var(--ichizen-blue)]' : 'bg-[var(--ichizen-blue)] text-white hover:bg-[var(--ichizen-blue)]/90'}`}>
                            このプランではじめる
                        </button>
                    </div>
                ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-8 leading-relaxed">
                ※ 価格は全て税込です。<br />
                ※ 生成回数は翌月に繰り越されません。<br />
                ※ 初回登録時は無料トライアル（50回分）が付与されます。
            </p>
        </section>
    );
};
