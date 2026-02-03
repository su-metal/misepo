
import React from 'react';
import { createPortal } from 'react-dom';
import { User } from '@supabase/supabase-js';
import { UserPlan } from '../types';
import { CloseIcon, LogOutIcon, StarIcon, ExternalLinkIcon } from './Icons';
import { useScrollLock } from '../hooks/useScrollLock';

interface AccountSettingsModalProps {
    user: User | null;
    plan: UserPlan;
    onClose: () => void;
    onLogout: () => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({ user, plan, onClose, onLogout }) => {
    if (typeof document === 'undefined') return null;

    const isPaid = plan?.status === 'active' && !['free', 'trial'].includes(plan?.plan || '');
    const isTrial = !!plan?.trial_ends_at && new Date(plan.trial_ends_at).getTime() > Date.now();
    const isPro = isPaid || isTrial;

    const [isPortalLoading, setIsPortalLoading] = React.useState(false);

    // Lock body scroll when modal is open
    useScrollLock();

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
            } else if (data.error === 'no_active_subscription') {
                alert('トライアル中、または有効なサブスクリプションがないため、管理ポータルを開けません。プランの変更や解約は有料プラン移行後に可能になります。');
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with blur - VisionOS Style */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container - Premium Modern */}
            <div
                className="relative w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 rounded-[40px] bg-white shadow-2xl ring-1 ring-black/5"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Account</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors active:scale-95"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-8 pb-10 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">

                    {/* User Profile - Clean & Minimal */}
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-[24px] object-cover shadow-md"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-[24px] flex items-center justify-center text-2xl font-black text-[#7F5AF0] bg-indigo-50 shadow-sm">
                                    {(user?.email?.[0] || 'U').toUpperCase()}
                                </div>
                            )}
                            {/* Google Icon Badge */}
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md z-10 p-1.5">
                                <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-slate-800 truncate leading-tight tracking-tight">
                                {user?.user_metadata?.full_name || 'Guest User'}
                            </h3>
                            <p className="text-sm font-medium text-slate-400 truncate mt-1">{user?.email}</p>
                        </div>
                    </div>

                    {/* Plan Status Card - Magical for Pro */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                            Current Plan
                        </label>

                        <div className={`relative group transition-all duration-500 rounded-[32px] overflow-hidden ${isPro ? 'p-[1.5px] shadow-xl shadow-indigo-100/50' : 'bg-slate-50 border border-slate-100'}`}>
                            {/* Prism Radiant Aura for Pro */}
                            {isPro && (
                                <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                                    <div
                                        className="absolute inset-0 opacity-100 blur-sm"
                                        style={{
                                            background: 'linear-gradient(45deg, #22D3EE, #FACC15, #F472B6)'
                                        }}
                                    />
                                </div>
                            )}

                            <div className={`relative ${isPro ? 'bg-white/95 backdrop-blur-xl rounded-[31px]' : ''} p-6 flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ${isPro ? 'bg-indigo-50 text-[#7F5AF0]' : 'bg-white text-slate-300'}`}>
                                        <StarIcon className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-lg font-black tracking-tight ${isPro ? 'text-slate-800' : 'text-slate-700'}`}>
                                                {plan?.plan === 'entry' ? 'Entry Plan' :
                                                    plan?.plan === 'standard' ? 'Standard Plan' :
                                                        plan?.plan === 'professional' ? 'Professional Plan' :
                                                            isTrial ? 'Trial Plan' :
                                                                'Free Plan'}
                                            </span>
                                            {isPro && (
                                                <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-indigo-50 text-[#7F5AF0]">
                                                    {isTrial ? 'Trialing' : 'Active'}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs font-bold ${isPro ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {isTrial
                                                ? `残り ${getTrialRemainingDays()} 日`
                                                : isPaid
                                                    ? '全ての機能が利用可能です'
                                                    : '制限付きプラン'}
                                        </p>
                                    </div>
                                </div>

                                {!isPaid && !isTrial && (
                                    <a href="/pricing" className="px-5 py-2.5 text-[10px] font-black rounded-full transition-all uppercase tracking-widest shrink-0 shadow-lg bg-[#7F5AF0] text-white hover:bg-[#6c4bd6] hover:scale-105 active:scale-95">
                                        Upgrade
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    {/* Action Cards */}
                    <div className="space-y-4">
                        <button
                            onClick={handleOpenPortal}
                            disabled={isPortalLoading}
                            className="w-full flex items-center justify-between p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 hover:-translate-y-1 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                                    {isPortalLoading ? (
                                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors">サブスクリプション管理</p>
                                    <p className="text-[10px] font-bold text-slate-400">
                                        {!isPaid ? '有料プラン移行後に利用可能' : 'プラン確認・変更・履歴'}
                                    </p>
                                </div>
                            </div>
                            <ExternalLinkIcon className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </button>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-between p-5 rounded-[28px] bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-100 hover:-translate-y-1 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                    <LogOutIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">ログアウト</p>
                                    <p className="text-[10px] font-bold text-slate-400">現在のアカウントから退出</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-rose-50 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-rose-400"><path d="M9 18l6-6-6-6" /></svg>
                            </div>
                        </button>
                    </div>

                    <p className="text-[9px] font-bold text-slate-300 text-center uppercase tracking-widest pt-4">
                        User ID: {user?.id?.slice(0, 8)}...
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AccountSettingsModal;
