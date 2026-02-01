import React from 'react';
import { StoreProfile, UserPlan } from '../../../types';
import { UserCircleIcon, CrownIcon, ActivityIcon, ServerIcon, DatabaseIcon } from '../../Icons';

interface StoreProfileSidebarProps {
    storeProfile: StoreProfile;
    plan: UserPlan;
}

export const StoreProfileSidebar: React.FC<StoreProfileSidebarProps> = ({ storeProfile, plan }) => {
    return (
        <div className="w-[280px] h-full flex flex-col gap-6 animate-in slide-in-from-left duration-700">
            {/* AI Monitor Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">AI Monitor</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        Online
                    </div>
                </div>

                {/* Store Identity */}
                <div className="flex flex-col gap-1 relative z-10">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-tight">
                        {storeProfile.name || 'Store Name'}
                    </h2>
                    <span className="text-xs font-bold text-slate-400">
                        {storeProfile.industry || 'Industry Not Set'}
                    </span>
                </div>

                {/* Connection Lines Visual */}
                <div className="flex gap-1 py-2 relative z-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-blue-400/20 w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        </div>
                    ))}
                </div>

                {/* Stats / Parameters */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                            <UserCircleIcon className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase">Role</span>
                        </div>
                        <div className="text-xs font-bold text-slate-700 truncate">
                            Owner
                        </div>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                            <CrownIcon className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase">Plan</span>
                        </div>
                        <div className="text-xs font-bold text-slate-700 truncate">
                            {plan.plan === 'premium' ? 'Premium' : plan.plan}
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Widget */}
            <div className="flex-1 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-2">
                    <DatabaseIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context Data</span>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Description Block */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">店舗の特徴</h4>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-white/60">
                            {storeProfile.description || '特徴が設定されていません。プロファイル設定から入力してください。'}
                        </p>
                    </div>

                    {/* Target Block */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ターゲット層</h4>
                        <div className="flex flex-wrap gap-2">
                            {storeProfile.targetAudience ? (
                                <span className="text-xs font-bold text-slate-600 bg-white/80 px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                    {storeProfile.targetAudience}
                                </span>
                            ) : (
                                <span className="text-[10px] text-slate-400 italic">未設定</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Decorative */}
                <div className="mt-auto pt-6 border-t border-slate-200/50 flex justify-between items-center opacity-50">
                    <div className="flex items-center gap-1.5">
                        <ServerIcon className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-mono text-slate-400">v2.4.0-stable</span>
                    </div>
                    <ActivityIcon className="w-3 h-3 text-emerald-400" />
                </div>
            </div>
        </div>
    );
};
