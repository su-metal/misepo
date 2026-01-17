import { Platform } from '../../../types';
import { getPlatformIcon } from './utils';

interface CompactPlatformSelectorProps {
    platforms: Platform[];
    activePlatform: Platform;
    isMultiGen: boolean;
    onPlatformToggle: (platform: Platform) => void;
    onToggleMultiGen: () => void;
    onSetActivePlatform: (platform: Platform) => void;
}

export const CompactPlatformSelector: React.FC<CompactPlatformSelectorProps> = ({
    platforms,
    activePlatform,
    isMultiGen,
    onPlatformToggle,
    onToggleMultiGen,
    onSetActivePlatform,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-stone-100">
            {/* Platform Buttons */}
            <div className="flex items-center gap-2">
                {Object.values(Platform).map((p) => {
                    const isSelected = isMultiGen ? platforms.includes(p) : activePlatform === p;
                    return (
                        <button
                            key={p}
                            onClick={() => isMultiGen ? onPlatformToggle(p) : onSetActivePlatform(p)}
                            className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300
                                ${isSelected
                                    ? 'bg-white border-stone-300 shadow-sm'
                                    : 'bg-stone-50 border-stone-200 hover:bg-white hover:border-stone-300'}
                            `}
                        >
                            <div className={`text-lg ${isSelected ? 'text-black' : 'text-stone-400'}`}>
                                {getPlatformIcon(p)}
                            </div>
                            <span className={`text-xs font-bold ${isSelected ? 'text-black' : 'text-stone-500'}`}>
                                {p === Platform.X ? 'X (Twitter)' : p === Platform.Instagram ? 'Instagram' : 'Google Maps'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Multi-Gen Toggle */}
            <button
                onClick={onToggleMultiGen}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all
                    ${isMultiGen
                        ? 'bg-stone-800 border-stone-800 text-white'
                        : 'bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200'}
                `}
            >
                <span>同時生成</span>
                <div className={`
                    w-8 h-4 rounded-full relative transition-colors
                    ${isMultiGen ? 'bg-lime' : 'bg-stone-300'}
                `}>
                    <div className={`
                        absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all
                        ${isMultiGen ? 'left-4' : 'left-0.5'}
                    `}></div>
                </div>
                <span className="uppercase text-[10px] font-black tracking-wider">
                    {isMultiGen ? 'ON' : 'OFF'}
                </span>
            </button>
        </div>
    );
};
