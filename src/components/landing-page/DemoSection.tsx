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

    return (
        <section id="demo" className="py-24 md:py-48 bg-gradient-to-br from-[#1823ff] via-[#2531ff] to-[#1823ff] text-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-start mb-24">
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] mb-8 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">Interactive Demo</span>
                    <h2 className={`font-black tracking-tighter leading-[0.85] text-white ${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl lg:text-[5rem]'}`}>
                        今すぐ、<br />
                        <span className="text-white opacity-60">試してみる。</span>
                    </h2>
                    <p className="text-xl md:text-3xl font-bold text-white/70 mt-12 max-w-2xl leading-tight">
                        MisePoの実力を、今すぐ体験。<br />
                        あなたの想いを汲み取り、心に届く言葉に変えます。
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    {/* Left: Control Panel */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap gap-2">
                            {demoScenarios.map((scenario, idx) => (
                                <button
                                    key={scenario.id}
                                    onClick={() => setActiveScenarioIdx(idx)}
                                    className={`px-6 py-3 rounded-full text-xs font-black tracking-widest transition-all ${activeScenarioIdx === idx
                                        ? 'bg-white text-[#1823ff] shadow-xl shadow-black/10'
                                        : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/20'
                                        }`}
                                >
                                    {scenario.label.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-[40px] p-8 md:p-12 border border-white/20 flex flex-col gap-8 h-full min-h-[400px]">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Input Memo</span>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white border border-white/20">
                                    {activeScenario.modeBadge}
                                </div>
                            </div>
                            <textarea
                                className="w-full bg-transparent text-xl md:text-2xl font-black text-white placeholder-white/30 focus:outline-none resize-none flex-1 leading-tight"
                                readOnly
                                value={activeScenario.input}
                            />
                            <button
                                onClick={handleDemoGenerate}
                                disabled={isDemoGenerating}
                                className={`w-full py-6 rounded-full font-black tracking-widest text-lg transition-all ${isDemoGenerating
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                    : 'bg-white text-[#1823ff] shadow-2xl shadow-black/20 hover:scale-[1.02]'
                                    }`}
                            >
                                {isDemoGenerating ? "作成中..." : "デモを試す"}
                            </button>
                        </div>
                    </div>

                    {/* Right: Output Canvas */}
                    <div className="bg-white/5 rounded-[48px] p-8 md:p-12 border border-white/10 flex items-center justify-center min-h-[500px]">
                        <div className="w-full max-w-[360px] bg-white rounded-[40px] shadow-2xl shadow-[#1823ff]/10 border border-slate-100 p-8 flex flex-col h-[520px] relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10 shrink-0">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-100" />
                                    <div className="w-2 h-2 rounded-full bg-slate-100" />
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Result View</span>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {isDemoGenerating ? (
                                    <div className="flex flex-col gap-4">
                                        <div className="h-4 w-3/4 bg-slate-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-full bg-slate-50 rounded-full animate-pulse" />
                                        <div className="h-4 w-1/2 bg-slate-50 rounded-full animate-pulse" />
                                    </div>
                                ) : demoResult ? (
                                    <div className="text-lg font-bold text-[#282d32] leading-relaxed whitespace-pre-wrap">
                                        {demoResult}
                                    </div>
                                ) : (
                                    <div className="text-lg font-bold text-slate-200 leading-relaxed italic">
                                        Your AI-generated content will appear here...
                                    </div>
                                )}
                            </div>

                            {demoResult && (
                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between shrink-0">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#1823ff]/5 flex items-center justify-center text-[#1823ff]"><Icons.Check size={16} /></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase self-center tracking-widest">Done</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"><Icons.Share size={16} /></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300"><Icons.Copy size={16} /></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
