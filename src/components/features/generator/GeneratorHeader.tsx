import React from 'react';
import { MenuIcon, StarIcon } from '../../Icons';
import { StoreProfile, UserPlan } from '../../../types';

interface GeneratorHeaderProps {
    onOpenHistory: () => void;
    storeProfile: StoreProfile;
    plan: UserPlan;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({
    onOpenHistory,
    storeProfile,
    plan,
}) => {
    const now = Date.now();
    const trialEndsMs = plan?.trial_ends_at ? new Date(plan.trial_ends_at).getTime() : 0;
    const isTrial = trialEndsMs > now;
    const isPro = plan?.status === 'active';

    return (
        <header className="sticky top-4 z-[100] w-full sm:px-0">
            <div className="bg-white py-3 px-8 flex items-center justify-between gap-4 transition-all duration-300 rounded-2xl border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

                {/* Left: Brand Space */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-black tracking-tighter drop-shadow-none">MisePo</span>

                    {/* Status Badge - Pop Style */}
                    <div className="flex items-center">
                        {isTrial ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 border-[2px] border-gray-300 rounded-xl">
                                <StarIcon className="w-3 h-3 text-gray-500 fill-current animate-pulse" />
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none">Free Trial</span>
                            </div>
                        ) : isPro ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#F5CC6D] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                                <span className="text-[10px] font-black text-black uppercase tracking-widest leading-none">Pro Plan</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border-[2px] border-gray-200 rounded-xl">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Free Plan</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Consolidated Menu */}
                <div className="flex items-center">
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-3 pl-4 md:pl-6 pr-2 md:pr-4 py-2 transition-all active:scale-95 group"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#4DB39A] border-[2px] border-black flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <span className="text-xs md:text-sm font-black text-white">
                                {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <span className="text-[11px] font-black text-black tracking-[0.2em] hidden md:inline ml-1">MENU</span>
                        <MenuIcon className="w-4 h-4 text-black transition-colors ml-1" />
                    </button>
                </div>
            </div>
        </header>
    );
};
