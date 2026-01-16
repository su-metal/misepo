import { Platform, Preset } from '../../../types';
import { getPlatformIcon, clampPresetName } from './utils';
import { SparklesIcon, BookmarkIcon } from '../../Icons';

interface PlatformSelectorProps {
    platforms: Platform[];
    activePlatform: Platform;
    isMultiGen: boolean;
    onPlatformToggle: (platform: Platform) => void;
    onToggleMultiGen: () => void;
    onSetActivePlatform: (platform: Platform) => void;
    presets: Preset[];
    onApplyPreset: (preset: Preset) => void;
    activePresetId: string | null;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    platforms,
    activePlatform,
    isMultiGen,
    onPlatformToggle,
    onToggleMultiGen,
    onSetActivePlatform,
    presets,
    onApplyPreset,
    activePresetId
}) => {
    const quickPresets = presets.slice(0, 3);

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header: Platform Choice */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Target Engine</h3>
                    <p className="text-xs font-black text-white/50">プラットフォーム選択</p>
                </div>
                <button
                    onClick={onToggleMultiGen}
                    className={`
                        group flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black tracking-widest transition-all
                        ${isMultiGen
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40'
                            : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'}
                    `}
                >
                    <SparklesIcon className={`w-3.5 h-3.5 ${isMultiGen ? "text-white" : "text-indigo-500"}`} />
                    <span>BATCH MODE</span>
                    <div className={`
                        w-6 h-3.5 rounded-full relative transition-colors duration-300
                        ${isMultiGen ? 'bg-indigo-400' : 'bg-slate-700'}
                    `}>
                        <div className={`
                            absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-all duration-300
                            ${isMultiGen ? 'left-3' : 'left-0.5'}
                        `}></div>
                    </div>
                </button>
            </div>

            {/* Platform Grid */}
            <div className="grid grid-cols-2 gap-3">
                {Object.values(Platform).map((p) => {
                    const isSelected = isMultiGen ? platforms.includes(p) : activePlatform === p;
                    return (
                        <button
                            key={p}
                            onClick={() => isMultiGen ? onPlatformToggle(p) : onSetActivePlatform(p)}
                            className={`
                                relative flex flex-col items-center justify-center gap-3 p-5 rounded-[2rem] border transition-all duration-500 group
                                ${isSelected
                                    ? 'bg-gradient-to-br from-indigo-600/20 to-indigo-900/20 border-indigo-500/50 shadow-2xl shadow-indigo-900/20'
                                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'}
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${isSelected ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}
                            `}>
                                {getPlatformIcon(p)}
                            </div>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                {p}
                            </span>

                            {isMultiGen && isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                            )}
                            {isSelected && !isMultiGen && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-indigo-500 rounded-full blur-[2px]"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Presets Module */}
            {quickPresets.length > 0 && (
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Presets Library</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                            <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quickPresets.map((ps) => {
                            const isActive = activePresetId === ps.id;
                            return (
                                <button
                                    key={ps.id}
                                    onClick={() => onApplyPreset(ps)}
                                    className={`
                                        group relative overflow-hidden px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300
                                        ${isActive
                                            ? 'bg-white text-slate-900 shadow-xl'
                                            : 'bg-white/5 text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300'}
                                    `}
                                >
                                    <span className="relative z-10">{clampPresetName(ps.name, 20).toUpperCase()}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
