"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const PWASection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section id="pwa" className="py-24 md:py-48 bg-[#f0eae4] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex flex-col mb-24 ${isMobile ? 'items-start text-left' : 'items-end text-right'}`}>
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">Anywhere, Anytime</span>
                    <h2 className={`font-black tracking-tighter leading-[0.9] text-[#282d32] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[5rem]'}`}>
                        場所を選ばない、<br />
                        <span className="text-[#1823ff]">自由な運用を。</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-slate-400 mt-12 max-w-2xl leading-tight">
                        ブラウザがあれば、そこがあなたの編集室。<br className="hidden md:block" />
                        スマホ、タブレット、PC。デバイスの垣根を超えます。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { title: "即座に起動", desc: "ロード時間ゼロ。思いついたその瞬間に投稿を作成できます。" },
                        { title: "アプリの操作感", desc: "PWA技術により、ホーム画面からアプリ感覚でサクサク起動。" },
                        { title: "マルチデバイス", desc: "店外ではスマホ、バックヤードではPC。全てが同期されます。" },
                        { title: "常に最新", desc: "更新作業は不要。常に最新のAIモデルがあなたを支えます。" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[40px] p-10 border border-slate-100 flex flex-col items-start transition-all hover:shadow-2xl hover:shadow-slate-200/50">
                            <div className="text-[10px] font-black text-[#1823ff] mb-8 uppercase tracking-widest">Feature 0{idx + 1}</div>
                            <h4 className="text-2xl font-black text-[#282d32] mb-6 tracking-tighter">{item.title}</h4>
                            <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
