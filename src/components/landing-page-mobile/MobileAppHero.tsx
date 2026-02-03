"use client";
import React, { useState } from 'react';

export const MobileAppHero = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const totalSlides = 3;

    return (
        <div className="min-h-screen flex flex-col items-center justify-between py-12 px-6">

            {/* Top: Title */}
            <div className="text-center">
                <h2 className="text-[#1f29fc] font-bold text-sm tracking-wide mb-2">
                    AIなのに、あなたの言葉
                </h2>
            </div>

            {/* Center: Logo + Phone Mockup */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">

                {/* Hand-drawn Logo */}
                <div className="relative">
                    <svg width="200" height="80" viewBox="0 0 200 80" className="text-[#1f29fc]">
                        <path
                            d="M20,40 Q30,20 50,35 T80,40 M100,40 Q110,20 130,35 T160,40 M180,40 Q185,25 195,35"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            className="drop-shadow-lg"
                        />
                    </svg>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-black text-[#1f29fc] tracking-tight" style={{ fontFamily: 'cursive' }}>
                        MisePo
                    </div>
                </div>

                {/* Phone Mockup Placeholder */}
                <div className="relative w-64 h-[480px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-[40px] shadow-2xl overflow-hidden border-8 border-slate-800">
                    {/* Phone Screen */}
                    <div className="absolute inset-2 bg-white rounded-[32px] overflow-hidden">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-3xl"></div>

                        {/* Content Placeholder */}
                        <div className="pt-8 px-4 space-y-3">
                            <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-12 bg-[#1f29fc]/10 rounded-xl"></div>
                            <div className="h-12 bg-orange-100 rounded-xl"></div>
                            <div className="h-8 bg-slate-100 rounded"></div>
                            <div className="h-8 bg-slate-100 rounded"></div>
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-8 bg-slate-50 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-600 rounded-full"></div>
                </div>
            </div>

            {/* Bottom: Catchphrase + Pagination */}
            <div className="text-center space-y-6">
                <div>
                    <p className="text-[#122646] font-bold text-xl mb-2">
                        投稿作成も、思い出も、
                    </p>
                    <p className="text-slate-600 text-base font-medium">
                        毎日のあなたに寄り添う
                    </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex items-center justify-center gap-2">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeSlide
                                ? 'w-8 bg-[#1f29fc]'
                                : 'w-2 bg-slate-300'
                                }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
