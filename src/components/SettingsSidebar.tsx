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
        w-full p-4 rounded-2xl border border-stone-100 flex items-center gap-4 transition-all duration-300
        hover:bg-indigo-50/50 hover:border-indigo-100/50 active:scale-[0.98]
        ${variant === "white" ? "bg-white shadow-sm" : ""}
        ${variant === "lavender" ? "bg-indigo-50/30" : ""}
        ${variant === "stone" ? "bg-stone-50" : ""}
      `}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${variant === 'lavender' ? 'bg-indigo-100 text-indigo-600' : 'bg-stone-100 text-stone-500'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-800 tracking-tight">{label}</p>
                {subLabel && <p className="text-[10px] font-medium text-stone-400 truncate tracking-wide">{subLabel}</p>}
            </div>
            <ChevronDownIcon className="w-4 h-4 text-stone-300 -rotate-90 group-hover:text-indigo-300" />
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
                className={`fixed top-0 right-0 h-full bg-stone-50 w-[85vw] sm:w-[400px] md:w-[440px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full shadow-none'}`}
            >
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-stone-100 bg-white">
                    <div>
                        <h2 className="font-black text-stone-900 text-2xl tracking-tight">Settings</h2>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">Application Settings</p>
                    </div>
                    <button
                        onClick={toggleOpen}
                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-90 bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
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
                                <span className="px-1 text-[10px] font-black uppercase tracking-[.2em] text-stone-400">Profile & Plan</span>

                                {/* Upgrade Promotion Card */}
                                {plan?.plan === 'trial' && (
                                    <div className="bg-gradient-to-br from-[#1f29fc] to-[#7F5AF0] rounded-[2.5rem] p-7 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                                        {/* Decorative backgrounds */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                                                    <SparklesIcon className="w-4 h-4 text-accent" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Premium Access</span>
                                            </div>

                                            <h3 className="text-xl font-black leading-tight mb-3 tracking-tighter">
                                                プロプランで<br />制限を解除
                                            </h3>

                                            <p className="text-[11px] font-bold text-white/70 mb-6 leading-relaxed">
                                                全ての機能と無制限の生成、<br />高度な分析をご利用いただけます。
                                            </p>

                                            <button
                                                onClick={() => { onOpenAccount(); toggleOpen(); }}
                                                className="w-full py-4 bg-white text-[#1f29fc] rounded-[1.25rem] font-black text-xs uppercase tracking-[0.15em] hover:bg-accent hover:text-white transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                                            >
                                                Subscribe to Pro
                                                <ChevronDownIcon className="w-4 h-4 -rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => { onOpenStoreProfile(); toggleOpen(); }}
                                    className="group w-full p-1 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 text-left"
                                >
                                    <div className="p-5 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#1f29fc] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-slate-200">
                                            {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-stone-900 text-lg tracking-tight truncate">{storeProfile?.name || 'Store Name'}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[9px] font-bold uppercase tracking-wider border border-indigo-100/50">
                                                    {plan?.plan === 'entry' ? 'Entry Plan' :
                                                        plan?.plan === 'standard' ? 'Standard Plan' :
                                                            plan?.plan === 'professional' ? 'Professional Plan' :
                                                                plan?.plan === 'pro' || plan?.plan === 'monthly' || plan?.plan === 'yearly' ? 'Pro Plan' :
                                                                    'Free Plan'}
                                                </span>
                                                <span className="text-[10px] font-medium text-stone-400 group-hover:text-indigo-400 transition-colors">Edit Store Profile</span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </section>

                            {/* Menu Grid */}
                            <section className="space-y-4">
                                <span className="px-1 text-[10px] font-black uppercase tracking-[.2em] text-stone-400">Preferences</span>

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
                                        <div className="flex items-center gap-2 px-1 mb-4">
                                            <MessageSquareIcon className="w-4 h-4 text-stone-400" />
                                            <span className="text-[10px] font-black uppercase tracking-[.2em] text-stone-400">Feedback</span>
                                        </div>
                                        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                                            <Feedback mode="sidebar" />
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-white border border-stone-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-sm">
                                <UserCircleIcon className="w-10 h-10 text-stone-200" />
                            </div>
                            <h3 className="font-bold text-stone-900 text-xl mb-2">ログインが必要です</h3>
                            <p className="text-xs font-medium text-stone-400 mb-8 max-w-[200px]">
                                設定を変更するにはログイン、または新規登録を行ってください。
                            </p>
                            <button
                                onClick={() => { onOpenLogin(); toggleOpen(); }}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-indigo-100 font-bold uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer: Legal & Logic */}
                <div className="p-8 border-t border-stone-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-20">
                    {/* Sign Out Button - Sticky in Footer */}
                    {isLoggedIn && (
                        <div className="mb-8">
                            <button
                                onClick={() => { onLogout(); toggleOpen(); }}
                                className="w-full py-4 rounded-2xl bg-stone-50 text-stone-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 border border-stone-100 flex items-center justify-center gap-3"
                            >
                                <LogOutIcon className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-6">
                        <a href="/terms" className="text-[10px] font-bold text-stone-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">Terms</a>
                        <a href="/privacy" className="text-[10px] font-bold text-stone-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">Privacy</a>
                        <a href="/commercial-law" className="text-[10px] font-bold text-stone-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">Legal Notice</a>
                    </div>
                    <p className="text-[9px] font-bold text-stone-300 text-center uppercase tracking-[0.4em]">© 2026 {UI.name}</p>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;
