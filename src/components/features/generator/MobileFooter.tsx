import React, { useState, useEffect } from 'react';
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
const CustomHome = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
            stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            fill={active ? "#7F5AF0" : "none"} fillOpacity={active ? 0.2 : 0} />
    </svg>
);

const CustomHistory = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7V12L15 15" stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomAvatar = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <circle cx="12" cy="7" r="4" stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={active ? "#7F5AF0" : "none"} fillOpacity={active ? 0.2 : 0} />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? "#7F5AF0" : "#64748B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomSettings = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
            stroke={active ? "#7F5AF0" : "#64748B"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3"
            stroke={active ? "#7F5AF0" : "#64748B"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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

    // Dynamic SVG Path Generation
    const [width, setWidth] = useState(375);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWidth(window.innerWidth);
            const handleResize = () => setWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isDrawerOpen]); // Re-calculate when drawer state changes to ensure correct rendering

    // Curve parameters
    const footerHeight = 84;
    const notchDepth = 40;
    const notchWidth = 138; // Balanced width to follow the ~72px button 
    const cornerRadius = 42;

    const center = width / 2;
    // Calculate path with optimized handles to follow a circular arc more naturally
    const path = `
        M 0 ${cornerRadius}
        Q 0 0 ${cornerRadius} 0
        L ${center - notchWidth / 2} 0
        C ${center - notchWidth / 3.5} 0 ${center - notchWidth / 4} ${notchDepth} ${center} ${notchDepth}
        C ${center + notchWidth / 4} ${notchDepth} ${center + notchWidth / 3.5} 0 ${center + notchWidth / 2} 0
        L ${width - cornerRadius} 0
        Q ${width} 0 ${width} ${cornerRadius}
        L ${width} ${footerHeight - cornerRadius}
        Q ${width} ${footerHeight} ${width - cornerRadius} ${footerHeight}
        L ${cornerRadius} ${footerHeight}
        Q 0 ${footerHeight} 0 ${footerHeight - cornerRadius}
        Z
    `;

    return (
        <div className={`sm:hidden fixed bottom-6 left-0 right-0 z-[150] px-4 bg-transparent transition-all duration-500 ${isDrawerOpen ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}`}>
            <div className="relative w-full h-[84px] pointer-events-auto">

                {/* SVG Background Shape */}
                <svg width="100%" height={footerHeight} viewBox={`0 0 ${width} ${footerHeight}`} className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                        <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
                        </linearGradient>
                        <filter id="navShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="15" floodOpacity="0.08" />
                        </filter>
                    </defs>
                    <path d={path} fill="url(#navGradient)" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" filter="url(#navShadow)" />
                </svg>

                {/* Generate Label Tooltip */}
                <div className={`absolute top-[-85px] left-1/2 -translate-x-1/2 z-[160] transition-all duration-300 ${isConfirmStep ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                    <div className="px-3 py-1.5 bg-[#7F5AF0] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl whitespace-nowrap flex items-center gap-1.5 animate-bounce border border-white/20">
                        <span>Tap to Generate</span>
                        <SparklesIcon className="w-3 h-3 text-white" />
                    </div>
                </div>

                {/* The Central Plus/Generate Button - Independent & Floating */}
                <button
                    onClick={onPlusClick}
                    disabled={isGenerating}
                    className={`
                        absolute -top-[36px] left-1/2 -translate-x-1/2 w-[68px] h-[68px] rounded-full flex items-center justify-center z-20 
                        transition-all duration-300 border-[4px]
                        ${isConfirmStep
                            ? 'bg-[#f3ff5f] border-white text-black rotate-0 scale-110'
                            : 'bg-[#f3ff5f] border-white text-black rotate-180 scale-100 hover:scale-105'
                        }
                    `}
                    aria-label={isConfirmStep ? "Generate Post" : "New Post"}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <svg
                            width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            className={`absolute transition-all duration-300 ease-out ${isConfirmStep ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`}
                        >
                            <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <div className={`absolute transition-all duration-300 ease-out ${isConfirmStep ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
                            {isGenerating ? (
                                <div className="w-7 h-7 border-3 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <SparklesIcon className="w-7 h-7 text-black" />
                            )}
                        </div>
                    </div>
                </button>

                {/* Navigation Items Container */}
                <div className="absolute inset-0 flex items-center justify-between px-6 pt-1">
                    {/* Left Side Items */}
                    <div className="flex items-center justify-center gap-8 w-[120px]">
                        <button
                            onClick={() => onTabChange('home')}
                            className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                        >
                            <CustomHome active={activeTab === 'home'} />
                            <span className={`
                                text-[9px] font-black uppercase tracking-[0.1em] transition-all
                                ${activeTab === 'home' ? 'text-[#7F5AF0]' : 'text-slate-500'}
                            `}>Home</span>
                        </button>
                        <button
                            onClick={() => onTabChange('history')}
                            className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                        >
                            <CustomHistory active={activeTab === 'history'} />
                            <span className={`
                                text-[9px] font-black uppercase tracking-[0.1em] transition-all
                                ${activeTab === 'history' ? 'text-[#7F5AF0]' : 'text-slate-500'}
                            `}>History</span>
                        </button>
                    </div>

                    {/* Spacer for Center Notch (Invisible) */}
                    <div className="w-[80px]" />

                    {/* Right Side Items */}
                    <div className="flex items-center justify-center gap-8 w-[120px]">
                        <button
                            onClick={() => onTabChange('learning')}
                            className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                        >
                            <CustomAvatar active={activeTab === 'learning'} />
                            <span className={`
                                text-[9px] font-black uppercase tracking-[0.1em] transition-all
                                ${activeTab === 'learning' ? 'text-[#7F5AF0]' : 'text-slate-500'}
                            `}>分身</span>
                        </button>
                        <button
                            onClick={() => onTabChange('settings')}
                            className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${isConfirmStep ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                        >
                            <CustomSettings active={activeTab === 'settings'} />
                            <span className={`
                                text-[9px] font-black uppercase tracking-[0.1em] transition-all
                                ${activeTab === 'settings' ? 'text-[#7F5AF0]' : 'text-slate-500'}
                            `}>Setting</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
