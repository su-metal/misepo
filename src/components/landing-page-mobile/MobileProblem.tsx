"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

const problems = [
    {
        icon: <Icons.Moon size={20} className="text-white" />,
        title: "閉店後のSNS作業",
        desc: "疲れた体でスマホを見つめて、手が止まる。そんな夜はもう終わりにしませんか。",
        bg: "bg-[#1f29fc]"
    },
    {
        icon: <Icons.Bot size={20} className="text-white" />,
        title: "AI特有の違和感",
        desc: "丁寧すぎて「自分らしくない」。MisePoなら、あなたの口癖や話し方を再現します。",
        bg: "bg-[#eb714f]"
    },
    {
        icon: <Icons.MessageCircle size={20} className="text-white" />,
        title: "クチコミ返信の放置",
        desc: "言葉が見つからず、気づけば数週間。お客様との絆を30秒で紡ぎ直せます。",
        bg: "bg-[#00b900]"
    },
];

export const MobileProblem = () => {
    return (
        <section className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
                <h3 className="font-bold text-xl text-[#122646]">こんなお悩み<br />ありませんか？</h3>
            </div>

            <div className="space-y-4">
                {problems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className={`${item.bg} p-2.5 rounded-xl shadow-md shrink-0 mt-0.5`}>
                            {item.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-[#122646] text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
