import React, { useState } from 'react';
import { ChevronRightIcon, XIcon } from './Icons';

interface FeatureWalkthroughProps {
    onComplete: () => void;
    onSkip?: () => void;
}

const FeatureWalkthrough: React.FC<FeatureWalkthroughProps> = ({ onComplete, onSkip }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: "MisePoへようこそ",
            desc: "あなたのお店専属のAI広報担当。\n日々の投稿や返信を、もっと簡単に、もっと魅力的に。",
            image: "/assets/avatar_01.png",
            accent: "bg-[#d8e9f4]",
            textColor: "text-[#0071b9]"
        },
        {
            title: "文章作成はAIにおまかせ",
            desc: "「何を書こう？」と迷う時間はもう終わり。\nAIがお店の雰囲気を学習し、最適な文章を提案します。",
            image: "/assets/avatar_02.png",
            accent: "bg-[#d8e9f4]",
            textColor: "text-[#0071b9]"
        },
        {
            title: "全SNSをワンタップで",
            desc: "Instagram、X、LINE、Googleマップ。\nそれぞれの媒体に合わせた投稿文を一度に作成できます。",
            image: "/assets/avatar_03.png",
            accent: "bg-[#d8e9f4]",
            textColor: "text-[#0071b9]"
        },
        {
            title: "さあ、始めましょう",
            desc: "まずは簡単なプロフィール設定から。\nあなたの「AI広報担当」が待っています。",
            image: "/assets/avatar_04.png",
            accent: "bg-[#d8e9f4]",
            textColor: "text-[#0071b9]"
        }
    ];

    const isLastStep = step === steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setStep(prev => prev + 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[400] bg-white flex flex-col animate-in fade-in duration-500">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full blur-[100px] transition-colors duration-700 ease-in-out ${steps[step].accent}`} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-slate-50 rounded-full blur-[80px]" />
            </div>

            {/* Header / Skip */}
            <div className="relative z-10 px-6 py-6 flex justify-end">
                {!isLastStep && (
                    <button
                        onClick={onComplete}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-widest uppercase"
                    >
                        SKIP
                    </button>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 max-w-md mx-auto w-full">

                {/* Image / Avatar */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-white/50 rounded-full blur-xl transform scale-110" />
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-white transition-all duration-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                ${i === step ? 'opacity-100 scale-100 rotate-0' :
                                    i < step ? 'opacity-0 scale-90 -rotate-12 translate-x-[-100%]' :
                                        'opacity-0 scale-90 rotate-12 translate-x-[100%]'}
                            `}
                        >
                            <img src={s.image} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {/* Placeholder to keep height */}
                    <div className="w-48 h-48 sm:w-64 sm:h-64 opacity-0 pointer-events-none" />
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 min-h-[160px]">
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500 ${steps[step].textColor}`} key={`title-${step}`}>
                        {steps[step].title}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed whitespace-pre-line animate-in slide-in-from-bottom-2 fade-in duration-500" key={`desc-${step}`}>
                        {steps[step].desc}
                    </p>
                </div>

                {/* Dots Indicator */}
                <div className="flex gap-3 mt-8 mb-12">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? `w-8 ${steps[step].textColor.replace('text-', 'bg-')}` : 'w-1.5 bg-slate-200'
                                }`}
                        />
                    ))}
                </div>

            </div>

            {/* Footer / Action */}
            <div className="relative z-10 px-6 pb-12 safe-area-bottom w-full max-w-md mx-auto">
                <button
                    onClick={handleNext}
                    className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group
                        ${isLastStep
                            ? 'bg-[#122646] text-white hover:bg-[#0071b9]'
                            : 'bg-white text-[#122646] hover:bg-slate-50 border border-slate-100'
                        }
                    `}
                >
                    {isLastStep ? '設定をはじめる' : '次へ'}
                    <ChevronRightIcon className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${!isLastStep && 'text-slate-400'}`} />
                </button>
            </div>
        </div>
    );
};

export default FeatureWalkthrough;
