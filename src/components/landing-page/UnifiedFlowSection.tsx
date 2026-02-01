"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const UnifiedFlowSection = () => {
    return (
        <section id="flow" className="py-24 md:py-48 bg-[#F4F6F9] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">The Workflow</span>
                    <h2 className="text-7xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] text-[#282d32]">
                        作成から投稿まで、<br />
                        <span className="text-[#1823ff]">淀みなく。</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-slate-400 mt-12 max-w-2xl leading-tight">
                        アイデアが、一瞬でフォロワーに届く。<br className="hidden md:block" />
                        そのための全ての工程を、圧倒的に短縮します。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { step: "01", title: "MEMO", desc: "箇条書きや断片的なメモでOK。AIが文脈を深く読み取ります。" },
                        { step: "02", title: "GENERATE", desc: "ボタン一つで、プロ顔負けの文章が数秒で完成します。" },
                        { step: "03", title: "POST", desc: "各SNSへの最適化。あとは確認して投稿するだけです。" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 flex flex-col items-start text-left group">
                            <div className="text-[10px] font-black text-[#1823ff] mb-8 uppercase tracking-widest">Step {item.step}</div>
                            <h3 className="text-4xl md:text-5xl font-black text-[#282d32] mb-6 tracking-tighter transition-all group-hover:translate-x-2">{item.title}</h3>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
