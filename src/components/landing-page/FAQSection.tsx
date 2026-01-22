"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface FAQ {
    q: string;
    a: string;
}

export const FAQSection = ({ faqs, openFaq, setOpenFaq }: { faqs: FAQ[]; openFaq: number | null; setOpenFaq: (idx: number | null) => void }) => {
    return (
        <section id="faq" className="py-24 bg-white border-b-[6px] border-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-6xl font-black text-center text-black mb-20 italic uppercase">
                    <span className="underline decoration-[8px] decoration-[#9B98C2]">よくある質問</span>
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-[3px] border-black rounded-2xl bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden group">
                            <button className="w-full px-8 py-6 text-left flex justify-between items-center bg-white group-hover:bg-[#f9f5f2]/30 transition-colors" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                                <span className="font-black text-black text-xl md:text-2xl uppercase tracking-tight">{faq.q}</span>
                                <div className={`w-10 h-10 border-[3px] border-black rounded-2xl flex items-center justify-center transition-all duration-300 ${openFaq === index ? 'bg-[#D4849A] text-white rotate-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black -rotate-180'}`}>
                                    <Icons.ChevronUp size={20} className="stroke-[4px]" />
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out border-black ${openFaq === index ? 'max-h-[500px] border-t-[3px] opacity-100 bg-[#f9f5f2]/50' : 'max-h-0 opacity-0'}`}>
                                <div className="px-8 py-8">
                                    <p className="text-black font-bold text-lg leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
