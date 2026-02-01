"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

export const TestimonialsSection = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <section className={`${isMobile ? 'py-12' : 'py-24'} bg-[#F9F7F2]`}>
            <div className={`${isMobile ? 'w-full px-4' : 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                <div className={`${isMobile ? 'mb-12' : 'mb-20'} text-center`}>
                    <span className="inline-block px-4 py-1.5 bg-white text-[var(--ichizen-blue)] border border-[var(--ichizen-blue)]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">User Voices</span>
                    <h2 className={`font-bold text-slate-800 tracking-tight ${isMobile ? 'text-2xl mb-4' : 'text-4xl md:text-6xl mb-8'}`}>
                        ユーザーの声
                    </h2>
                    <p className={`text-slate-500 font-medium max-w-xl mx-auto ${isMobile ? 'text-sm' : 'text-lg'}`}>
                        実際にMisePoを<br className={isMobile ? '' : 'md:hidden'} />ご利用いただいている店主様の声<br className={isMobile ? '' : 'md:hidden'} />をご紹介します。
                    </p>
                </div>

                <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                    {/* User 1 */}
                    <div className={`bg-white border border-slate-100 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group transition-all duration-300 ${isMobile ? 'p-6' : 'p-10 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                        <div className="absolute top-4 right-4 text-[var(--ichizen-green)]/30">
                            <Icons.MessageCircle size={isMobile ? 24 : 32} />
                        </div>
                        <p className={`text-slate-700 font-medium leading-relaxed ${isMobile ? 'text-sm mb-6' : 'text-lg mb-8'}`}>
                            「AI特有の堅苦しさがなくて、<span className="text-[var(--ichizen-blue)] font-bold bg-[var(--ichizen-blue)]/5 px-1 rounded">常連さんからも『最近の投稿、楽しそうですね』と声をかけられました</span>。」
                        </p>
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                            <div className={`bg-slate-50 rounded-full flex items-center justify-center shadow-inner border border-slate-100 ${isMobile ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl'}`}>☕</div>
                            <div>
                                <p className={`font-bold text-slate-800 ${isMobile ? 'text-sm' : 'text-base'}`}>カフェオーナーさま</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">東京都渋谷区</p>
                            </div>
                        </div>
                    </div>

                    {/* User 2 */}
                    <div className={`bg-white border border-slate-100 rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group transition-all duration-300 ${isMobile ? 'p-6' : 'p-10 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'}`}>
                        <div className="absolute top-4 right-4 text-[var(--ichizen-green)]/30">
                            <Icons.MessageCircle size={isMobile ? 24 : 32} />
                        </div>
                        <p className={`text-slate-700 font-medium leading-relaxed ${isMobile ? 'text-sm mb-6' : 'text-lg mb-8'}`}>
                            「スタッフ数人で運用していますが、<span className="text-[var(--ichizen-blue)] font-bold bg-[var(--ichizen-blue)]/5 px-1 rounded">誰が書いても『お店のトーン』が揃うのが安心</span>。任せられるようになりました。」
                        </p>
                        <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                            <div className={`bg-slate-50 rounded-full flex items-center justify-center shadow-inner border border-slate-100 ${isMobile ? 'w-10 h-10 text-lg' : 'w-14 h-14 text-2xl'}`}>✂️</div>
                            <div>
                                <p className={`font-bold text-slate-800 ${isMobile ? 'text-sm' : 'text-base'}`}>美容室オーナーさま</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">大阪府大阪市</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
