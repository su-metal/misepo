import React from 'react';
import { BookmarkIcon, ChevronDownIcon, HistoryIcon } from '../../Icons';
import { Preset, StoreProfile } from '../../../types';
import { clampPresetName } from './utils';

interface GeneratorHeaderProps {
    onOpenGuide: () => void;
    onOpenPresets: () => void;
    onOpenSettings: () => void;
    onOpenHistory: () => void;
    onLogout: () => void;
    isLoggedIn: boolean;
    storeProfile: StoreProfile;
    presets: Preset[];
    onApplyPreset: (preset: Preset) => void;
    activePresetId: string | null;
}

export const GeneratorHeader: React.FC<GeneratorHeaderProps> = ({
    onOpenGuide,
    onOpenPresets,
    onOpenSettings,
    onOpenHistory,
    onLogout,
    isLoggedIn,
    storeProfile,
    presets,
    onApplyPreset,
    activePresetId
}) => {
    const quickPresets = presets.slice(0, 3);

    return (
        <header className="sticky top-4 z-[100] w-full">
            <div className="mx-auto bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-3 shadow-2xl flex items-center justify-between">

                {/* Brand Logo & Data Status */}
                <div className="flex items-center gap-6 px-3">
                    <div className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                            <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-900/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <span className="font-black text-xl italic tracking-tighter">M</span>
                            </div>
                        </div>
                        <div className="hidden xs:block">
                            <h1 className="text-sm font-black text-white tracking-[0.2em] uppercase leading-none mb-1">MisePo</h1>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">Studio 2026 Ready</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central Tool Stack */}
                <nav className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
                    <HeaderNavButton
                        onClick={onOpenHistory}
                        icon={<HistoryIcon className="w-4 h-4" />}
                        label="HISTORY"
                    />
                    <HeaderNavButton
                        onClick={onOpenGuide}
                        icon={<span className="text-xs">?</span>}
                        label="DOCS"
                    />
                    <button
                        onClick={onOpenPresets}
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white transition-all shadow-lg shadow-indigo-900/40 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <BookmarkIcon className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
                        <span className="text-[10px] font-black tracking-widest hidden sm:inline">LIBRARY</span>
                    </button>
                </nav>

                {/* User Module */}
                <div className="flex items-center gap-3 pr-2">
                    <button
                        onClick={onOpenSettings}
                        className="group flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all shrink-0"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            <span className="text-[10px] font-black text-slate-400">
                                {(storeProfile?.name?.[0] || 'S').toUpperCase()}
                            </span>
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Account</p>
                            <p className="text-[11px] font-black text-white truncate max-w-[80px]">
                                {storeProfile?.name || 'User'}
                            </p>
                        </div>
                        <ChevronDownIcon className="w-3 h-3 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
                    </button>

                    {isLoggedIn && (
                        <button
                            onClick={onLogout}
                            className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/10 transition-all shadow-sm group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-6 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

const HeaderNavButton: React.FC<{ onClick: () => void, icon: React.ReactNode, label: string }> = ({ onClick, icon, label }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all group shrink-0"
    >
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-black tracking-widest hidden lg:inline">{label}</span>
    </button>
);
