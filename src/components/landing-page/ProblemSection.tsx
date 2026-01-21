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

export const ProblemSection = ({ problems, isMobile }: { problems: Problem[]; isMobile: boolean }) => {
    return (
        <section id="problem" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-6">
                        Social Media Challenges
                    </span>
                    <h2 className="text-3xl md:text-6xl font-black text-slate-900 leading-[1.2] md:leading-[1.1] mb-6 md:mb-8">
                        こんな毎日を、<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">一人で抱えていませんか？</span>
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        閉店後の疲れた体でスマホを見つめる夜。<br className="hidden md:block" />
                        AIを使ってみたけれど、どこか自分らしくない文章への違和感。<br className="hidden md:block" />
                        MisePoは、あなたのそんな「心の重荷」に寄り添うために生まれました。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {problems.map((prob, index) => (
                        <div key={index} className="group relative bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300">
                            <div className="flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0">
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl ${prob.bg} flex items-center justify-center md:mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0`}>
                                    {React.cloneElement(prob.icon as any, { size: isMobile ? 24 : 28 })}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-slate-900 whitespace-pre-line leading-tight">{prob.title}</h3>
                            </div>
                            <div className="h-px w-full bg-slate-100 my-4 md:my-4 group-hover:bg-indigo-100 transition-all duration-500" />
                            <p className="text-sm text-slate-500 leading-relaxed md:text-center">{prob.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
