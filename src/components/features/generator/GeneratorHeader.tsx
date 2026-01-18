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
        <header className="sticky top-4 z-[100] w-full">
            <div className="bg-white/60 backdrop-blur-2xl border border-stone-200 rounded-[2rem] py-2 flex items-center justify-between gap-4 shadow-xl shadow-stone-200/50">

                {/* Left: Brand Space */}
                <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-stone-800 tracking-tighter pl-4">MisePo</span>

                    {/* Status Badge */}
                    <div className="flex items-center">
                        {isTrial ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-lime/10 border border-lime/20 rounded-full shadow-sm">
                                <StarIcon className="w-3 h-3 text-lime fill-current animate-pulse" />
                                <span className="text-[9px] font-black text-lime-700 uppercase tracking-widest">Free Trial</span>
                            </div>
                        ) : isPro ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full shadow-lg shadow-black/10">
                                <div className="w-1.5 h-1.5 rounded-full bg-lime"></div>
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Pro Plan</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-200 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div>
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Free Plan</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Consolidated Menu */}
                <div className="flex items-center pr-1">
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-2 pl-3 md:pl-5 pr-2 md:pr-4 py-1.5 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-lg shadow-black/10 active:scale-95 group"
                    >
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
                            <span className="text-[9px] md:text-[10px] font-black text-white/90">
                                {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <span className="text-[10px] font-black tracking-widest hidden md:inline">MENU</span>
                        <MenuIcon className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors ml-1" />
                    </button>
                </div>
            </div>
        </header>
    );
};
