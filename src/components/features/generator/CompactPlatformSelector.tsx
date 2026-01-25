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
        <div className="flex flex-col gap-4 p-4 bg-stone-50 border-b border-stone-100">
            {/* Platform Selection Row */}
            <div className="flex items-center justify-between gap-2 p-1 bg-stone-100/50 rounded-2xl">
                {Object.values(Platform).map((p) => {
                    const isSelected = isMultiGen ? platforms.includes(p) : activePlatform === p;
                    return (
                        <button
                            key={p}
                            onClick={() => isMultiGen ? onPlatformToggle(p) : onSetActivePlatform(p)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl transition-all duration-300
                                ${isSelected
                                    ? 'bg-black text-white shadow-lg'
                                    : 'text-stone-400 hover:text-stone-600'}
                            `}
                        >
                            <div className={`text-lg transition-all duration-300 ${isSelected ? 'text-white' : 'text-stone-400 grayscale opacity-60'}`}>
                                {getPlatformIcon(p)}
                            </div>
                            <span className={`text-[11px] font-bold md:inline ${isSelected ? 'text-white' : 'text-stone-500'} ${p === Platform.GoogleMaps ? 'hidden sm:inline' : ''}`}>
                                {p === Platform.X ? 'X' : p === Platform.Instagram ? 'Instagram' : p === Platform.Line ? 'LINE' : 'Google Maps'}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Multi-Gen Toggle Row - Always visible, repositioned for mobile */}
            <div className="flex justify-center">
                <button
                    onClick={onToggleMultiGen}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-stone-100 rounded-full transition-all group"
                >
                    <div className={`
                        w-9 h-5 rounded-full relative transition-colors duration-300
                        ${isMultiGen ? 'bg-indigo-600' : 'bg-stone-300'}
                    `}>
                        <div className={`
                            absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300
                            ${isMultiGen ? 'left-5' : 'left-1'}
                        `}></div>
                    </div>
                    <span className="text-[11px] font-black text-stone-500 tracking-wider">
                        同時生成 {isMultiGen ? 'ON' : 'OFF'}
                    </span>
                </button>
            </div>
        </div>
    );
};
