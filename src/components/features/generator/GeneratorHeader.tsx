import React from 'react';
import { MenuIcon, StarIcon } from '../../Icons';
import { StoreProfile, UserPlan } from '../../../types';
import { UI, TOKENS } from '../../../constants';

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
            <div className={`py-3 px-8 flex items-center justify-between gap-4 transition-all duration-300 ${TOKENS.container}`}>

                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xl sm:text-2xl tracking-tighter drop-shadow-none font-black text-black whitespace-nowrap">{UI.name}</span>

                    {/* Usage Badge (Subtle & Rounded) */}
                    {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                        <div className="flex flex-col items-start px-3 py-1.5 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-2xl">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 leading-none">
                                <span className="tracking-tighter">残り:</span>
                                <span className={`text-sm font-black tracking-tight ${plan.limit - plan.usage <= 0 ? 'text-red-500' : 'text-slate-900'}`}>
                                    {Math.max(0, plan.limit - plan.usage)}
                                </span>
                                <span className="opacity-40">/ {plan.limit}</span>
                                <span className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded-md text-[8px] text-slate-400">
                                    {plan.usage_period === 'monthly' ? '月' : '日'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Consolidated Menu */}
                <div className="flex items-center">
                    <button
                        onClick={onOpenHistory}
                        className="flex items-center gap-3 pl-4 md:pl-6 pr-2 md:pr-4 py-2 transition-all active:scale-95 group"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[#4DB39A] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                            <span className="text-xs md:text-sm font-black text-black">
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
