
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

    const isPro = plan?.status === 'active';

    return createPortal(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-[200] animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ring-1 ring-white/50"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">アカウント設定</h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">

                    {/* User Profile Card */}
                    <div className="flex items-center gap-5">
                        <div className="relative shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-[24px] object-cover ring-4 ring-slate-50 shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-[24px] bg-indigo-50 ring-4 ring-slate-50 flex items-center justify-center text-2xl font-black text-indigo-300 shadow-lg">
                                    {(user?.email?.[0] || 'U').toUpperCase()}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-slate-800 truncate leading-tight tracking-tight">
                                {user?.user_metadata?.full_name || 'User'}
                            </h3>
                            <p className="text-sm font-bold text-slate-400 truncate mt-1">{user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">
                                    Google Account
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Plan Status */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-1 h-4 rounded-full ${isPro ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                            <label className="text-xs font-black text-slate-800 uppercase tracking-widest">
                                現在のプラン
                            </label>
                        </div>

                        <div className={`p-1 rounded-[24px] ${isPro ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-100'}`}>
                            <div className="bg-white rounded-[23px] p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isPro ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <StarIcon className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-lg font-black tracking-tight ${isPro ? 'text-slate-800' : 'text-slate-500'}`}>
                                                {isPro ? 'Pro Plan' : 'Free Plan'}
                                            </span>
                                            {isPro && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active</span>}
                                        </div>
                                        <p className="text-xs font-bold text-slate-400">
                                            {isPro
                                                ? 'すべての機能が無制限で利用可能です'
                                                : '現在、生成回数に制限があります'}
                                        </p>
                                    </div>
                                </div>
                                {!isPro && (
                                    <a href="/pricing" className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-widest shrink-0">
                                        Upgrade
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100"></div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <a
                            href="https://billing.stripe.com/p/login/test_..."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:bg-slate-50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-700 group-hover:text-indigo-900 transition-colors">お支払い・サブスクリプション</p>
                                    <p className="text-[10px] font-bold text-slate-400">Stripeの管理画面を開きます</p>
                                </div>
                            </div>
                            <ExternalLinkIcon className="w-4 h-4 text-slate-300 group-hover:text-indigo-300" />
                        </a>

                        <button
                            onClick={onLogout}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-rose-500 group-hover:bg-rose-100 transition-colors">
                                    <LogOutIcon className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-black text-slate-700 group-hover:text-rose-600 transition-colors">ログアウト</p>
                            </div>
                        </button>
                    </div>

                    <p className="text-[10px] font-bold text-slate-300 text-center pt-2">
                        User ID: {user?.id}
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AccountSettingsModal;
