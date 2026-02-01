"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface FAQ {
    q: string;
    a: string;
}

export const FAQSection = ({ faqs, openFaq, setOpenFaq, isMobile = false }: { faqs: FAQ[]; openFaq: number | null; setOpenFaq: (idx: number | null) => void; isMobile?: boolean }) => {
    return (
        <section id="faq" className={`${isMobile ? 'py-12' : 'py-24'} bg-white`}>
            <div className={`${isMobile ? 'w-full px-4' : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
                <h2 className={`font-bold text-center text-slate-800 tracking-tight ${isMobile ? 'text-2xl mb-8' : 'text-4xl md:text-6xl mb-16'}`}>
                    <span className="bg-[var(--ichizen-blue)] bg-clip-text text-transparent">よくある質問</span>
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:border-[#9B8FD4]/30 hover:shadow-lg hover:shadow-[#9B8FD4]/5">
                            <button
                                className={`w-full text-left flex justify-between items-center bg-white hover:bg-slate-50/50 transition-colors ${isMobile ? 'px-6 py-4' : 'px-8 py-6'}`}
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                aria-expanded={openFaq === index}
                            >
                                <span className={`font-bold transition-colors duration-300 ${isMobile ? 'text-base' : 'text-lg md:text-xl'} ${openFaq === index ? 'text-[var(--ichizen-blue)]' : 'text-slate-800'}`}>
                                    {faq.q}
                                </span>
                                <div className={`rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} ${openFaq === index ? 'bg-[var(--ichizen-blue)] text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                    <Icons.ChevronUp size={isMobile ? 16 : 20} />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className={`${isMobile ? 'px-6 pb-6' : 'px-8 pb-8'} pt-0`}>
                                    <p className={`text-slate-500 font-medium leading-relaxed border-t border-slate-100 ${isMobile ? 'text-sm pt-4' : 'text-base pt-6'}`}>{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
