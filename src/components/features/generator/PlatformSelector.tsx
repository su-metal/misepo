import { Platform, Preset } from '../../../types';
import { getPlatformIcon, clampPresetName } from './utils';
import { SparklesIcon, BookmarkIcon, MoreHorizontalIcon } from '../../Icons';

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
    onOpenLibrary?: () => void;
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
    activePresetId,
    onOpenLibrary
}) => {
    const quickPresets = presets.slice(0, 3);

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-700">
            {/* Header: Platform Choice */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Target Engine</h3>
                    <p className="text-xs font-black text-stone-400">プラットフォーム選択</p>
                </div>
                <button
                    onClick={onToggleMultiGen}
                    className={`
                        group flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black tracking-widest transition-all
                        ${isMultiGen
                            ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/40'
                            : 'bg-stone-100 border-stone-200 text-stone-500 hover:border-stone-300 hover:text-stone-700'}
                    `}
                >
                    <SparklesIcon className={`w-3.5 h-3.5 ${isMultiGen ? "text-white" : "text-orange-500"}`} />
                    <span>BATCH MODE</span>
                    <div className={`
                        w-6 h-3.5 rounded-full relative transition-colors duration-300
                        ${isMultiGen ? 'bg-orange-400' : 'bg-stone-300'}
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
                                    ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-500/30 shadow-xl shadow-orange-100'
                                    : 'bg-stone-50/50 border-stone-100/50 hover:border-stone-200 hover:bg-white'}
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${isSelected ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30' : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-stone-600'}
                            `}>
                                {getPlatformIcon(p)}
                            </div>
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isSelected ? 'text-orange-600' : 'text-stone-500 group-hover:text-stone-700'}`}>
                                {p}
                            </span>

                            {isMultiGen && isSelected && (
                                <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                            )}
                            {isSelected && !isMultiGen && (
                                <div className="absolute -bottom-1 left-1/2 -transtone-x-1/2 w-4 h-1 bg-orange-500 rounded-full blur-[2px]"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Presets Module */}
            {quickPresets.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-0.5">Presets Library</span>
                            <span className="text-[10px] font-bold text-stone-300 uppercase">Quick Select</span>
                        </div>
                        <button
                            onClick={onOpenLibrary}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white transition-all shadow-sm shadow-orange-200/50 group"
                        >
                            <BookmarkIcon className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                            <span className="text-[9px] font-black tracking-[0.1em]">MANAGE</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {quickPresets.map((ps) => {
                            const isActive = activePresetId === ps.id;
                            return (
                                <button
                                    key={ps.id}
                                    onClick={() => onApplyPreset(ps)}
                                    className={`
                                        group relative overflow-hidden w-full px-2 py-3 rounded-xl text-xs font-black tracking-widest transition-all duration-300
                                        ${isActive
                                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                                            : 'bg-stone-50 text-stone-500 border border-stone-100 hover:border-stone-200 hover:text-stone-800'}
                                    `}
                                >
                                    <span className="relative z-10 block truncate w-full text-center">{ps.name.toUpperCase()}</span>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600"></div>
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
