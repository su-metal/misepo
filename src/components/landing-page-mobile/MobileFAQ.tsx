"use client";
import React, { useState } from 'react';
import { Icons } from '../LandingPageIcons';

const faqs = [
    { q: "AIっぽくなりませんか？", a: "過去の投稿を学習するため、あなたの口癖まで再現されます。" },
    { q: "操作は難しいですか？", a: "メモを1行打つだけです。LINEを使う感覚で操作できます。" },
    { q: "無料期間に解約できますか？", a: "はい、期間内であれば料金は一切かかりません。" },
];

export const MobileFAQ = () => {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-[#122646] text-lg mb-6 text-center">よくある質問</h3>
            <div className="space-y-3">
                {faqs.map((item, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setOpen(open === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 text-left"
                        >
                            <span className={`text-xs font-bold transition-colors ${open === idx ? 'text-[#1f29fc]' : 'text-[#122646]'}`}>{item.q}</span>
                            <Icons.ChevronDown size={14} className={`text-slate-400 transition-transform ${open === idx ? 'rotate-180 text-[#1f29fc]' : ''}`} />
                        </button>
                        <div className={`bg-white text-xs text-slate-500 leading-relaxed px-4 transition-all duration-300 ${open === idx ? 'py-4 max-h-40' : 'py-0 max-h-0 overflow-hidden'}`}>
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
