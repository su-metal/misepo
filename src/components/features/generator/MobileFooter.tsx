import React from 'react';
import {
    SparklesIcon
} from '../../Icons';

interface MobileFooterProps {
    activeTab: 'home' | 'history' | 'learning' | 'settings';
    onTabChange: (tab: 'home' | 'history' | 'learning' | 'settings') => void;
    onPlusClick: () => void;
}

/**
 * Stylish Custom Icons for Footer - Updated for Glassmorphism
 */
const CustomHome = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
            stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            fill={active ? "rgba(151, 71, 255, 0.1)" : "none"} />
    </svg>
);

const CustomHistory = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7V12L15 15" stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomAvatar = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomSettings = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke={active ? "#9747FF" : "#AFAFB8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MobileFooter: React.FC<MobileFooterProps> = ({
    activeTab,
    onTabChange,
    onPlusClick
}) => {
    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[110] px-6 pb-8 bg-transparent pointer-events-none">
            {/* The Floating Bar Background - Glassmorphic */}
            <div className="relative h-20 w-full flex items-center justify-between px-8 bg-white/80 backdrop-blur-2xl rounded-[40px] overflow-visible pointer-events-auto border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">

                {/* Visual Base for the notch/plus area */}
                <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] z-10 pointer-events-none">
                    <svg viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                        <circle cx="44" cy="34" r="32" fill="white" />
                    </svg>
                </div>

                {/* The Central Plus Button - High Contrast */}
                <button
                    onClick={onPlusClick}
                    className="absolute top-[-26px] left-1/2 -translate-x-1/2 w-16 h-16 bg-[#1F1F2F] rounded-full flex items-center justify-center z-20 shadow-xl active:scale-90 active:rotate-90 transition-all border-4 border-white"
                    aria-label="New Post"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Left Side Items */}
                <div className="flex items-center gap-12 flex-1 justify-start h-full pt-2">
                    <button
                        onClick={() => onTabChange('home')}
                        className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
                    >
                        <CustomHome active={activeTab === 'home'} />
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTab === 'home' ? 'text-[#9747FF]' : 'text-[#7C7C8C]'}`}>Home</span>
                    </button>
                    <button
                        onClick={() => onTabChange('history')}
                        className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
                    >
                        <CustomHistory active={activeTab === 'history'} />
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTab === 'history' ? 'text-[#9747FF]' : 'text-[#7C7C8C]'}`}>History</span>
                    </button>
                </div>

                {/* Right Side Items */}
                <div className="flex items-center gap-12 flex-1 justify-end h-full pt-2">
                    <button
                        onClick={() => onTabChange('learning')}
                        className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
                    >
                        <CustomAvatar active={activeTab === 'learning'} />
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTab === 'learning' ? 'text-[#9747FF]' : 'text-[#7C7C8C]'}`}>分身</span>
                    </button>
                    <button
                        onClick={() => onTabChange('settings')}
                        className="flex flex-col items-center gap-1.5 transition-all active:scale-90"
                    >
                        <CustomSettings active={activeTab === 'settings'} />
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTab === 'settings' ? 'text-[#9747FF]' : 'text-[#7C7C8C]'}`}>Setting</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
