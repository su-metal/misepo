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
                    <h3 className="text-[10px] font-black text-[#4DB39A] uppercase tracking-[0.3em] mb-1">Target Engine</h3>
                    <p className="text-xs font-black text-stone-400">プラットフォーム選択</p>
                </div>
                <button
                    onClick={onToggleMultiGen}
                    className={`
                        group flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all
                        ${isMultiGen
                            ? 'bg-[#4DB39A] text-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white border-[3px] border-black/20 text-gray-500 hover:border-black/40 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'
                        }
`}
                >
                    <SparklesIcon className={`w-3.5 h-3.5 ${isMultiGen ? "text-black" : "text-[#4DB39A]"} `} />
                    <span>BATCH MODE</span>
                    <div className={`
w-6 h-3.5 rounded-full relative transition-colors duration-300
                        ${isMultiGen ? 'bg-black/20' : 'bg-black/10'}
`}>
                        <div className={`
                            absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all duration-300
                            ${isMultiGen ? 'bg-black left-3' : 'bg-white left-0.5'}
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
                                relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl transition-all duration-300 group
                                ${isSelected
                                    ? `border-[3px] border-[#6366F1] bg-gradient-to-br from-[#6366F1]/5 to-[#A855F7]/5 shadow-[0_8px_25px_rgba(99,102,241,0.12)]`
                                    : 'bg-white border-[3px] border-gray-200 hover:border-gray-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black/40'
                                }
`}
                        >
                            <div className={`
w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center
                                ${isSelected
                                    ? 'bg-transparent'
                                    : 'bg-gray-50 border-black/10 text-gray-400 group-hover:bg-white group-hover:text-black group-hover:border-black/30 grayscale'
                                }
`}>
                                {getPlatformIcon(p, {
                                    className: "w-6 h-6",
                                    textFill: p === Platform.Line && isSelected ? "#EFF0FE" : (isSelected ? "#6366F1" : "currentColor")
                                })}
                            </div>
                            <span className={`
                                text-[13px] font-black uppercase tracking-widest transition-colors
                                ${isSelected ? 'bg-gradient-to-r from-[#6366F1] to-[#A855F7] bg-clip-text text-transparent' : 'text-black/40'}
                            `}>
                                {p === Platform.X ? 'X' : p === Platform.Instagram ? 'Instagram' : p === Platform.Line ? 'LINE' : 'Google Maps'}
                            </span>

                            {isMultiGen && isSelected && (
                                <div className={`absolute top-3 right-3 w-5 h-5 bg-black border-[2px] border-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in duration-300`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-[#4DB39A]"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
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
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-0.5">プリセットライブラリ</span>
                            <span className="text-[10px] font-bold text-stone-300 uppercase">クイック選択</span>
                        </div>
                        <button
                            onClick={onOpenLibrary}
                            className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-black transition-all shadow-sm group"
                            style={{ backgroundColor: 'rgba(239,255,0,0.1)' }}
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
                                                group relative overflow-hidden w-full px-2 py-3 rounded-xl transition-all duration-300 text-xs font-black tracking-widest
                                                ${isActive
                                            ? 'bg-[#4DB39A] text-black border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                            : 'bg-white text-black/40 border-[2px] border-black/10 hover:border-black/30 hover:text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]'
                                        }
`}
                                >
                                    <span className="relative z-10 block truncate w-full text-center">{ps.name.toUpperCase()}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
