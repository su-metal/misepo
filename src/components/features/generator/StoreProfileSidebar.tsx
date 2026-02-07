import React from 'react';
import { StoreProfile, UserPlan } from '../../../types';
import { UserCircleIcon, CrownIcon, ActivityIcon, ServerIcon, DatabaseIcon } from '../../Icons';

interface StoreProfileSidebarProps {
    storeProfile: StoreProfile;
    plan: UserPlan;
}

export const StoreProfileSidebar: React.FC<StoreProfileSidebarProps> = ({ storeProfile, plan }) => {
    const allTargetTags = storeProfile.targetAudience
        ? storeProfile.targetAudience.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];
    const MAX_VISIBLE_TARGET_TAGS = 6;
    const visibleTargetTags = allTargetTags.slice(0, MAX_VISIBLE_TARGET_TAGS);
    const remainingCount = allTargetTags.length - MAX_VISIBLE_TARGET_TAGS;
    const hasMoreTargetTags = allTargetTags.length > MAX_VISIBLE_TARGET_TAGS;

    return (
        <div className="w-[280px] h-full flex flex-col gap-6 animate-in slide-in-from-left duration-700">
            {/* AI Monitor Card */}
            <div className="bg-white border border-slate-100 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] to-white opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#80CAFF] via-[#C084FC] to-[#F87171] animate-pulse shadow-[0_0_8px_rgba(192,132,252,0.4)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2b2b2f]/60">AI Monitor</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-[#2b2b2f]/5 border border-[#2b2b2f]/10 text-[9px] font-bold text-[#2b2b2f] uppercase tracking-wide">
                        Online
                    </div>
                </div>

                {/* Store Identity */}
                <div className="flex flex-col gap-1 relative z-10">
                    <h2 className="text-xl font-black text-[#2b2b2f] tracking-tight leading-tight">
                        {storeProfile.name || 'Store Name'}
                    </h2>
                    <span className="text-xs font-bold text-[#b0b0b0]">
                        {storeProfile.industry || 'Industry Not Set'}
                    </span>
                </div>

                {/* Connection Lines Visual */}
                <div className="flex gap-1 py-2 relative z-10">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 flex-1 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-slate-300 w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                        </div>
                    ))}
                </div>

                {/* Plan & Usage Integrated Card */}
                <div className="flex flex-col gap-3 relative z-10">
                    <div className="p-5 bg-white border border-slate-100 text-[#2b2b2f] rounded-[28px] shadow-sm flex flex-col gap-4 relative overflow-hidden group/card text-left">
                        {/* Decorative Gradient Accent */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#80CAFF]/20 via-[#C084FC]/20 to-[#F87171]/20 rounded-full blur-[30px] pointer-events-none transition-colors duration-700" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 mb-1 text-[#2b2b2f]/40">
                                    <CrownIcon className="w-3 h-3" />
                                    <span className="text-[10px] font-black tracking-wider">現在のプラン</span>
                                </div>
                                <div className="text-sm font-black text-[#2b2b2f]">
                                    {plan.canUseApp === false ? (
                                        plan.plan === 'trial' ? 'お試し (期限切れ)' : '期限切れ'
                                    ) : (
                                        plan.plan === 'trial' ? 'お試し期間' :
                                            plan.plan === 'entry' ? 'Entry' :
                                                plan.plan === 'standard' ? 'Standard' :
                                                    plan.plan === 'professional' ? 'Professional' :
                                                        plan.plan === 'pro' || plan.plan === 'monthly' || plan.plan === 'yearly' ? 'Pro' :
                                                            plan.plan === 'premium' ? 'Premium' :
                                                                plan.plan ? (plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)) : 'Free'
                                    )}
                                </div>
                            </div>
                            {plan?.plan !== 'professional' && plan?.plan !== 'monthly' && plan?.plan !== 'yearly' && plan?.plan !== 'pro' && (
                                <a
                                    href="/upgrade"
                                    className={`px-3 py-1.5 rounded-xl text-white hover:opacity-90 transition-all text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 ${plan.canUseApp === false ? 'bg-[#E88BA3]' : 'bg-[#2b2b2f]'}`}
                                >
                                    プランを変更
                                </a>
                            )}
                        </div>

                        {/* Credits Gauge */}
                        {typeof plan.usage !== 'undefined' && typeof plan.limit !== 'undefined' && (
                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between items-end">
                                    <div className="flex items-center gap-1.5 text-[#2b2b2f]/40">
                                        <ActivityIcon className="w-3 h-3" />
                                        <span className="text-[10px] font-black tracking-widest">今月の残り</span>
                                    </div>
                                    <div className="text-xs font-black flex items-baseline gap-1 text-[#2b2b2f]">
                                        <span> {Math.max(0, plan.limit - plan.usage)}</span>
                                        <span className="text-[10px] text-[#2b2b2f]/40">/ {plan.limit}</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#80CAFF] via-[#C084FC] to-[#F87171] transition-all duration-1000"
                                        style={{ width: `${(Math.max(0, plan.limit - plan.usage) / plan.limit) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Context Widget */}
            <div className="flex-1 bg-white border border-slate-100 shadow-sm rounded-[32px] p-6 flex flex-col gap-4 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-2">
                    <DatabaseIcon className="w-4 h-4 text-[#2b2b2f]/40" />
                    <span className="text-[10px] font-black tracking-[0.1em] text-[#2b2b2f]/40">分析のベース情報</span>
                </div>

                <div className="space-y-4 relative z-10 flex-1 flex flex-col min-h-0">
                    {/* Description Block - Expanded to fill available space */}
                    <div className="space-y-2 flex-1 flex flex-col min-h-0">
                        <h4 className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-wider">店舗の特徴</h4>
                        <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 shadow-inner">
                            <p className="text-xs font-medium text-[#2b2b2f] leading-relaxed">
                                {storeProfile.description || '特徴が設定されていません。プロファイル設定から入力してください。'}
                            </p>
                        </div>
                    </div>

                    {/* Target Block - Pinned to bottom */}
                    <div className="space-y-2 mt-auto pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-bold text-[#b0b0b0] uppercase tracking-wider">ターゲット層</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 pr-1">
                            {visibleTargetTags.length > 0 ? (
                                <>
                                    {visibleTargetTags.map((tag, i) => (
                                        <span key={i} className="inline-flex items-center text-[10px] font-bold text-[#2b2b2f] bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm whitespace-nowrap">
                                            {tag}
                                        </span>
                                    ))}
                                    {hasMoreTargetTags && (
                                        <span className="inline-flex items-center text-[10px] font-bold text-[#7c5dcb] bg-[#f1f5ff] px-3 py-1 rounded-full border border-[#e0e7ff] shadow-sm whitespace-nowrap">
                                            +{remainingCount} etc...
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-[10px] text-[#2b2b2f]/40 italic">未設定</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Decorative */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center opacity-70">
                    <div className="flex items-center gap-1.5">
                        <ServerIcon className="w-3 h-3 text-[#2b2b2f]/30" />
                        <span className="text-[9px] font-mono text-[#2b2b2f]/50">v2.4.0-stable</span>
                    </div>
                    <ActivityIcon className="w-3 h-3 text-[#06C755]" />
                </div>
            </div>
        </div>
    );
};
