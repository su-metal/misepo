import React from 'react';
import {
    SparklesIcon
} from '../../Icons';

interface MobileFooterProps {
    activeTab: 'home' | 'history' | 'learning' | 'settings';
    onTabChange: (tab: 'home' | 'history' | 'learning' | 'settings') => void;
    onPlusClick: () => void;
    currentStep?: 'platform' | 'input' | 'confirm' | 'result';
    isGenerating?: boolean;
    onGenerate?: () => void;
}

/**
 * Stylish Custom Icons for Footer - Updated for Plexo Design
 */
const CustomHome = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
            stroke={active ? "#f8ea5d" : (dark ? "#949594" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }}
            fill={active ? "#f8ea5d" : "none"} fillOpacity={active ? (dark ? 1 : 0.2) : 0} />
    </svg>
);

const CustomHistory = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? "#f8ea5d" : "#949594"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }} />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? "#f8ea5d" : "#949594"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }} />
        <path d="M12 7V12L15 15" stroke={active ? "#f8ea5d" : "#949594"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }} />
    </svg>
);

const CustomAvatar = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={active ? "#f8ea5d" : "#949594"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }} />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? "#f8ea5d" : "#949594"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : 1 }} />
    </svg>
);

const CustomSettings = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
            stroke={active ? "#f8ea5d" : "#949594"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: active ? 1 : 1 }} />
        <circle cx="12" cy="12" r="3"
            stroke={active ? "#f8ea5d" : "#949594"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: active ? 1 : 1 }} />
    </svg>
);

export const MobileFooter: React.FC<MobileFooterProps> = ({
    activeTab,
    onTabChange,
    onPlusClick,
    currentStep = 'platform',
    isGenerating = false,
    onGenerate
}) => {
    const isConfirmStep = currentStep === 'confirm';
    const isDrawerOpen = currentStep !== 'platform'; // Drawer is open for input, confirm, result steps

    return (
        <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-[150] px-6 pb-8 bg-transparent transition-all duration-500 ${isDrawerOpen ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}`}>
            {/* The Floating Bar Background - Ultra-Premium Glassmorphism (VisionOS Style) */}
            {/* The Floating Bar Background - Hyper-Glass (Prism Effect) */}
            {/* The Floating Bar Background - High Contrast Solid Dark (Matching Result UI) */}
            <div className={`relative h-20 w-full flex items-center justify-between px-7 rounded-[40px] overflow-visible pointer-events-auto transition-all duration-300
                bg-[#606060] border border-white/10
                shadow-[0_12px_40px_rgba(0,0,0,0.3)]
            `}>
                <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] pointer-events-none" />
                {/* Visual Base for the notch/plus area */}
                {/* Visual Base for the notch/plus area */}
                <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] z-10 pointer-events-none">
                    {/* Ripple Effect for Confirm Step */}
                    {isConfirmStep && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-[#7F5AF0] opacity-40 animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-4 rounded-full bg-[#7F5AF0] opacity-60 animate-pulse" />
                        </>
                    )}
                    {/* Glassy Notch - Gradients to match the bar */}
                    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 transition-all duration-300">
                        {/* We can't easily blur SVG partials, so we simulate the glass look with opacity implies */}
                        <defs>
                            <linearGradient id="glassGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="white" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
                        {/* Circle Cutout Background - Matching Glass */}
                        <circle cx="44" cy="34" r="34" fill="url(#glassGradient)" className="drop-shadow-sm" />
                    </svg>
                </div>

                {/* Generate Label Tooltip (Only visible in Confirm Step) */}
                <div className={`absolute top-[-75px] left-1/2 -translate-x-1/2 z-[160] transition-all duration-300 ${isConfirmStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl whitespace-nowrap flex items-center gap-1.5 animate-bounce border border-white/10">
                        <span>Tap to Generate</span>
                        <SparklesIcon className="w-3 h-3 text-[#7F5AF0]" />
                    </div>
                </div>

                {/* The Central Plus/Generate Button - Floating Glass Button */}
                <button
                    onClick={onPlusClick}
                    disabled={isGenerating}
                    className={`
                        absolute top-[-26px] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center z-20 
                        transition-all duration-300 border-[3px]
                        ${isConfirmStep
                            ? 'bg-[#7F5AF0] border-white/20 text-white rotate-0 scale-110 shadow-[0_0_20px_rgba(127,90,240,0.6)]'
                            : 'bg-white/80 backdrop-blur-xl border-white/60 text-slate-400 rotate-180 scale-100 shadow-[0_8px_16px_rgba(0,0,0,0.06)] hover:bg-white hover:scale-105'
                        }
                    `}
                    aria-label={isConfirmStep ? "Generate Post" : "New Post"}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Plus Icon - Animates out */}
                        <svg
                            width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className={`absolute transition-all duration-300 ease-out ${isConfirmStep ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
                        >
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Sparkles/Generate Icon - Animates in */}
                        <div className={`absolute transition-all duration-300 ease-out ${isConfirmStep ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                            {isGenerating ? (
                                <div className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <SparklesIcon className="w-7 h-7 text-white" />
                            )}
                        </div>
                    </div>
                </button>

                {/* Left Side Items */}
                <div className="flex items-center gap-8 flex-1 justify-start h-full pt-0">
                    <button
                        onClick={() => onTabChange('home')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomHome active={activeTab === 'home'} dark={true} />
                        <span className={`
                            text-[9px] font-black uppercase tracking-[0.1em] transition-all
                            ${activeTab === 'home'
                                ? 'text-[#f8ea5d]'
                                : 'text-[#949594]'
                            }
                        `}>Home</span>
                    </button>
                    <button
                        onClick={() => onTabChange('history')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomHistory active={activeTab === 'history'} dark={true} />
                        <span className={`
                            text-[9px] font-black uppercase tracking-[0.1em] transition-all
                            ${activeTab === 'history'
                                ? 'text-[#f8ea5d]'
                                : 'text-[#949594]'
                            }
                        `}>History</span>
                    </button>
                </div>

                {/* Right Side Items */}
                <div className="flex items-center gap-8 flex-1 justify-end h-full pt-0">
                    <button
                        onClick={() => onTabChange('learning')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomAvatar active={activeTab === 'learning'} dark={true} />
                        <span className={`
                            text-[9px] font-black uppercase tracking-[0.1em] transition-all
                            ${activeTab === 'learning'
                                ? 'text-[#f8ea5d]'
                                : 'text-[#949594]'
                            }
                        `}>分身</span>
                    </button>
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomSettings active={activeTab === 'settings'} dark={true} />
                        <span className={`
                            text-[9px] font-black uppercase tracking-[0.1em] transition-all
                            ${activeTab === 'settings'
                                ? 'text-[#f8ea5d]'
                                : 'text-[#949594]'
                            }
                        `}>Setting</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
