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

                {/* Left: Brand Space */}
                <div className="flex items-center gap-4">
                    <span className="text-2xl tracking-tighter drop-shadow-none font-black text-black">{UI.name}</span>

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
