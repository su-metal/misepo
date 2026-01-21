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
            <div className="bg-white py-3 px-8 flex items-center justify-between gap-4 transition-all duration-300 rounded-full border-2 border-primary shadow-[4px_4px_0px_0px_var(--primary)]">

                {/* Left: Brand Space */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-primary tracking-tighter drop-shadow-none">MisePo</span>

                    {/* Status Badge - Pop Style */}
                    <div className="flex items-center">
                        {isTrial ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 border-2 border-slate-300 rounded-full">
                                <StarIcon className="w-3 h-3 text-slate-500 fill-current animate-pulse" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Free Trial</span>
                            </div>
                        ) : isPro ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-accent border-2 border-primary rounded-full shadow-[2px_2px_0px_0px_var(--primary)]">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Pro Plan</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-slate-200 rounded-full">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Free Plan</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Consolidated Menu */}
                <div className="flex items-center">
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-3 pl-4 md:pl-6 pr-2 md:pr-4 py-2 rounded-2xl bg-white text-primary hover:bg-slate-50 transition-all active:scale-95 group border-2 border-primary shadow-[3px_3px_0px_0px_var(--primary)] active:shadow-[1px_1px_0px_0px_var(--primary)] active:translate-x-[2px] active:translate-y-[2px]"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                            <span className="text-xs md:text-sm font-black text-white">
                                {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <span className="text-[11px] font-black tracking-[0.2em] hidden md:inline ml-1">MENU</span>
                        <MenuIcon className="w-4 h-4 text-primary transition-colors ml-1" />
                    </button>
                </div>
            </div>
        </header>
    );
};
