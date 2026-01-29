import React from 'react';
import { MenuIcon, StarIcon } from '../../Icons';
import { StoreProfile, UserPlan } from '../../../types';
import { UI, TOKENS } from '../../../constants';

interface GeneratorHeaderProps {
    onOpenSettings: () => void;
    storeProfile: StoreProfile;
    plan: UserPlan;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({
    onOpenSettings,
    storeProfile,
    plan,
}) => {
    return (
        <header className="sticky top-0 sm:top-4 z-[100] w-full sm:px-0">
            <div className={`py-4 px-6 sm:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${TOKENS.container} bg-white/80 backdrop-blur-md border border-white/50 shadow-sm sm:rounded-[32px]`}>

                {/* Left: Brand & Store Info */}
                <div className="flex items-center gap-4">
                    {/* Stylized Logo Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[var(--plexo-black)] border border-[#EEEEEE] shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                        <span className="text-[var(--plexo-yellow)] font-black text-xl" style={{ transform: 'rotate(-10deg)', marginTop: '2px' }}>ミ</span>
                    </div>

                    {/* Typography */}
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] leading-none mb-1">Welcome</span>
                        <div className="flex items-end gap-2">
                            <span className="text-xl font-black text-[var(--plexo-black)] tracking-tight leading-none">{storeProfile?.name || 'Store Admin'}</span>
                            {plan?.plan === 'pro' && (
                                <span className="mb-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[var(--plexo-black)] text-[var(--plexo-yellow)] leading-none">PRO</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Credits & Menu */}
                <div className="flex items-center gap-6">
                    {/* Usage Badge (Minimalist Pill) */}
                    {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-black text-[#AAAAAA] tracking-[0.2em] mb-1.5 uppercase leading-none">Credits</span>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#EEEEEE] shadow-sm">
                                <span className="text-sm font-black text-[var(--plexo-black)] leading-none">
                                    {Math.max(0, plan.limit - plan.usage)}
                                </span>
                                <div className="w-px h-3 bg-[#EEEEEE]" />
                                <span className="text-[10px] font-bold text-[#CCCCCC] leading-none">{plan.limit}</span>
                            </div>
                        </div>
                    )}

                    {/* Simple Menu Button */}
                    <button
                        onClick={onOpenSettings}
                        className="w-12 h-12 rounded-full bg-white hover:bg-[var(--bg-secondary)] border border-[#E5E5E5] flex items-center justify-center transition-all active:scale-90 shadow-sm group"
                    >
                        <MenuIcon className="w-5 h-5 text-[var(--plexo-black)] transition-transform group-hover:scale-110" />
                    </button>
                </div>
            </div>
        </header>
    );
};
