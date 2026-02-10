import React from 'react';
import { motion } from 'framer-motion';
import { Platform } from '../../../types';
import { usePostInput } from './PostInputContext';
import {
    SparklesIcon, InstagramIcon, LineIcon, GoogleMapsIcon, ChevronRightIcon
} from '../../Icons';

interface MobilePlatformStepProps {
    isStepDrawerOpen: boolean;
    isTallViewport: boolean;
    isOmakaseLoading: boolean;
    onPlatformSelect: (p: Platform) => void;
    onCalendarOpen: () => void;
    day: number;
    month: string;
    weekday: string;
}

export const MobilePlatformStep: React.FC<MobilePlatformStepProps> = ({
    isStepDrawerOpen,
    isTallViewport,
    isOmakaseLoading,
    onPlatformSelect,
    onCalendarOpen,
    day,
    month,
    weekday
}) => {
    const {
        platforms, isMultiGen, onPlatformToggle, onToggleMultiGen,
        plan, storeProfile, onOpenOnboarding, isCalendarOpen
    } = usePostInput();

    return (
        <div className={`flex flex-col h-full min-h-0 overflow-hidden relative transition-all duration-500 ${isStepDrawerOpen ? 'blur-md scale-[0.98] opacity-60' : 'opacity-100'}`}>
            <div className="flex-1 flex flex-col p-4 pt-[max(clamp(0.75rem,2vh,1.5rem),env(safe-area-inset-top))] pb-[calc(env(safe-area-inset-bottom)+160px)] safe-area-bottom overflow-y-auto no-scrollbar">
                {/* High-Design Header - Magazine Style Date & Minimal Avatar */}
                <div className="flex items-start justify-between mb-2 px-1">
                    {/* Typography Date Display - Interactive Trigger */}
                    <div className="flex flex-col cursor-pointer active:scale-95 transition-transform" onClick={onCalendarOpen}>
                        <span className="text-[10px] font-black text-[#2b2b2f]/60 uppercase tracking-[0.4em] ml-1 mb-1 z-10 relative flex items-center gap-1">
                            misepo <span className="bg-[#2b2b2f]/5 px-1 rounded text-[8px] tracking-normal text-[#2b2b2f]/80">HUB</span>
                        </span>
                        <div className="flex items-center gap-3 select-none">
                            <span className="text-[3.5rem] font-black text-[#2b2b2f] tracking-tighter leading-[0.8]">{day}</span>
                            <div className="flex flex-col justify-center gap-0.5 pt-1">
                                <span className="text-sm font-black text-[#2b2b2f] uppercase tracking-widest leading-none">{month}</span>
                                <span className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-[0.2em] leading-none">{weekday}</span>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#2b2b2f]/5 rounded-full mt-2 ml-1 self-start">
                            <p className="text-[10px] font-black text-[#2b2b2f] tracking-tight select-none flex items-center gap-1">
                                カレンダー見る <ChevronRightIcon className="w-3 h-3 text-[#2b2b2f]" />
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-3">
                            {plan?.plan !== 'professional' && plan?.plan !== 'monthly' && plan?.plan !== 'yearly' && plan?.plan !== 'pro' && (
                                <a
                                    href="/upgrade"
                                    className={`xl:hidden h-8 px-4 rounded-full text-white text-[9px] font-black uppercase tracking-[0.1em] shadow-lg active:scale-95 transition-all flex items-center gap-1.5 border border-white/20 ${plan?.canUseApp === false ? 'bg-[#E88BA3] shadow-red-500/20' : 'bg-sunset shadow-orange-500/20'}`}
                                >
                                    <SparklesIcon className="w-2.5 h-2.5" />
                                    {plan?.canUseApp === false ? 'Trial Expired' : (plan?.plan === 'trial' ? 'Go Pro' : 'Upgrade')}
                                </a>
                            )}

                            {/* Decorative Avatar (Dynamic Store Initial) */}
                            <div className="relative group cursor-pointer" onClick={onOpenOnboarding}>
                                <div className="absolute inset-0 bg-[#7F5AF0] rounded-full blur-[10px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-[2px] border-slate-100">
                                    <span className="text-[#2b2b2f] font-black text-lg" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>
                                        {storeProfile?.name?.charAt(0) || 'M'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* High-Contrast Credit Design with Gauge */}
                        {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                            <div className="flex flex-col items-end gap-1">
                                <div className="w-full max-w-[190px] flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#edeff1] text-[#2b2b2f] border border-slate-100 shadow-sm overflow-hidden relative">
                                    <span className="text-[8px] font-black text-[#2b2b2f]/40 uppercase tracking-widest mr-1">CREDITS</span>
                                    <span className="text-sm font-black text-[#2b2b2f] leading-none">
                                        {Math.max(0, plan.limit - plan.usage)}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#b0b0b0] leading-none">/ {plan.limit}</span>

                                    {/* Subtle Gauge Background */}
                                    <div className="absolute bottom-0 left-0 h-[2px] bg-slate-100 w-full" />
                                </div>
                                <div className="w-full max-w-[190px] flex items-center">
                                    <div className="w-full flex justify-between gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-[3px] w-5 rounded-full transition-colors duration-500 ${((plan.limit - plan.usage) / plan.limit) * 5 > i
                                                    ? 'bg-[#2b2b2f]'
                                                    : 'bg-slate-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`flex items-center justify-between px-[clamp(0.75rem,3vw,1rem)] mt-[clamp(0.75rem,2.5vw,0.75rem)] mb-0 ${isTallViewport ? 'pt-[clamp(0.9rem,3vw,1.25rem)]' : ''}`}
                >
                    <div className="flex flex-col gap-0.5 items-start">
                        <h2 className="text-[13px] font-black text-[#2b2b2f] tracking-tight">投稿先を選択</h2>
                        <p className="text-[10px] text-[#b0b0b0] font-bold uppercase tracking-[0.2em]">Select your canvas</p>
                    </div>

                    {/* Simultaneous Generation Toggle */}
                    <div className="flex items-center gap-3 bg-[#edeff1] px-4 py-2 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-all cursor-pointer select-none"
                        onClick={onToggleMultiGen}>
                        <div className="flex flex-col items-end">
                            <span className={`text-[11px] font-black tracking-widest uppercase leading-none mb-0.5 ${isMultiGen ? 'text-[#2b2b2f]' : 'text-[#A0A0A0]'}`}>
                                {isMultiGen ? 'ON' : 'OFF'}
                            </span>
                            <span className="text-[10px] font-bold text-[#A0A0A0] leading-none whitespace-nowrap">同時生成 <span className="text-[9px] font-black text-[#2b2b2f] opacity-60 ml-0.5">(2回分)</span></span>
                        </div>
                        <div className={`
                            relative w-10 h-5 rounded-full transition-all duration-300
                            ${isMultiGen ? 'bg-[#2b2b2f]' : 'bg-[#edeff1]'}
                        `}>
                            <div className={`
                                absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm
                                ${isMultiGen ? 'translate-x-5' : 'translate-x-0'}
                            `} />
                        </div>
                    </div>
                </div>


                {/* Standard 2x2 Grid Platform Selection */}
                <div className="grid grid-cols-2 gap-3 px-1 mt-4 auto-rows-min">
                    {(() => {
                        const getPlatformDetails = (platform: Platform, isActive: boolean) => {
                            switch (platform) {
                                case Platform.Instagram: return {
                                    name: 'Instagram',
                                    tagline: 'Visual Story',
                                    sub: '世界観と統一感',
                                    icon: <InstagramIcon className="w-10 h-10" isActive={isActive} />,
                                    color: 'from-purple-500/10 to-pink-500/10'
                                };
                                case Platform.X: return {
                                    name: 'X',
                                    tagline: 'Real-time',
                                    sub: '拡散と交流',
                                    icon: <span className="font-black text-2xl">𝕏</span>,
                                    color: 'from-gray-500/5 to-black/5'
                                };
                                case Platform.Line: return {
                                    name: 'LINE',
                                    tagline: 'Messages',
                                    sub: 'リピーター獲得',
                                    icon: <LineIcon className="w-7 h-7" isActive={isActive} activeTextFill="#1FA14D" textFill={isActive ? '#1FA14D' : '#ffffff'} />,
                                    color: 'from-green-500/10 to-emerald-500/10'
                                };
                                case Platform.GoogleMaps: return {
                                    name: 'Google Maps',
                                    tagline: 'Local Search',
                                    sub: '店舗集客とMEO対策',
                                    icon: <GoogleMapsIcon className="w-10 h-10" isActive={isActive} />,
                                    color: 'from-blue-500/10 to-red-500/10'
                                };
                                default: return { name: '', tagline: '', sub: '', icon: null, color: '' };
                            }
                        };

                        const platformsList = [Platform.Instagram, Platform.X, Platform.Line, Platform.GoogleMaps];
                        return [
                            ...platformsList.map((p) => {
                                const isActive = platforms.includes(p);
                                const details = getPlatformDetails(p, isActive);
                                let bentoClass = '';
                                if (p === Platform.Instagram) bentoClass = 'row-span-2 min-h-[clamp(210px,34vh,320px)] sm:min-h-[clamp(200px,30vh,300px)]';
                                else if (p === Platform.GoogleMaps) bentoClass = 'col-span-2 min-h-[clamp(130px,20vh,200px)] sm:min-h-[clamp(120px,18vh,180px)]';
                                else bentoClass = 'min-h-[clamp(110px,16vh,170px)] sm:min-h-[clamp(100px,14vh,150px)]';

                                const brandColor = p === Platform.Instagram ? '#D23877' :
                                    p === Platform.X ? '#111827' :
                                        p === Platform.Line ? '#1FA14D' :
                                            p === Platform.GoogleMaps ? '#3F76DF' : '#2b2b2f';

                                const cardStyle = isActive ? {
                                    backgroundColor: brandColor,
                                    borderColor: 'white',
                                    '--tw-ring-color': brandColor,
                                    '--tw-ring-offset-color': '#ffffff',
                                } : {} as React.CSSProperties;

                                const contentClass = `absolute inset-0 px-5 py-4 flex flex-col ${p === Platform.X ? 'justify-center gap-1.5' : 'justify-between'}`;

                                return (
                                    <motion.div
                                        key={p}
                                        layout
                                        onClick={() => onPlatformToggle(p)}
                                        className={`relative rounded-[30px] overflow-hidden cursor-pointer border transition-all duration-300 ease-out group ${bentoClass} ${isActive ? 'border-white ring-2 ring-offset-2' : 'bg-[#edeff1] border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] active:scale-[0.98]'}`}
                                        style={cardStyle}
                                        whileHover={{ y: -2 }}
                                    >
                                        {/* Decorative Background Elements */}
                                        {p === Platform.Instagram && (
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                <div className={`absolute top-12 -right-4 text-[40px] font-black tracking-tighter vertical-text opacity-[0.03] ${isActive ? 'text-white' : 'text-[#2b2b2f]'} select-none`} style={{ writingMode: 'vertical-rl' }}>
                                                    CREATIVE STUDIO
                                                </div>
                                                <div className={`absolute top-6 right-6 px-2 py-0.5 rounded-md border text-[7px] font-black tracking-widest uppercase ${isActive ? 'border-white/20 text-white/40' : 'border-slate-200 text-slate-300'}`}>
                                                    REEL / STORY
                                                </div>
                                            </div>
                                        )}

                                        {p === Platform.X && (
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                <div className={`absolute bottom-4 right-4 px-2 py-0.5 rounded-md border text-[7px] font-black tracking-widest uppercase ${isActive ? 'border-white/20 text-white/40' : 'border-slate-200 text-slate-300'}`}>
                                                    FEED / TREND
                                                </div>
                                            </div>
                                        )}

                                        {p === Platform.Line && (
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                {/* Subtle Chat Bubble Silhouette */}
                                                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-[10px] opacity-[0.03] ${isActive ? 'border-white' : 'border-[#2b2b2f]'}`} />
                                            </div>
                                        )}

                                        {p === Platform.GoogleMaps && (
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                <div className={`absolute -bottom-2 -right-4 text-[50px] font-black tracking-tighter opacity-[0.03] ${isActive ? 'text-white' : 'text-[#2b2b2f]'} select-none whitespace-nowrap`}>
                                                    LOCAL INDEX
                                                </div>
                                                {/* Abstract Route Line */}
                                                <svg className={`absolute top-0 right-0 w-48 h-full opacity-[0.07] ${isActive ? 'text-white' : 'text-slate-400'}`} viewBox="0 0 200 100" fill="none">
                                                    <path d="M180 20 C 140 20, 140 80, 100 80 C 60 80, 60 20, 20 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                                                    <circle cx="180" cy="20" r="3" fill="currentColor" />
                                                    <rect x="15" y="15" width="10" height="10" stroke="currentColor" strokeWidth="2" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className={contentClass}>
                                            <div className="flex justify-between items-start">
                                                <div className="transition-all duration-500 group-hover:scale-110" style={{ color: isActive ? '#ffffff' : brandColor }}>
                                                    {details.icon}
                                                </div>
                                                <div />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-[9.5px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-white/40' : 'text-[#b0b0b0]'}`}>
                                                    {details.tagline}
                                                </span>
                                                <h3 className={`text-[20px] font-black tracking-tight leading-tight ${isActive ? 'text-white' : 'text-[#2b2b2f]'}`}>
                                                    {details.name}
                                                </h3>
                                                <p className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-white/80' : 'text-[#b0b0b0]'}`}>
                                                    {details.sub}
                                                </p>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-4 right-4 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-300">
                                                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke={brandColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        ];
                    })()}
                </div>

            </div>
        </div>
    );
};
