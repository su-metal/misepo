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
    const now = Date.now();
    const trialEndsMs = plan?.trial_ends_at ? new Date(plan.trial_ends_at).getTime() : 0;
    const isTrial = trialEndsMs > now;
    const isPro = plan?.status === 'active';

    return (
        <header className="sticky top-0 sm:top-4 z-[100] w-full sm:px-0">
            <div className={`py-3 px-6 sm:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${TOKENS.container} bg-white/80 backdrop-blur-md border border-white/50 shadow-sm sm:rounded-[32px]`}>

                <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xl sm:text-2xl tracking-tighter drop-shadow-none font-black text-[var(--plexo-black)] whitespace-nowrap">{UI.name}</span>

                    {/* Usage Badge (Subtle & Rounded) */}
                    {plan && typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                        <div className="flex flex-col items-start px-3 py-1.5 bg-white border border-[var(--plexo-med-gray)] rounded-2xl">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--plexo-dark-gray)] leading-none">
                                <span className="tracking-tighter">残り:</span>
                                <span className={`text-sm font-black tracking-tight ${plan.limit - plan.usage <= 0 ? 'text-red-500' : 'text-[var(--plexo-black)]'}`}>
                                    {Math.max(0, plan.limit - plan.usage)}
                                </span>
                                <span className="opacity-40">/ {plan.limit}</span>
                                <span className="ml-1 px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded-md text-[8px] text-[var(--plexo-med-gray)]">
                                    {plan.usage_period === 'monthly' ? '月' : '日'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center">
                    <button
                        onClick={onOpenSettings}
                        className="flex items-center gap-2 pl-3 md:pl-4 pr-1.5 md:pr-3 py-1.5 transition-all active:scale-95 group bg-white hover:bg-[var(--bg-secondary)] border border-[var(--plexo-med-gray)] hover:border-[var(--plexo-black)] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-[var(--plexo-black)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
                            <span className="text-xs md:text-sm font-black text-[var(--plexo-yellow)]">
                                {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                            </span>
                        </div>
                        <div className="flex flex-col items-start mr-1 md:mr-2">
                            <span className="text-[10px] font-black text-[var(--plexo-black)] tracking-tight hidden md:inline">{storeProfile?.name || 'MENU'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${plan?.plan === 'pro' ? 'bg-[var(--plexo-black)] text-[var(--plexo-yellow)]' : 'bg-[var(--bg-secondary)] text-[var(--plexo-med-gray)] border border-[var(--plexo-med-gray)]'}`}>
                                {plan?.plan === 'pro' ? 'PRO' : 'FREE'}
                            </span>
                        </div>
                        <MenuIcon className="w-4 h-4 text-[var(--plexo-med-gray)] group-hover:text-[var(--plexo-black)] transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
};
