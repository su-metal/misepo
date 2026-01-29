"use client";
import React from 'react';

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-[#F9F7F2]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 bg-white text-[#9B8FD4] border border-[#9B8FD4]/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">User Voices</span>
                    <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-8 tracking-tight">
                        ユーザーの声
                    </h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
                        実際にMisePoを<br className="md:hidden" />ご利用いただいている店主様の声<br className="md:hidden" />をご紹介します。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* User 1 */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
                        <div className="absolute -top-4 -right-4 bg-[#F5CC6D]/20 text-[#F5CC6D] rounded-2xl p-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8">
                            「AI特有の堅苦しさがなくて、<span className="text-[#E88BA3] font-bold bg-[#E88BA3]/10 px-1 rounded">常連さんからも『最近の投稿、楽しそうですね』と声をかけられました</span>。」
                        </p>
                        <div className="flex items-center gap-5 border-t border-slate-100 pt-8">
                            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl shadow-inner border border-slate-100">☕</div>
                            <div>
                                <p className="font-bold text-slate-800 text-base">カフェオーナーさま</p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">東京都渋谷区</p>
                            </div>
                        </div>
                    </div>

                    {/* User 2 */}
                    <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative group hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300">
                        <div className="absolute -top-4 -right-4 bg-[#4DB39A]/20 text-[#4DB39A] rounded-2xl p-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-8">
                            「スタッフ数人で運用していますが、<span className="text-[#4DB39A] font-bold bg-[#4DB39A]/10 px-1 rounded">誰が書いても『お店のトーン』が揃うのが安心</span>。任せられるようになりました。」
                        </p>
                        <div className="flex items-center gap-5 border-t border-slate-100 pt-8">
                            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl shadow-inner border border-slate-100">✂️</div>
                            <div>
                                <p className="font-bold text-slate-800 text-base">美容室オーナーさま</p>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-0.5">大阪府大阪市</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
