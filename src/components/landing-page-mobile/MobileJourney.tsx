"use client";
import React from 'react';

export const MobileJourney = () => {
    return (
        <section className="relative bg-[#1f29fc] text-white overflow-hidden">
            {/* Top Curve */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-[#b2d4ea] rounded-b-[50%] transform scale-x-150 -translate-y-1/2"></div>

            {/* Mascot at the top */}
            <div className="relative z-10 flex justify-center -mt-8 mb-12">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-[#1f29fc] shadow-xl overflow-hidden">
                    {/* Placeholder for Dog Mascot */}
                    <span className="text-4xl">🐶</span>
                </div>
            </div>

            <div className="px-6 py-12 space-y-24 relative">
                {/* SVG Dotted Line Background */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 400 1200" fill="none" className="opacity-30">
                        <path
                            d="M300,50 Q400,300 100,600 T300,900"
                            stroke="white"
                            strokeWidth="4"
                            strokeDasharray="8 12"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                {/* Section 1 */}
                <div className="relative z-10 flex flex-col space-y-6">
                    <div className="w-2/3">
                        <p className="text-lg font-bold leading-relaxed">
                            毎日のSNS運用を<br />
                            管理するためのツールは、<br />
                            あなたのお店にもっと<br />
                            寄り添うことができます。
                        </p>
                    </div>
                    <div className="self-end w-2/3 pr-4">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl rotate-3 transform hover:rotate-0 transition-transform duration-500 aspect-square flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="text-xs uppercase font-bold tracking-widest">Image 1</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="relative z-10 flex flex-col space-y-6">
                    <div className="self-start w-2/3 pl-4">
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl -rotate-3 transform hover:rotate-0 transition-transform duration-500 aspect-square flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="text-xs uppercase font-bold tracking-widest">Image 2</span>
                            </div>
                        </div>
                    </div>
                    <div className="self-end text-right w-2/3">
                        <p className="text-xl font-black mb-2 whitespace-nowrap">「SNS更新が大変だった」</p>
                        <p className="text-xl font-black whitespace-nowrap">「一言が出てこなかった」</p>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="relative z-10 flex flex-col items-center space-y-8 pb-20">
                    <div className="text-center max-w-[280px]">
                        <p className="text-sm font-bold leading-relaxed">
                            スタッフと一緒にお店を<br />
                            盛り上げるときも、<br />
                            一人で静かに開店準備を<br />
                            するときも、店主の想いは<br />
                            いつでも発信できる、届く。
                        </p>
                    </div>
                    <div className="w-full px-4">
                        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl transform rotate-1 aspect-[4/3] flex items-center justify-center">
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <span className="text-xs uppercase font-bold tracking-widest">Product Shot</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Curve */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#b2d4ea] rounded-t-[50%] transform scale-x-150 translate-y-1/2"></div>
        </section>
    );
};
