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
    isPlatformSelected?: boolean;
    selectionTrigger?: number;
}

/**
 * Stylish Custom Icons for Footer - Updated for Plexo Design
 */
const CustomHome = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
            stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            fill={active ? "#2b2b2f" : "none"} fillOpacity={active ? 0.1 : 0} />
    </svg>
);

const CustomHistory = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7V12L15 15" stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomAvatar = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <circle cx="12" cy="7" r="4" stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill={active ? "#2b2b2f" : "none"} fillOpacity={active ? 0.1 : 0} />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? "#2b2b2f" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomSettings = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-300">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0 l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
            stroke={active ? "#2b2b2f" : "#94a3b8"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3"
            stroke={active ? "#2b2b2f" : "#94a3b8"}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MobileFooter: React.FC<MobileFooterProps> = ({
    activeTab,
    onTabChange,
    onPlusClick,
    currentStep = 'platform',
    isGenerating = false,
    onGenerate,
    isPlatformSelected = false,
    selectionTrigger = 0
}) => {
    const isConfirmStep = currentStep === 'confirm';
    const isPlatformStep = currentStep === 'platform';
    const isDrawerOpen = currentStep !== 'platform'; // Drawer is open for input, confirm, result steps

    const [isBreathing, setIsBreathing] = useState(false);
    const [isPopping, setIsPopping] = useState(false);
    const [showGuidance, setShowGuidance] = useState(false);

    // Initial delay breathing
    useEffect(() => {
        let timer: any;
        if (isPlatformStep && isPlatformSelected) {
            timer = setTimeout(() => {
                setIsBreathing(true);
                setShowGuidance(true);
            }, 2000);
        } else {
            setIsBreathing(false);
            setShowGuidance(false);
        }
        return () => clearTimeout(timer);
    }, [isPlatformStep, isPlatformSelected]);

    // Reaction to selection trigger
    useEffect(() => {
        if (selectionTrigger > 0 && isPlatformStep && isPlatformSelected) {
            setIsPopping(true);
            setIsBreathing(true);
            setShowGuidance(true);
            const timer = setTimeout(() => setIsPopping(false), 600);
            return () => clearTimeout(timer);
        }
    }, [selectionTrigger, isPlatformStep, isPlatformSelected]);

    // Dynamic SVG Path Generation
    const [width, setWidth] = useState(375);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            } else if (typeof window !== 'undefined') {
                setWidth(window.innerWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [isDrawerOpen]); // Re-calculate when drawer state changes to ensure correct rendering

    // Simplified curved background constants
    const footerHeight = 84;
    const cornerRadius = 42;

    // Simplified curved background path
    const path = `
        M 0 ${cornerRadius}
        Q 0 0 ${cornerRadius} 0
        L ${width - cornerRadius} 0
        Q ${width} 0 ${width} ${cornerRadius}
        L ${width} ${footerHeight - cornerRadius}
        Q ${width} ${footerHeight} ${width - cornerRadius} ${footerHeight}
        L ${cornerRadius} ${footerHeight}
        Q 0 ${footerHeight} 0 ${footerHeight - cornerRadius}
        Z
    `;

    return (
        <div
            ref={containerRef}
            className={`absolute bottom-8 left-0 right-0 z-[150] px-4 bg-transparent transition-all duration-500 pb-safe ${isDrawerOpen ? 'opacity-0 translate-y-20 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}`}
        >
            <div className="relative w-full h-[84px] pointer-events-auto">

                {/* SVG Background Shape (Simple curved rectangle) */}
                <svg width="100%" height={footerHeight} viewBox={`0 0 ${width} ${footerHeight}`} className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                        <filter id="navShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="15" floodOpacity="0.08" />
                        </filter>
                    </defs>
                    <path d={path} fill="#FFFFFF" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" filter="url(#navShadow)" />
                </svg>

                {/* Navigation Items Container (5 Tabs) */}
                <div className={`absolute inset-0 flex items-center justify-between px-2 pt-1 ${isDrawerOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}>

                    {/* 1. Home */}
                    <button
                        onClick={() => onTabChange('home')}
                        className="flex-1 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                        <CustomHome active={activeTab === 'home'} />
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${activeTab === 'home' ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>Home</span>
                    </button>

                    {/* 2. Style */}
                    <button
                        onClick={() => onTabChange('learning')}
                        className="flex-1 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                        <CustomAvatar active={activeTab === 'learning'} />
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${activeTab === 'learning' ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>Style</span>
                    </button>

                    {/* 3. Central Action (Pencil) */}
                    <div className="flex-1 flex flex-col items-center justify-center relative -mt-6">
                        {/* Guidance Tooltip */}
                        <div className={`absolute top-[-50px] left-1/2 -translate-x-1/2 z-[220] transition-all duration-500 ${isPlatformStep && showGuidance && isPlatformSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                            <div className="px-3 py-1.5 bg-[#2b2b2f] text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-xl shadow-xl whitespace-nowrap border border-white/10">
                                <span>内容入力</span>
                            </div>
                        </div>

                        <button
                            onClick={onPlusClick}
                            disabled={!isPlatformSelected || isGenerating}
                            className={`
                                relative w-14 h-14 rounded-full flex items-center justify-center 
                                transition-all duration-300 shadow-lg border-4 border-white
                                ${isConfirmStep ? 'bg-sunset text-white scale-110' : 'bg-sunset text-white'}
                                ${isPopping ? 'animate-elastic-bounce' : ''}
                                ${isBreathing && !isPopping ? 'animate-pulse-gentle' : ''}
                                ${(!isPlatformSelected || isGenerating) ? 'opacity-40 grayscale' : ''}
                            `}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                            <div className="relative">
                                {isGenerating ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : isConfirmStep ? (
                                    <SparklesIcon className="w-7 h-7" />
                                ) : (
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* 4. History */}
                    <button
                        onClick={() => onTabChange('history')}
                        className="flex-1 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                        <CustomHistory active={activeTab === 'history'} />
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${activeTab === 'history' ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>History</span>
                    </button>

                    {/* 5. Settings */}
                    <button
                        onClick={() => onTabChange('settings')}
                        className="flex-1 flex flex-col items-center gap-1.5 transition-all active:scale-95"
                    >
                        <CustomSettings active={activeTab === 'settings'} />
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${activeTab === 'settings' ? 'text-[#2b2b2f]' : 'text-slate-400'}`}>Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
