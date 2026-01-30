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
            stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }}
            fill={active ? (dark ? "var(--plexo-yellow)" : "var(--plexo-yellow)") : "none"} fillOpacity={active ? (dark ? 1 : 0.2) : 0} />
    </svg>
);

const CustomHistory = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
        <path d="M12 7V12L15 15" stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
    </svg>
);

const CustomAvatar = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
    </svg>
);

const CustomSettings = ({ active, dark }: { active: boolean, dark?: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke={active ? (dark ? "var(--plexo-black)" : "var(--plexo-yellow)") : (dark ? "var(--plexo-med-gray)" : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: active ? 1 : (dark ? 1 : 0.4) }} />
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
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[150] px-6 pb-8 bg-transparent pointer-events-none">
            {/* The Floating Bar Background - Smart Contrast */}
            <div className={`relative h-20 w-full flex items-center justify-between px-7 rounded-[40px] overflow-visible pointer-events-auto border transition-all duration-300
                ${isDrawerOpen
                    ? 'bg-white/80 backdrop-blur-xl border-[#E5E5E5] shadow-[0_20px_40px_rgba(0,0,0,0.1)]' // Light mode (on drawer)
                    : 'bg-white/10 backdrop-blur-2xl border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)]' // Dark mode (on colorful bg)
                }
            `}>
                {/* SVG Gradients Definition */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>
                        <linearGradient id="footerGradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Visual Base for the notch/plus area */}
                <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] z-10 pointer-events-none">
                    {/* Ripple Effect for Confirm Step */}
                    {isConfirmStep && (
                        <>
                            <div className="absolute inset-0 rounded-full bg-[var(--plexo-yellow)] opacity-40 animate-ping" style={{ animationDuration: '2s' }} />
                            <div className="absolute inset-4 rounded-full bg-[var(--plexo-yellow)] opacity-60 animate-pulse" />
                        </>
                    )}
                    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10">
                        <circle cx="44" cy="34" r="32" fill={isDrawerOpen ? "white" : "#6339f9"} fillOpacity={isDrawerOpen ? 0.9 : 0.8} />
                    </svg>
                </div>

                {/* Generate Label Tooltip (Only visible in Confirm Step) */}
                <div className={`absolute top-[-70px] left-1/2 -translate-x-1/2 z-[160] transition-all duration-300 ${isConfirmStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="px-3 py-1.5 bg-[#111111] text-[var(--plexo-yellow)] text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap border border-[var(--plexo-yellow)]/20 flex items-center gap-1.5 animate-bounce">
                        <span>Tap to Generate</span>
                        <SparklesIcon className="w-3 h-3" />
                    </div>
                    {/* Triangle pointing down */}
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111] rotate-45 border-r border-b border-[var(--plexo-yellow)]/20"></div>
                </div>

                {/* The Central Plus/Generate Button - Monochrome with Animation */}
                <button
                    onClick={onPlusClick}
                    disabled={isGenerating}
                    className={`
                        absolute top-[-26px] left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center z-20 
                        transition-all duration-300 border-4 border-white/10
                        ${isConfirmStep
                            ? 'bg-[var(--plexo-yellow)] text-[var(--plexo-black)] rotate-0 scale-125 shadow-[0_0_30px_rgba(255,215,0,0.6)] border-white'
                            : 'bg-white rotate-180 scale-100 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border-white/20'
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
                            <path d="M12 5V19M5 12H19" stroke={isConfirmStep ? "white" : "black"} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Sparkles/Generate Icon - Animates in */}
                        <div className={`absolute transition-all duration-300 ease-out ${isConfirmStep ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                            {isGenerating ? (
                                <div className="w-7 h-7 border-3 border-[var(--plexo-black)]/30 border-t-[var(--plexo-black)] rounded-full animate-spin" />
                            ) : (
                                <SparklesIcon className="w-7 h-7 text-[var(--plexo-black)]" />
                            )}
                        </div>
                    </div>
                </button>

                {/* Left Side Items */}
                <div className="flex items-center gap-8 flex-1 justify-start h-full pt-2">
                    <button
                        onClick={() => onTabChange('home')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomHome active={activeTab === 'home'} dark={isDrawerOpen} />
                        <span className={`
                            text-[8px] font-black uppercase tracking-[0.2em] transition-all
                            ${activeTab === 'home'
                                ? 'text-[var(--plexo-yellow)]'
                                : (isDrawerOpen ? 'text-[var(--plexo-med-gray)]' : 'text-white/40')
                            }
                        `}>Home</span>
                    </button>
                    <button
                        onClick={() => onTabChange('history')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomHistory active={activeTab === 'history'} dark={isDrawerOpen} />
                        <span className={`
                            text-[8px] font-black uppercase tracking-[0.2em] transition-all
                            ${activeTab === 'history'
                                ? 'text-[var(--plexo-yellow)]'
                                : (isDrawerOpen ? 'text-[var(--plexo-med-gray)]' : 'text-white/40')
                            }
                        `}>History</span>
                    </button>
                </div>

                {/* Right Side Items */}
                <div className="flex items-center gap-8 flex-1 justify-end h-full pt-2">
                    <button
                        onClick={() => onTabChange('learning')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomAvatar active={activeTab === 'learning'} dark={isDrawerOpen} />
                        <span className={`
                            text-[8px] font-black uppercase tracking-[0.2em] transition-all
                            ${activeTab === 'learning'
                                ? 'text-[var(--plexo-yellow)]'
                                : (isDrawerOpen ? 'text-[var(--plexo-med-gray)]' : 'text-white/40')
                            }
                        `}>分身</span>
                    </button>
                    <button
                        onClick={() => onTabChange('settings')}
                        className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                    >
                        <CustomSettings active={activeTab === 'settings'} dark={isDrawerOpen} />
                        <span className={`
                            text-[8px] font-black uppercase tracking-[0.2em] transition-all
                            ${activeTab === 'settings'
                                ? 'text-[var(--plexo-yellow)]'
                                : (isDrawerOpen ? 'text-[var(--plexo-med-gray)]' : 'text-white/40')
                            }
                        `}>Setting</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
