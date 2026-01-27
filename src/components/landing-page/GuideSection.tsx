"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const GuideSection = () => {
    const steps = [
        {
            number: "01",
            title: "メモを入力",
            desc: "「ドーナツ新作」や「週末セール」など、思いついたことを1行書くだけでOK。",
            icon: <Icons.Smartphone className="text-black" />,
            bgColor: "bg-[#F5CC6D]",
            tag: "Simple"
        },
        {
            number: "02",
            title: "ポチッと生成",
            desc: "AIがあなたの意図を汲み取り、各SNSに最適な長さやハッシュタグを自動作成。",
            icon: <Icons.Zap className="text-black" size={24} />,
            bgColor: "bg-[#4DB39A]",
            tag: "Magic"
        },
        {
            number: "03",
            title: "こだわり設定",
            desc: "「自分らしさ」を追求したい時は、トーンの変更や自分専用の人格設定も可能です。",
            icon: <Icons.Sparkles className="text-black" />,
            bgColor: "bg-[#E88BA3]",
            tag: "Personal"
        }
    ];

    return (
        <section id="guide" className="py-20 md:py-32 bg-white border-b-[6px] border-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="bg-[#4DB39A] text-black font-black tracking-widest text-[10px] uppercase mb-6 px-4 py-2 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">Easy Guide</span>
                    <h2 className="text-4xl md:text-7xl font-black text-black mb-8 tracking-tight leading-tight italic">
                        使い方は、<br />
                        <span className="underline decoration-[8px] decoration-[#F5CC6D]">驚くほどカンタン。</span>
                    </h2>
                    <p className="text-black text-xl font-bold opacity-80 leading-relaxed">
                        ミセポなら、SNS投稿のためにスマホを前に<br className="hidden md:block" />
                        悩む必要はありません。
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                    {/* Decorative Connectors (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-1/3 right-1/3 h-[4px] bg-black -translate-y-1/2 -z-10" />

                    {steps.map((step, index) => (
                        <div key={index} className="group relative">
                            <div className="neo-brutalism-card p-8 h-full flex flex-col items-start hover:bg-[#f9f5f2] transition-colors">
                                <div className="absolute -top-6 -right-4 bg-black text-white px-4 py-1.5 border-[3px] border-black font-black italic shadow-[4px_4px_0px_0px_#4DB39A] rotate-3 group-hover:rotate-0 transition-transform">
                                    STEP {step.number}
                                </div>

                                <div className={`${step.bgColor} w-16 h-16 border-[3px] border-black rounded-2xl flex items-center justify-center mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform group-hover:scale-110 transition-transform`}>
                                    {step.icon}
                                </div>

                                <div className="inline-block px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-4">
                                    {step.tag}
                                </div>

                                <h3 className="text-2xl font-black text-black mb-4 tracking-tighter">{step.title}</h3>
                                <p className="text-black font-bold opacity-70 leading-relaxed">
                                    {step.desc}
                                </p>

                                {index === 2 && (
                                    <div className="mt-8 pt-8 border-t-2 border-black/5 w-full">
                                        <div className="bg-white border-[2px] border-black rounded-xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#E88BA3]/20 flex items-center justify-center">
                                                <Icons.Bot size={16} className="text-[#E88BA3]" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-full h-1.5 bg-black/5 rounded-full mb-1" />
                                                <div className="w-2/3 h-1.5 bg-black/5 rounded-full" />
                                            </div>
                                            <div className="w-8 h-4 bg-[#4DB39A] rounded-full" />
                                        </div>
                                        <p className="text-[10px] font-black text-black/40 mt-3 text-center uppercase tracking-widest">Advanced Customization</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
