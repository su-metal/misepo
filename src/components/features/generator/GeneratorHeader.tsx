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
        <header className="sticky top-4 z-[100] w-full px-2 sm:px-0">
            <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-[2.5rem] py-3 px-8 flex items-center justify-between gap-4 shadow-2xl shadow-navy-900/5 transition-all duration-500 hover:shadow-navy-900/10 hover:border-slate-200">

                {/* Left: Brand Space */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-[#001738] tracking-tighter">MisePo</span>

                    {/* Status Badge - CastMe Style */}
                    <div className="flex items-center">
                        {isTrial ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#E5005A]/5 border border-[#E5005A]/10 rounded-full shadow-sm">
                                <StarIcon className="w-3 h-3 text-[#E5005A] fill-current animate-pulse" />
                                <span className="text-[10px] font-black text-[#E5005A] uppercase tracking-widest leading-none">Free Trial</span>
                            </div>
                        ) : isPro ? (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-[#001738] border border-[#001738] rounded-full shadow-lg shadow-navy-900/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E5005A]"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Pro Plan</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Free Plan</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Consolidated Menu */}
                <div className="flex items-center">
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-3 pl-4 md:pl-6 pr-2 md:pr-4 py-2 rounded-2xl bg-[#001738] text-white hover:bg-navy-900 transition-all shadow-xl shadow-navy-900/20 active:scale-95 group border border-navy-800"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                            <span className="text-xs md:text-sm font-black text-white">
                                {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <span className="text-[11px] font-black tracking-[0.2em] hidden md:inline ml-1">MENU</span>
                        <MenuIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors ml-1" />
                    </button>
                </div>
            </div>
        </header>
    );
};
