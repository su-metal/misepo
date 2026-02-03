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
            <div className="bg-[#fffbf9]/80 backdrop-blur-xl border border-[#122646]/10 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#d8e9f4]/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1f29fc] animate-pulse shadow-[0_0_8px_rgba(31,41,252,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122646]/60">AI Monitor</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-[#122646]/5 border border-[#122646]/10 text-[9px] font-bold text-[#122646] uppercase tracking-wide">
                        Online
                    </div>
                </div>

                {/* Store Identity */}
                <div className="flex flex-col gap-1 relative z-10">
                    <h2 className="text-xl font-black text-[#122646] tracking-tight leading-tight">
                        {storeProfile.name || 'Store Name'}
                    </h2>
                    <span className="text-xs font-bold text-[#122646]/60">
                        {storeProfile.industry || 'Industry Not Set'}
                    </span>
                </div>

                {/* Connection Lines Visual */}
                <div className="flex gap-1 py-2 relative z-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 flex-1 rounded-full bg-[#122646]/5 overflow-hidden">
                            <div className="h-full bg-[#f2e018]/60 w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        </div>
                    ))}
                </div>

                {/* Plan & Usage Integrated Card */}
                <div className="flex flex-col gap-3 relative z-10">
                    <div className="p-5 bg-[#122646] text-white rounded-[28px] shadow-lg flex flex-col gap-4 border border-white/5 relative overflow-hidden group/card text-left">
                        {/* Decorative Background Glows */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[30px] pointer-events-none group-hover/card:bg-indigo-500/30 transition-colors duration-700" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 mb-1 text-white/40">
                                    <CrownIcon className="w-3 h-3" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Current Plan</span>
                                </div>
                                <div className="text-sm font-black text-white">
                                    {plan.plan === 'entry' ? 'Entry' :
                                        plan.plan === 'standard' ? 'Standard' :
                                            plan.plan === 'professional' ? 'Professional' :
                                                plan.plan === 'pro' || plan.plan === 'monthly' || plan.plan === 'yearly' ? 'Pro' :
                                                    plan.plan === 'premium' ? 'Premium' :
                                                        plan.plan || 'Free'}
                                </div>
                            </div>
                            {plan?.plan !== 'professional' && (
                                <a
                                    href="/start?upgrade=true"
                                    className="px-3 py-1.5 rounded-xl bg-white text-[#122646] hover:bg-[#f2e018] transition-all text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                                >
                                    Upgrade
                                </a>
                            )}
                        </div>

                        {/* Credits Gauge */}
                        {typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-1.5 text-white/40">
                                        <ActivityIcon className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Usage</span>
                                    </div>
                                    <div className="text-xs font-black flex items-baseline gap-1">
                                        <span className="text-[#f2e018]"> {Math.max(0, plan.limit - plan.usage)}</span>
                                        <span className="text-[10px] text-white/40">/ {plan.limit}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#f2e018] to-yellow-300 shadow-[0_0_10px_rgba(242,224,24,0.3)] transition-all duration-1000"
                                        style={{ width: `${(Math.max(0, plan.limit - plan.usage) / plan.limit) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Context Widget */}
            <div className="flex-1 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-2">
                    <DatabaseIcon className="w-4 h-4 text-[#122646]/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#122646]/40">Context Data</span>
                </div>

                <div className="space-y-4 relative z-10">
                    {/* Description Block */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-[#122646]/60 uppercase tracking-wider">店舗の特徴</h4>
                        <p className="text-xs font-medium text-[#122646]/80 leading-relaxed bg-[#fffbf9] p-3 rounded-xl border border-[#122646]/10">
                            {storeProfile.description || '特徴が設定されていません。プロファイル設定から入力してください。'}
                        </p>
                    </div>

                    {/* Target Block */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-[#122646]/60 uppercase tracking-wider">ターゲット層</h4>
                        <div className="flex flex-wrap gap-2">
                            {storeProfile.targetAudience ? (
                                storeProfile.targetAudience.split(',').map((tag, i) => (
                                    <span key={i} className="text-xs font-bold text-[#122646] bg-white px-3 py-1.5 rounded-lg border border-[#122646]/10 shadow-sm">
                                        {tag.trim()}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-[#122646]/40 italic">未設定</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Decorative */}
                <div className="mt-auto pt-6 border-t border-[#122646]/10 flex justify-between items-center opacity-70">
                    <div className="flex items-center gap-1.5">
                        <ServerIcon className="w-3 h-3 text-[#122646]/30" />
                        <span className="text-[9px] font-mono text-[#122646]/50">v2.4.0-stable</span>
                    </div>
                    <ActivityIcon className="w-3 h-3 text-[#00b900]" />
                </div>
            </div>
        </div>
    );
};
