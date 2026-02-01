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
    handleDemoGenerate,
    isMobile = false
}: DemoSectionProps & { isMobile?: boolean }) => {
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
        <section id="demo" className={`${isMobile ? 'py-12' : 'py-24'} bg-white text-slate-800 relative overflow-hidden`}>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--ichizen-beige)]/30 z-0" />
            <div className={`${isMobile ? 'w-full px-4' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'} relative z-10`}>
                <div className={`${isMobile ? 'mb-8' : 'mb-16'} text-center`}>
                    <span className="inline-block px-4 py-1.5 bg-white border border-[var(--ichizen-blue)]/20 rounded-full text-[var(--ichizen-blue)] text-sm font-bold tracking-widest shadow-sm mb-6">
                        AI DEMO
                    </span>
                    <h2 className={`font-bold mb-6 text-slate-800 leading-tight ${isMobile ? 'text-2xl mb-4' : 'text-4xl md:text-6xl'}`}>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">AIの実力を、</span><br className={isMobile ? '' : 'md:hidden'} />
                        <span className="text-[var(--ichizen-blue)]">今すぐ体験。</span>
                    </h2>
                    <p className={`text-slate-500 font-medium max-w-2xl mx-auto ${isMobile ? 'text-xs' : 'text-lg'}`}>
                        利用シーンに合わせて、MisePoの生成クオリティをチェック。<br />
                        まるでプロが書いたような文章が、一瞬で生まれます。
                    </p>
                </div>

                {/* Scenario Tabs */}
                <div className={`flex flex-wrap justify-center gap-2 ${isMobile ? 'mb-8' : 'mb-12'}`}>
                    {demoScenarios.map((scenario, idx) => (
                        <button
                            key={scenario.id}
                            onClick={() => setActiveScenarioIdx(idx)}
                            className={`rounded-full font-bold transition-all duration-300 ${isMobile ? 'px-4 py-1.5 text-[10px]' : 'px-6 py-2.5 text-sm'} ${activeScenarioIdx === idx
                                ? 'bg-slate-800 text-white shadow-lg scale-105'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                                }`}
                        >
                            {scenario.label}
                        </button>
                    ))}
                </div>

                <div className={`bg-white rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.06)] overflow-hidden max-w-5xl mx-auto flex flex-col relative border border-slate-100 ${isMobile ? '' : 'md:flex-row min-h-[600px]'}`}>
                    <div className={`flex flex-col bg-white ${isMobile ? 'p-6' : 'p-10 md:w-1/2 md:border-r border-slate-100'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <label className={`font-bold text-slate-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>投稿メモを入力</label>
                            <span className="text-[10px] font-bold text-white bg-slate-800 rounded-full px-3 py-1">{activeScenario.modeBadge}</span>
                        </div>
                        <div className="relative mb-6 group flex-1">
                            <textarea
                                className={`w-full p-6 bg-slate-50 rounded-2xl text-slate-600 font-bold focus:outline-none resize-none leading-relaxed border-2 border-transparent focus:border-[var(--ichizen-blue)]/20 focus:bg-white transition-all ${isMobile ? 'min-h-[120px] text-sm' : 'min-h-[200px] text-lg'}`}
                                readOnly
                                value={activeScenario.input}
                            />
                        </div>
                        <button
                            onClick={handleDemoGenerate}
                            disabled={isDemoGenerating}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${isMobile ? 'text-base' : 'text-lg'} ${isDemoGenerating
                                ? 'bg-slate-100 text-slate-400 cursor-wait'
                                : 'bg-[var(--ichizen-blue)] text-white shadow-xl shadow-[var(--ichizen-blue)]/20 hover:-translate-y-0.5'
                                }`}
                        >
                            {isDemoGenerating ? (
                                <><Icons.Sparkles size={isMobile ? 20 : 24} className="animate-spin" /> 生成中...</>
                            ) : (
                                <><Icons.Sparkles size={isMobile ? 20 : 24} className="group-hover:animate-pulse" /> AIで文章を生成する</>
                            )}
                        </button>
                    </div>

                    <div className={`flex flex-col items-center justify-center relative overflow-hidden bg-slate-50/50 ${isMobile ? 'p-6' : 'p-10 md:w-1/2'}`}>
                        <div className="absolute inset-0 bg-[var(--ichizen-blue)]/5" />

                        {/* Abstract Canvas for Result */}
                        <div className="w-full max-w-sm relative z-10">
                            <div className={`bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-6 flex flex-col relative transition-transform duration-500 ${isMobile ? 'min-h-[400px]' : 'min-h-[480px]'}`}>
                                {demoResult && (
                                    <div className="absolute -top-3 -right-3 z-50 pointer-events-none">
                                        <div className="bg-[var(--ichizen-green)] text-white px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-in slide-in-from-bottom-4 fade-in duration-300">
                                            <Icons.CheckCircle size={14} />
                                            <span className="text-[10px]">Generated!</span>
                                        </div>
                                    </div>
                                )}

                                {activeScenario.id === "google_maps" ? (
                                    /* Google Maps Abstract View */
                                    <div className="flex flex-col h-full px-6">
                                        <div className="mb-4 pb-4 border-b border-slate-100">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs">U</div>
                                                <span className="font-bold text-xs text-slate-700">Yuki Sato</span>
                                            </div>
                                            <div className="flex gap-0.5 text-[#F5CC6D] mb-2"><Icons.Star size={10} fill="currentColor" /><Icons.Star size={10} fill="currentColor" /><Icons.Star size={10} fill="currentColor" /><Icons.Star size={10} fill="currentColor" /><Icons.Star size={10} fill="currentColor" /></div>
                                            <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">「ドーナツがふわふわで最高でした！コーヒーも好みです。また来ます！」</p>
                                        </div>
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="bg-blue-50/50 p-4 rounded-xl relative">
                                                <div className="text-[8px] font-bold text-blue-400 uppercase mb-2 tracking-wider">Owner Response</div>
                                                <div className={`text-xs text-slate-700 leading-relaxed whitespace-pre-wrap ${demoResult ? 'opacity-100' : 'opacity-40'}`}>
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
                                            <div className="w-8 h-8 bg-[#06C755] rounded-full flex items-center justify-center text-white shadow-md">
                                                <Icons.MessageCircle size={16} fill="currentColor" />
                                            </div>
                                            <span className="font-bold text-xs text-slate-700">Official Account</span>
                                        </div>
                                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4">
                                            <div className="flex gap-3">
                                                <div className="w-6 h-6 bg-[#06C755] rounded-full flex-shrink-0" />
                                                <div className="bg-white border border-slate-100 p-4 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative">
                                                    <div className={`text-xs text-slate-700 leading-relaxed whitespace-pre-wrap ${demoResult ? 'opacity-100' : 'opacity-40 italic'}`}>
                                                        {isDemoGenerating ? (
                                                            <span className="animate-pulse">メッセージを作成中...</span>
                                                        ) : demoResult || "ここにメッセージが表示されます..."}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Instagram Abstract View */
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 shrink-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-200" />
                                                <span className="font-bold text-slate-800 text-[10px] tracking-tight">misepo_cafe</span>
                                            </div>
                                            <Icons.MoreHorizontal size={16} className="text-slate-400" />
                                        </div>
                                        <div ref={scrollRef} className="overflow-y-auto custom-scrollbar flex-1">
                                            <div className="aspect-square mx-6 relative group overflow-hidden rounded-xl bg-slate-100 my-4">
                                                <img src={activeScenario.id === "casual" ? "https://picsum.photos/id/225/400/400" : "https://picsum.photos/id/425/400/400"} alt="post" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="px-6 pb-6">
                                                <div className="flex justify-between mb-3">
                                                    <div className="flex gap-4 text-slate-700">
                                                        <Icons.Heart size={18} className={demoResult ? 'text-[var(--ichizen-blue)] fill-[var(--ichizen-blue)]' : ''} />
                                                        <Icons.MessageCircle size={18} />
                                                        <Icons.Send size={18} />
                                                    </div>
                                                    <Icons.Bookmark size={18} />
                                                </div>
                                                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
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
                    </div>
                </div>
            </div>
        </section>
    );
};
