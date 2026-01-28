
import React from 'react';
import { createPortal } from 'react-dom';
import { User } from '@supabase/supabase-js';
import { UserPlan } from '../types';
import { CloseIcon, LogOutIcon, StarIcon, ExternalLinkIcon } from './Icons';

interface AccountSettingsModalProps {
    user: User | null;
    plan: UserPlan;
    onClose: () => void;
    onLogout: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ user, plan, onClose, onLogout }) => {
    if (typeof document === 'undefined') return null;

    const isPaid = plan?.status === 'active' && plan?.plan !== 'free';
    const isTrial = !!plan?.trial_ends_at && new Date(plan.trial_ends_at).getTime() > Date.now();
    const isPro = isPaid || isTrial;

    const [isPortalLoading, setIsPortalLoading] = React.useState(false);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const getTrialRemainingDays = () => {
        if (!plan?.trial_ends_at) return 0;
        const remaining = new Date(plan.trial_ends_at).getTime() - Date.now();
        return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
    };

    const handleOpenPortal = async () => {
        setIsPortalLoading(true);
        try {
            const res = await fetch('/api/billing/portal', { method: 'POST' });
            const data = await res.json();
            if (data.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert('ポータルの起動に失敗しました。');
            }
        } catch (err) {
            console.error('Portal error:', err);
            alert('通信エラーが発生しました。');
        } finally {
            setIsPortalLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-[200] animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="w-full max-w-lg max-h-[90dvh] flex flex-col rounded-[32px] overflow-hidden animate-in zoom-in-95 duration-300 bg-[var(--bg-beige)] border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-5 border-b-[3px] flex items-center justify-between sticky top-0 z-20 bg-white border-black">
                    <h2 className="text-xl font-black text-black tracking-tight uppercase">Account Settings</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95 bg-white border-2 border-black text-black hover:bg-slate-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-6 md:p-8 space-y-8 bg-[var(--bg-beige)]">

                    {/* User Profile Card */}
                    <div className="flex items-center gap-5 p-5 bg-white rounded-2xl transition-all border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                        <div className="relative shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-xl object-cover border-2 border-black"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-black text-black bg-[var(--lavender)] border-2 border-black">
                                    {(user?.email?.[0] || 'U').toUpperCase()}
                                </div>
                            )}
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 shadow-sm z-10 border-black">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-black truncate leading-tight tracking-tight">
                                {user?.user_metadata?.full_name || 'User'}
                            </h3>
                            <p className="text-xs font-bold text-slate-500 truncate mt-0.5">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-300">
                                    Google Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Plan Status */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <div className={`w-3 h-3 border-2 border-black ${isPro ? 'bg-[var(--gold)]' : 'bg-slate-300'}`}></div>
                            <label className="text-[10px] font-black text-black uppercase tracking-[0.2em]">
                                Current Plan
                            </label>
                        </div>

                        <div className={`p-4 rounded-2xl transition-all ${isPro ? 'bg-[var(--gold)]/20 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {isPro ? (
                                        <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)] ${isPro ? 'bg-[var(--gold)] text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]' : 'bg-slate-100 text-slate-400 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]'}`}>
                                            <StarIcon className="w-6 h-6 fill-current" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border-2 bg-slate-100 border-black text-slate-400 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                                            <StarIcon className="w-6 h-6 fill-current" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-lg font-black tracking-tight text-black`}>
                                                {isTrial ? 'Trial Plan' : isPaid ? 'Pro Plan' : 'Free Plan'}
                                            </span>
                                            {isPro && <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-black text-[#FFD700] border border-black">{isTrial ? 'Trialing' : 'Active'}</span>}
                                        </div>
                                        <p className="text-xs font-bold text-slate-600">
                                            {isTrial
                                                ? `無料体験中（残り ${getTrialRemainingDays()} 日）`
                                                : isPaid
                                                    ? 'Pro機能を利用中'
                                                    : 'プラン未設定'}
                                        </p>
                                    </div>
                                </div>
                                {!isPaid && !isTrial && (
                                    <a href="/pricing" className="px-4 py-2 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest shrink-0 shadow-sm bg-black text-white border-2 border-transparent hover:border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                                        Upgrade
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-[2px] bg-black/10 border-t border-dashed border-black/20"></div>

                    {/* Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={handleOpenPortal}
                            disabled={isPortalLoading}
                            className="w-full flex items-center justify-between p-4 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-500 border-2 border-black shadow-sm group-hover:bg-indigo-100 transition-colors">
                                    {isPortalLoading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-black group-hover:text-indigo-600 transition-colors">お支払い・サブスクリプション</p>
                                    <p className="text-[10px] font-bold text-slate-500">プランの確認・解約・お支払い履歴</p>
                                </div>
                            </div>
                            <ExternalLinkIcon className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-between p-4 rounded-xl transition-all group hover:bg-rose-50 bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-500 border-2 border-black shadow-sm group-hover:bg-rose-100 group-hover:text-rose-500 transition-colors">
                                    <LogOutIcon className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-black group-hover:text-rose-600 transition-colors">ログアウト</p>
                            </div>
                        </button>
                    </div>

                    <p className="text-[10px] font-black text-slate-300 text-center pt-2 uppercase tracking-widest">
                        User ID: {user?.id?.slice(0, 8)}...
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AccountSettingsModal;
