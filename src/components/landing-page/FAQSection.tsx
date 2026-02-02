"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface FAQ {
    q: string;
    a: string;
}

export const FAQSection = ({ faqs, openFaq, setOpenFaq, isMobile = false }: { faqs: FAQ[]; openFaq: number | null; setOpenFaq: (idx: number | null) => void; isMobile?: boolean }) => {
    const NoiseOverlay = () => (
        <div className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Map%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
    );

    return (
        <section id="faq" className="py-24 md:py-48 bg-[#282d32] text-white relative overflow-hidden">
            <NoiseOverlay />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1823ff]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-[#1823ff] uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-[#1823ff]/10 rounded-full border border-[#1823ff]/20">Frequently Asked</span>
                    <h2 className={`font-black tracking-tighter leading-[0.85] text-white ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[8rem]'}`}>
                        不安を、<br />
                        <span className="text-[#1823ff]">安心に。</span>
                    </h2>
                </div>

                <div className="max-w-4xl space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className={`border border-white/5 rounded-[32px] overflow-hidden transition-all duration-500 ${openFaq === idx ? 'bg-white/5' : 'bg-transparent'}`}>
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full p-8 md:p-12 flex items-center justify-between text-left group"
                            >
                                <span className="text-xl md:text-2xl font-black pr-8">{faq.q}</span>
                                <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-500 ${openFaq === idx ? 'rotate-180 bg-white text-[#282d32]' : ''}`}>
                                    <Icons.ChevronDown size={16} />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${openFaq === idx ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-8 md:p-12 pt-0">
                                    <p className="text-lg font-bold text-slate-400 leading-tight">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
