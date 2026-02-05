import React from 'react';
import { StoreProfile, UserPlan, Preset } from '../types';
import {
    CloseIcon,
    HelpIcon,
    LogOutIcon,
    ChevronDownIcon,
    UserCircleIcon,
    SparklesIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    BookOpenIcon,
    MessageSquareIcon
} from './Icons';
import { Feedback } from './Feedback';
import { UI, TOKENS } from '../constants';
import { useRouter } from 'next/navigation';

interface SettingsSidebarProps {
    isOpen: boolean;
    toggleOpen: () => void;
    isLoggedIn: boolean;
    onOpenLogin: () => void;
    onOpenStoreProfile: () => void;
    onOpenAccount: () => void;
    onOpenGuide: () => void;
    onLogout: () => void;
    storeProfile: StoreProfile | null;
    plan: UserPlan;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
    isOpen,
    toggleOpen,
    isLoggedIn,
    onOpenLogin,
    onOpenStoreProfile,
    onOpenAccount,
    onOpenGuide,
    onLogout,
    storeProfile,
    plan,
}) => {
    const router = useRouter();

    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const MenuItem = ({
        icon: Icon,
        label,
        subLabel,
        onClick,
        variant = "white"
    }: {
        icon: any,
        label: string,
        subLabel?: string,
        onClick: () => void,
        variant?: "white" | "lavender" | "stone"
    }) => (
        <button
            onClick={() => { onClick(); toggleOpen(); }}
            className={`
        w-full p-4 rounded-2xl border border-slate-200 bg-white/90 shadow-lg shadow-slate-900/5 flex items-center gap-4 transition-all duration-300
        hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]
        ${variant === "lavender" ? "bg-slate-50 border-slate-200" : ""}
        ${variant === "stone" ? "bg-slate-50 border-slate-200" : ""}
      `}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variant === 'lavender' ? 'bg-slate-100 text-[#2b2b2f]' : 'bg-slate-100 text-slate-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[#2b2b2f] tracking-tight">{label}</p>
                {subLabel && <p className="text-[12px] font-medium text-slate-400 truncate tracking-wide">{subLabel}</p>}
            </div>
            <ChevronDownIcon className="w-4 h-4 text-slate-300 -rotate-90 group-hover:text-[#2b2b2f]" />
        </button>
    );

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-stone-900/20 backdrop-blur-[2px] z-[9990] transition-opacity duration-300"
                    onClick={toggleOpen}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full bg-slate-50 w-[85vw] sm:w-[400px] md:w-[440px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}`}
            >
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 bg-white">
                    <div>
                        <h2 className="font-black text-[#2b2b2f] text-2xl tracking-tight">Settings</h2>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Application Settings</p>
                    </div>
                    <button
                        onClick={toggleOpen}
                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-[#2b2b2f]"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8 no-scrollbar">

                    {isLoggedIn ? (
                        <>
                            {/* Profile Section */}
                            <section className="space-y-4">
                                <span className="px-1 text-[12px] font-black uppercase tracking-[.2em] text-slate-400">Profile & Plan</span>

                                { /* Upgrade Promotion Card */}
                                {plan?.plan === 'trial' && (
                                    <div className="bg-white rounded-[2rem] p-5 text-[#2b2b2f] shadow-xl border border-slate-100 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50">
                                                    <SparklesIcon className="w-3.5 h-3.5 text-[#C084FC]" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Premium Access</span>
                                                </div>
                                                <button
                                                    onClick={() => { router.push('/start?upgrade=true'); toggleOpen(); }}
                                                    className="px-4 py-1.5 bg-[#2b2b2f] text-white rounded-full font-black text-[9px] uppercase tracking-wider hover:bg-black transition-all active:scale-95 shadow-md shadow-black/10 flex items-center gap-1.5"
                                                >
                                                    Upgrade
                                                    <ChevronDownIcon className="w-3 h-3 -rotate-90" />
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-end mb-2">
                                                <h3 className="text-[15px] font-black text-[#2b2b2f] leading-tight tracking-tight">
                                                    上位プランで生成枠を拡大
                                                </h3>
                                                <div className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">
                                                        <span>CREDITS</span>
                                                        <span className="text-[#2b2b2f] font-black">{Math.max(0, (plan.limit || 5) - (plan.usage || 0))}</span>
                                                        <span>/</span>
                                                        <span>{plan.limit || 5}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Usage Bar (Remaining Credits Logic) */}
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#F87171] via-[#C084FC] to-[#60A5FA] rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.max(0, Math.min((((plan.limit || 5) - (plan.usage || 0)) / (plan.limit || 5)) * 100, 100))}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Bottom Accent Bar */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F87171] via-[#C084FC] to-[#60A5FA] opacity-30" />
                                    </div>
                                )}

                                <button
                                    onClick={() => { onOpenStoreProfile(); toggleOpen(); }}
                                    className="group w-full p-1 bg-white/90 border border-slate-200 rounded-[2rem] shadow-lg shadow-slate-900/5 hover:shadow-xl hover:border-slate-300 transition-all duration-300 text-left"
                                >
                                    <div className="p-5 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#2b2b2f] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-black/10">
                                            {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-[#2b2b2f] text-lg tracking-tight truncate">{storeProfile?.name || 'Store Name'}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#2b2b2f] text-[10px] font-bold uppercase tracking-wider border border-slate-200/50">
                                                    {plan?.plan === 'entry' ? 'Entry Plan' :
                                                        plan?.plan === 'standard' ? 'Standard Plan' :
                                                            plan?.plan === 'professional' ? 'Professional Plan' :
                                                                plan?.plan === 'trial' ? 'Trial Plan' :
                                                                    'Free Plan'}
                                                </span>
                                                <span className="text-[12px] font-medium text-slate-400 group-hover:text-[#2b2b2f] transition-colors font-bold">Edit Store Profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </section>

                            {/* Menu Grid */}
                            <section className="space-y-4">
                                <span className="px-1 text-[12px] font-black uppercase tracking-[.2em] text-slate-400">Preferences</span>

                                <div className="space-y-3">
                                    <MenuItem
                                        icon={ShieldCheckIcon}
                                        label="アカウント"
                                        subLabel="Email, Subscription & Plan"
                                        onClick={onOpenAccount}
                                    />
                                    <MenuItem
                                        icon={BookOpenIcon}
                                        label="使い方ガイド"
                                        subLabel="How to use MisePo"
                                        onClick={onOpenGuide}
                                    />

                                    <div className="pt-2">
                                        <Feedback mode="sidebar" />
                                    </div>
                                </div>
                            </section>

                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                                <UserCircleIcon className="w-10 h-10 text-slate-200" />
                            </div>
                            <h3 className="font-bold text-[#2b2b2f] text-xl mb-2">ログインが必要です</h3>
                            <p className="text-[12px] font-bold text-slate-400 mb-8 max-w-[200px] leading-relaxed">
                                設定を変更するにはログイン、または新規登録を行ってください。
                            </p>
                            <button
                                onClick={() => { onOpenLogin(); toggleOpen(); }}
                                className="w-full py-5 bg-[#2b2b2f] text-white rounded-2xl shadow-xl shadow-black/5 font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer: Legal & Logic */}
                <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-20">
                    {/* Sign Out Button - Sticky in Footer */}
                    {isLoggedIn && (
                        <div className="mb-8">
                            <button
                                onClick={() => { onLogout(); toggleOpen(); }}
                                className="w-full py-4 rounded-2xl bg-white/90 text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 border border-slate-200 shadow-lg shadow-slate-900/10 flex items-center justify-center gap-3"
                            >
                                <LogOutIcon className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-6">
                        <a href="/terms" className="text-[11px] font-bold text-slate-400 hover:text-[#2b2b2f] transition-colors uppercase tracking-widest">Terms</a>
                        <a href="/privacy" className="text-[11px] font-bold text-slate-400 hover:text-[#2b2b2f] transition-colors uppercase tracking-widest">Privacy</a>
                        <a href="/commercial-law" className="text-[11px] font-bold text-slate-400 hover:text-[#2b2b2f] transition-colors uppercase tracking-widest">Legal Notice</a>
                    </div>
                    <p className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-[0.4em]">© 2026 {UI.name}</p>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;
