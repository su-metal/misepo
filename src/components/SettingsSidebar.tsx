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
        variant?: "white" | "lavender" | "rose" | "gold"
    }) => (
        <button
            onClick={() => { onClick(); toggleOpen(); }}
            className={`
        w-full p-4 rounded-3xl border-2 border-black flex items-center gap-4 transition-all
        shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] 
        active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]
        ${variant === "white" ? "bg-white" : ""}
        ${variant === "lavender" ? "bg-[var(--lavender)]" : ""}
        ${variant === "rose" ? "bg-[var(--rose)]" : ""}
        ${variant === "gold" ? "bg-[var(--gold)]" : ""}
      `}
        >
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-black flex items-center justify-center shrink-0 shadow-sm">
                <Icon className="w-6 h-6 text-black" />
            </div>
            <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-black text-black tracking-tight">{label}</p>
                {subLabel && <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest">{subLabel}</p>}
            </div>
            <ChevronDownIcon className="w-4 h-4 text-slate-300 -rotate-90" />
        </button>
    );

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9990] transition-opacity duration-300"
                    onClick={toggleOpen}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full bg-[var(--bg-beige)] border-l-[3px] border-black w-[85vw] sm:w-[400px] md:w-[480px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0 shadow-[-8px_0_0_0_rgba(0,0,0,0.1)]' : 'translate-x-full shadow-none'}`}
            >
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b-[3px] border-black bg-white/50">
                    <div>
                        <h2 className="font-black text-black text-3xl tracking-tighter uppercase italic">Settings</h2>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Configure your experience</p>
                    </div>
                    <button
                        onClick={toggleOpen}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 bg-white border-2 border-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--rose)]"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8 bg-[var(--bg-beige)] no-scrollbar">

                    {isLoggedIn ? (
                        <>
                            {/* Profile Section */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <UserCircleIcon className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500 text-slate-400">Profile & Plan</span>
                                </div>

                                <div className="p-1 bg-white border-2 border-black rounded-[32px] shadow-[6px_6px_0_0_rgba(0,0,0,1)] overflow-hidden">
                                    <button
                                        onClick={() => { onOpenStoreProfile(); toggleOpen(); }}
                                        className="w-full p-6 text-left flex items-center gap-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-16 h-16 rounded-[24px] bg-[var(--lavender)] border-2 border-black flex items-center justify-center text-2xl font-black shadow-inner">
                                            {(storeProfile?.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-black text-lg tracking-tight truncate">{storeProfile?.name || 'Store Name'}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest">
                                                    {plan?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">Manage Store Profile</span>
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-slate-100 border-2 border-transparent group-hover:border-black transition-all">
                                            <SparklesIcon className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </button>
                                </div>
                            </section>

                            {/* Menu Grid */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <CreditCardIcon className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">Preferences</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <MenuItem
                                        icon={ShieldCheckIcon}
                                        label="Account Settings"
                                        subLabel="Email, Subscription & Plan"
                                        onClick={onOpenAccount}
                                        variant="white"
                                    />
                                    <MenuItem
                                        icon={BookOpenIcon}
                                        label="Guide & Documentation"
                                        subLabel="How to use MisePo"
                                        onClick={onOpenGuide}
                                        variant="white"
                                    />

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 px-1 mb-4">
                                            <MessageSquareIcon className="w-4 h-4 text-slate-400" />
                                            <span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">Feedback</span>
                                        </div>
                                        <Feedback mode="sidebar" />
                                    </div>
                                </div>
                            </section>

                            {/* Sign Out */}
                            <div className="pt-8 flex flex-col items-center gap-4">
                                <button
                                    onClick={() => { onLogout(); toggleOpen(); }}
                                    className="px-8 py-3 rounded-2xl border-2 border-black bg-white text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--rose)] hover:translate-y-[-2px] active:translate-y-[0px] transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOutIcon className="w-4 h-4" />
                                        Sign Out
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-20 h-20 bg-white border-2 border-black rounded-[32px] flex items-center justify-center mb-6 shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
                                <UserCircleIcon className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="font-black text-black text-xl mb-2">ログインが必要です</h3>
                            <p className="text-xs font-bold text-slate-500 mb-8 max-w-[200px]">
                                設定を変更するにはログイン、または新規登録を行ってください。
                            </p>
                            <button
                                onClick={() => { onOpenLogin(); toggleOpen(); }}
                                className="w-full py-4 bg-[var(--gold)] text-black border-2 border-black rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] font-black uppercase tracking-[.2em] hover:translate-y-[-2px] transition-all"
                            >
                                Login / Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer: Legal */}
                <div className="p-8 border-t-[3px] border-black bg-white">
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-6">
                        <a href="/terms" className="text-[10px] font-black text-slate-400 hover:text-black transition-colors uppercase tracking-[.2em]">Terms</a>
                        <a href="/privacy" className="text-[10px] font-black text-slate-400 hover:text-black transition-colors uppercase tracking-[.2em]">Privacy</a>
                        <a href="/commercial-law" className="text-[10px] font-black text-slate-400 hover:text-black transition-colors uppercase tracking-[.2em]">Legal Notice</a>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 text-center uppercase tracking-[0.4em]">© 2026 {UI.name} • v2.0</p>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;
