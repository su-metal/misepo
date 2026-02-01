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
    return (
        <section id="problem" className={`${isMobile ? 'py-12' : 'py-20 md:py-32'} relative overflow-hidden`}>
            {/* Background Decor Removed */}

            <div className={`${isMobile ? 'w-full px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                <div className={`max-w-3xl mx-auto text-center ${isMobile ? 'mb-12' : 'mb-20'}`}>
                    <span className="inline-block py-1.5 px-4 bg-white border border-[var(--ichizen-blue)]/20 rounded-full text-[var(--ichizen-blue)] font-bold tracking-widest text-[10px] uppercase mb-8 shadow-sm">
                        Social Media Challenges
                    </span>
                    <h2 className={`font-bold text-slate-800 leading-tight ${isMobile ? 'text-2xl mb-4' : 'text-4xl md:text-6xl mb-8'}`}>
                        こんな毎日を、<br />
                        一人で抱えていませんか？
                    </h2>
                    <p className={`text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium ${isMobile ? 'text-xs' : 'text-lg'}`}>
                        閉店後の疲れた体でスマホを見つめる夜。<br className={isMobile ? '' : 'hidden md:block'} />
                        MisePoは、そんな「心の重荷」に寄り添います。
                    </p>
                </div>

                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                    {problems.map((prob, index) => (
                        <div key={index} className={`group relative bg-white border border-slate-100 rounded-[32px] shadow-lg shadow-slate-200/50 transition-all duration-300 ${isMobile ? 'p-6' : 'p-8 hover:-translate-y-2 hover:shadow-xl'}`}>
                            <div className={`flex flex-col items-center text-center ${isMobile ? 'gap-4' : 'gap-6'}`}>
                                <div className={`rounded-2xl ${prob.bg} flex items-center justify-center text-slate-700 shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                                    {React.cloneElement(prob.icon as any, { size: isMobile ? 24 : 32, className: "opacity-80" })}
                                </div>
                                <h3 className={`font-bold text-slate-800 whitespace-pre-line leading-tight ${isMobile ? 'text-base' : 'text-lg md:text-xl'}`}>{prob.title}</h3>
                            </div>
                            <div className="h-px w-full bg-slate-100 my-6" />
                            <p className={`text-slate-500 font-medium leading-relaxed text-center ${isMobile ? 'text-[11px]' : 'text-sm'}`}>{prob.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
