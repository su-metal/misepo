"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface DemoScenario {
    id: string;
    label: string;
    modeBadge: string;
    input: string;
    result: string;
}

interface DemoSectionProps {
    demoScenarios: DemoScenario[];
    activeScenarioIdx: number;
    setActiveScenarioIdx: (idx: number) => void;
    isDemoGenerating: boolean;
    demoResult: string;
    handleDemoGenerate: () => void;
}

export const DemoSection = ({
    demoScenarios,
    activeScenarioIdx,
    setActiveScenarioIdx,
    demoResult,
    isDemoGenerating,
    handleDemoGenerate
}: DemoSectionProps) => {
    const activeScenario = demoScenarios[activeScenarioIdx];
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when demoResult changes (and is not empty)
    React.useEffect(() => {
        if (demoResult && scrollRef.current) {
            // Slight delay to ensure rendering is complete
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                        top: scrollRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [demoResult]);

    return (
        <section id="demo" className="py-24 bg-[#F9F7F2] text-slate-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 skew-y-3 transform origin-top-left z-0 h-full" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-white border border-[#E88BA3]/20 rounded-full text-[#E88BA3] text-sm font-bold tracking-widest shadow-sm mb-6">
                        AI DEMO
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-800 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">AIの実力を、</span><br className="md:hidden" />
                        <span className="text-[#E88BA3]">今すぐ体験。</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
                        利用シーンに合わせて、MisePoの生成クオリティをチェック。<br />
                        まるでプロが書いたような文章が、一瞬で生まれます。
                    </p>
                </div>

                {/* Scenario Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {demoScenarios.map((scenario, idx) => (
                        <button
                            key={scenario.id}
                            onClick={() => setActiveScenarioIdx(idx)}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeScenarioIdx === idx
                                ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20 scale-105'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 shadow-sm border border-slate-100'
                                }`}
                        >
                            {scenario.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[600px] relative border border-slate-100">
                    <div className="p-6 sm:p-10 md:w-1/2 md:border-r border-slate-100 flex flex-col bg-white">
                        <div className="flex items-center justify-between mb-8">
                            <label className="text-xl font-bold text-slate-800">投稿メモを入力</label>
                            <span className="text-xs font-bold text-white bg-slate-800 rounded-full px-3 py-1">{activeScenario.modeBadge}</span>
                        </div>
                        <div className="relative mb-8 group flex-1">
                            <textarea
                                className="w-full h-full min-h-[200px] p-6 bg-slate-50 rounded-3xl text-slate-600 font-bold focus:outline-none resize-none text-lg leading-relaxed border-2 border-transparent focus:border-[#E88BA3]/20 focus:bg-white transition-all"
                                readOnly
                                value={activeScenario.input}
                            />
                        </div>
                        <button
                            onClick={handleDemoGenerate}
                            disabled={isDemoGenerating}
                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${isDemoGenerating
                                ? 'bg-slate-100 text-slate-400 cursor-wait'
                                : 'bg-[#E88BA3] text-white shadow-xl shadow-[#E88BA3]/30 hover:shadow-[#E88BA3]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
                                }`}
                        >
                            {isDemoGenerating ? (
                                <><Icons.Sparkles size={24} className="animate-spin" /> 生成中...</>
                            ) : (
                                <><Icons.Sparkles size={24} className="group-hover:animate-pulse" /> AIで文章を生成する</>
                            )}
                        </button>
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Icons.Zap size={18} className="text-[#F5CC6D]" fill="currentColor" />
                                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">MisePo Features</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                {["Instagram / X 同時作成", "公式LINE 配信作成", "Googleマップ クチコミ返信", "AIお手本学習 (分身機能)"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                        <Icons.CheckCircle size={14} className="text-[#4DB39A] shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/2 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50">
                        <div className="absolute inset-0 bg-[#E88BA3]/5" />

                        {/* Abstract Canvas for Result */}
                        <div className="w-full max-w-sm relative z-10 perspective-1000">
                            <div className="bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-6 min-h-[480px] flex flex-col relative transition-transform duration-500 hover:scale-[1.02]">
                                {demoResult && (
                                    <div className="absolute -top-3 -right-3 z-50 pointer-events-none">
                                        <div className="bg-[#4DB39A] text-white px-3 py-1.5 rounded-full font-bold shadow-lg shadow-[#4DB39A]/20 flex items-center gap-1.5 whitespace-nowrap animate-in slide-in-from-bottom-4 fade-in duration-300">
                                            <Icons.CheckCircle size={16} />
                                            <span className="text-xs">Generated!</span>
                                        </div>
                                    </div>
                                )}

                                {activeScenario.id === "google_maps" ? (
                                    /* Google Maps Abstract View */
                                    <div className="flex flex-col h-full">
                                        <div className="mb-4 pb-4 border-b border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">U</div>
                                                <span className="font-bold text-sm text-slate-700">Yuki Sato</span>
                                            </div>
                                            <div className="flex gap-0.5 text-[#F5CC6D] mb-2"><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /><Icons.Star size={12} fill="currentColor" /></div>
                                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">「初めて来ましたが、ドーナツがふわふわで最高でした！コーヒーも深みがあって好みです。また来ます！」</p>
                                        </div>
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="bg-blue-50/50 p-6 rounded-2xl relative">
                                                <div className="text-[10px] font-bold text-blue-400 uppercase mb-2 tracking-wider">Owner Response</div>
                                                <div className={`text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ${demoResult ? 'opacity-100' : 'opacity-40'}`}>
                                                    {isDemoGenerating ? (
                                                        <span className="animate-pulse">AIが最適な返信を思考中...</span>
                                                    ) : demoResult || "ここにAIの返信が表示されます..."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeScenario.id === "line" ? (
                                    /* LINE Abstract View */
                                    <div className="flex flex-col h-full">
                                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-[#06C755] rounded-full flex items-center justify-center text-white shadow-md shadow-[#06C755]/20">
                                                <Icons.MessageCircle size={16} fill="currentColor" />
                                            </div>
                                            <span className="font-bold text-sm text-slate-700">Official Account</span>
                                        </div>
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                                            <div className="text-[10px] text-slate-400 font-bold uppercase text-center my-2 tracking-wider">Today</div>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 bg-[#06C755] rounded-full flex-shrink-0 shadow-sm" />
                                                <div className="bg-white border border-slate-100 p-6 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] relative">
                                                    <div className={`text-sm text-slate-700 leading-relaxed whitespace-pre-wrap ${demoResult ? 'opacity-100' : 'opacity-40 italic'}`}>
                                                        {isDemoGenerating ? (
                                                            <span className="animate-pulse">メッセージを作成中...</span>
                                                        ) : demoResult || "ここにLINEメッセージが表示されます..."}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Instagram Abstract View */
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
                                                    <img src="https://picsum.photos/id/64/100/100" alt="avatar" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-slate-800 text-xs uppercase tracking-tight">misepo_cafe</span>
                                            </div>
                                            <Icons.MoreHorizontal size={18} className="text-slate-400" />
                                        </div>
                                        <div ref={scrollRef} className="overflow-y-auto custom-scrollbar flex-1">
                                            <div className="aspect-square mx-6 relative group shrink-0 overflow-hidden rounded-2xl shadow-sm mb-4">
                                                <img src={activeScenario.id === "casual" ? "https://picsum.photos/id/225/600/600" : "https://picsum.photos/id/425/600/600"} alt="post" className="w-full h-full object-cover" />
                                                {demoResult && (
                                                    <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                                                )}
                                            </div>
                                            <div className="px-6">
                                                <div className="flex justify-between mb-3">
                                                    <div className="flex gap-4 text-slate-700">
                                                        <Icons.Heart size={22} className={`transition-colors cursor-pointer ${demoResult ? 'text-[#E88BA3] fill-[#E88BA3]' : 'hover:text-[#E88BA3]'}`} />
                                                        <Icons.MessageCircle size={22} className="hover:text-slate-900" />
                                                        <Icons.Send size={22} className="hover:text-slate-900" />
                                                    </div>
                                                    <Icons.Bookmark size={22} className="text-slate-700 hover:text-slate-900" />
                                                </div>
                                                <p className="font-bold text-xs text-slate-800 mb-2">128 likes</p>
                                                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap select-none">
                                                    <span className="font-bold mr-2 text-slate-800">misepo_cafe</span>
                                                    <span className={`${demoResult ? 'opacity-100' : 'opacity-40 italic'}`}>
                                                        {isDemoGenerating ? (
                                                            <span className="animate-pulse">Generating post...</span>
                                                        ) : demoResult || "Your AI-generated content will appear here..."}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-white/30 mt-6 font-black uppercase tracking-[0.4em]">Powered by MisePo AI Engine</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-white/20 mt-12 font-black uppercase tracking-widest">※ 利用シーンに合わせた実際の生成結果のデモンストレーションです</p>
        </section>
    );
};
