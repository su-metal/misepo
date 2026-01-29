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
 * Stylish Custom Icons for Footer
 */
const CustomHome = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10Z"
            stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            fill={active ? "rgba(245, 204, 109, 0.1)" : "none"} />
    </svg>
);

const CustomHistory = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C9.5 3 7.25 4.01 5.6 5.6"
            stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.6 1.6V5.6H1.6" stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 7V12L15 15" stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CustomAvatar = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="7" r="4" stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
            stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 3L19 5L17 7" stroke="#F5CC6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={active ? "animate-pulse" : "hidden"} />
    </svg>
);

const CustomSettings = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke={active ? "#F5CC6D" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const MobileFooter: React.FC<MobileFooterProps> = ({
    activeTab,
    onTabChange,
    onPlusClick
}) => {
    return (
        <div className="sm:hidden fixed bottom-1 left-0 right-0 z-[110] px-4 pb-4 bg-transparent pointer-events-none">
            {/* The Floating Bar Background */}
            <div className="relative h-16 w-full flex items-center justify-between px-6 bg-black rounded-[28px] overflow-visible pointer-events-auto border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

                {/* SVG Mask for the Notch */}
                {/* We use a clever trick here: just absolute position the center button and the notch background */}
                <div className="absolute top-[-26px] left-1/2 -translate-x-1/2 w-[76px] h-[76px] z-10 pointer-events-none">
                    <svg viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_-4px_10px_rgba(0,0,0,0.2)]">
                        {/* Circular white base */}
                        <circle cx="38" cy="30" r="28" fill="white" stroke="black" strokeWidth="0.5" />
                    </svg>
                </div>

                {/* The Central Plus Button Button */}
                <button
                    onClick={onPlusClick}
                    className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_8px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-all border border-black/5"
                    aria-label="New Post"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Left Side Items */}
                <div className="flex items-center gap-10 flex-1 justify-start h-full">
                    <button
                        onClick={() => onTabChange('home')}
                        className="flex flex-col items-center gap-1 transition-all active:scale-90"
                    >
                        <CustomHome active={activeTab === 'home'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === 'home' ? 'text-[#F5CC6D]' : 'text-white/40'}`}>Home</span>
                    </button>
                    <button
                        onClick={() => onTabChange('history')}
                        className="flex flex-col items-center gap-1 transition-all active:scale-90"
                    >
                        <CustomHistory active={activeTab === 'history'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === 'history' ? 'text-[#F5CC6D]' : 'text-white/40'}`}>Hist</span>
                    </button>
                </div>

                {/* Right Side Items */}
                <div className="flex items-center gap-10 flex-1 justify-end h-full">
                    <button
                        onClick={() => onTabChange('learning')}
                        className="flex flex-col items-center gap-1 transition-all active:scale-90"
                    >
                        <CustomAvatar active={activeTab === 'learning'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === 'learning' ? 'text-[#F5CC6D]' : 'text-white/40'}`}>分身</span>
                    </button>
                    <button
                        onClick={() => onTabChange('settings')}
                        className="flex flex-col items-center gap-1 transition-all active:scale-90"
                    >
                        <CustomSettings active={activeTab === 'settings'} />
                        <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === 'settings' ? 'text-[#F5CC6D]' : 'text-white/40'}`}>Set</span>
                    </button>
                </div>

                {/* The Concave Notch for the bar background */}
                {/* We use a SVG clip path or just a black SVG overlay to create the concave effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 pointer-events-none">
                    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M0 0C20 0 35 30 60 30C85 30 100 0 120 0H0Z" fill="black" />
                    </svg>
                </div>
            </div>

            {/* Safe Area Spacer for iOS/Android */}
            <div className="h-safe-bottom" />
        </div>
    );
};
