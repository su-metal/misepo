"use client";
import React from 'react';

export const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-pink-100 rounded-full blur-[100px]" />
            </div>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase mb-3 block">User Voices</span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        ユーザーの声
                    </h2>
                    <p className="text-slate-600 text-lg max-w-xl mx-auto">
                        実際にMisePoを<br className="md:hidden" />ご利用いただいている店主様の声<br className="md:hidden" />をご紹介します。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-6 right-6 text-indigo-200">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-6 italic">
                            「AI特有の堅苦しさがなくて、<span className="text-indigo-600 font-bold not-italic">常連さんからも『最近の投稿、楽しそうですね』と声をかけられました</span>。」
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">☕</div>
                            <div>
                                <p className="font-bold text-slate-900">カフェオーナーさま</p>
                                <p className="text-sm text-slate-500">東京都渋谷区</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-indigo-100/50 border border-slate-100 relative group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-6 right-6 text-pink-200">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197L9.758 4.03c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997S4 10.79 4 11.13v.75A4.38 4.38 0 0 0 8.38 16.25c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05A4.37 4.37 0 0 0 8.38 7.65c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /><path d="M17.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35l.539-.222.474-.197-1.514-1.97c-.258.092-.47.166-.721.27-.257.085-.516.2-.765.325-.247.126-.479.282-.724.428-.2.162-.462.277-.638.48-.199.178-.379.393-.579.563a7 7 0 0 0-.653.888c-.169.259-.343.54-.482.829-.145.293-.236.63-.364.939-.116.33-.208.66-.275 1.002-.087.332-.128.67-.171.997s-.063.667-.063 1.007v.75a4.38 4.38 0 0 0 4.38 4.87c.57 0 1.13-.1 1.66-.3a4.37 4.37 0 0 0 2.66-4.01c0-1.17-.44-2.26-1.24-3.05a4.37 4.37 0 0 0-3.08-1.24c-.68 0-1.34.14-1.93.4a.5.5 0 0 0 .05.95z" /></svg>
                        </div>
                        <p className="text-slate-700 text-lg font-medium leading-relaxed mb-6 italic">
                            「スタッフ数人で運用していますが、<span className="text-pink-600 font-bold not-italic">誰が書いても『お店のトーン』が揃うのが安心</span>。任せられるようになりました。」
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">✂️</div>
                            <div>
                                <p className="font-bold text-slate-900">美容室オーナーさま</p>
                                <p className="text-sm text-slate-500">大阪府大阪市</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
