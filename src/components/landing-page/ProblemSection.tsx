"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface Problem {
    icon: React.ReactElement;
    title: string;
    desc: string;
    bg: string;
    delay: number;
}

export const ProblemSection = ({ problems, isMobile = false }: { problems: Problem[]; isMobile?: boolean }) => {
    const NoiseOverlay = () => (
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
    );

    return (
        <section id="problem" className="py-24 md:py-48 bg-[#f0eae4] relative overflow-hidden">
            <NoiseOverlay />
            {/* Background Text Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] select-none">
                <div className="text-[20rem] md:text-[40rem] font-black leading-none tracking-tighter">OVERWHELMED?</div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/5 rounded-full border border-[#1823ff]/10">The Struggle</span>
                    <h2 className={`font-black text-[#282d32] tracking-tighter leading-[0.85] ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                        日常を、<br />
                        <span className="text-[#1823ff]">物語に。</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-slate-400 mt-12 max-w-2xl leading-tight">
                        こんな悩みありませんか？<br />
                        「今日は常連さんが笑顔で帰ってくれた」と伝えたいのに時間がない。<br />
                        「新しいメニュー、思った以上に好評だった」を手早く届けられない。<br />
                        何気ない一日を、ファンに見せる言葉にまとめられずに終わってしまう。
                    </p>
                </div>

                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                    {problems.map((prob, index) => (
                        <div key={index} className="bg-white rounded-[48px] p-10 md:p-16 border border-slate-100 flex flex-col items-start text-left group">
                            <div className="text-[10px] font-black text-slate-300 mb-8 uppercase tracking-widest">Case 0{index + 1}</div>
                            <h3 className="text-3xl md:text-4xl font-black text-[#282d32] mb-6 leading-tight whitespace-pre-line">{prob.title}</h3>
                            <p className="text-lg font-bold text-slate-400 leading-tight">
                                {prob.desc.replace(/\\n/g, '')}
                            </p>
                            <div className="mt-12 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[#1823ff] group-hover:scale-110 transition-all">
                                    {React.cloneElement(prob.icon as any, { size: 24 })}
                                </div>
                                <span className="text-xs font-black text-[#1823ff] uppercase tracking-widest">Solve it with MisePo</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
