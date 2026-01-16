import React, { useState, useEffect } from 'react';
import { LOADING_TIPS } from '../constants';
import { SparklesIcon } from './Icons';

interface LoadingModalProps {
    isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="bg-white/90 rounded-[3rem] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.5)] border border-white/40 w-full max-w-xl overflow-hidden relative group">

                {/* Animated Background Accents */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-orange-200/50 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-64 h-64 bg-purple-200/30 rounded-full blur-[100px]"></div>

                <div className="relative z-10 p-12 text-center space-y-10">

                    {/* Progress Indicator */}
                    <div className="relative inline-flex items-center justify-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600 animate-spin-slow">
                            <SparklesIcon className="w-10 h-10" />
                        </div>
                        <div className="absolute inset-0 bg-orange-500/20 blur-[30px] rounded-full animate-pulse"></div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-black text-stone-800 tracking-tighter italic">
                            AIが投稿文を作成中...
                        </h3>
                        <p className="text-stone-500 font-bold max-w-xs mx-auto leading-relaxed">
                            お店のこだわりをAIに伝えています。少しだけお待ちください。
                        </p>
                    </div>

                    {/* Tips Module: The Bento Box */}
                    <div className="bg-stone-50/80 border border-stone-100 rounded-[2rem] p-8 text-left animate-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Smart Tip</span>
                        </div>
                        <div key={tipIndex} className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <p className="text-sm text-stone-700 font-bold leading-relaxed italic">
                                {LOADING_TIPS[tipIndex]}
                            </p>
                        </div>

                        {/* Tip Indicators */}
                        <div className="flex gap-1.5 mt-6">
                            {LOADING_TIPS.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-500 ${i === tipIndex ? 'w-6 bg-orange-500' : 'w-2 bg-stone-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* System Status Pill */}
                    <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full border border-stone-100 shadow-sm animate-bounce">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">AI Assistant Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;
