"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface FAQ {
    q: string;
    a: string;
}

export const FAQSection = ({ faqs, openFaq, setOpenFaq }: { faqs: FAQ[]; openFaq: number | null; setOpenFaq: (idx: number | null) => void }) => {
    return (
        <section id="faq" className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-800 mb-16 tracking-tight">
                    <span className="bg-gradient-to-r from-[#9B8FD4] to-[#9B8FD4]/70 bg-clip-text text-transparent">よくある質問</span>
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:border-[#9B8FD4]/30 hover:shadow-lg hover:shadow-[#9B8FD4]/5">
                            <button
                                className="w-full px-8 py-6 text-left flex justify-between items-center bg-white hover:bg-slate-50/50 transition-colors"
                                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                aria-expanded={openFaq === index}
                            >
                                <span className={`font-bold text-lg md:text-xl transition-colors duration-300 ${openFaq === index ? 'text-[#9B8FD4]' : 'text-slate-800'}`}>
                                    {faq.q}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${openFaq === index ? 'bg-[#9B8FD4] text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                    <Icons.ChevronUp size={20} />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 pb-8 pt-0">
                                    <p className="text-slate-500 font-medium text-base leading-relaxed border-t border-slate-100 pt-6">{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
