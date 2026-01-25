import React from 'react';
import { StoreProfile } from '../../../types';
import { SparklesIcon } from '../../Icons';
import { AutoResizingTextarea } from './AutoResizingTextarea';

interface LinePreviewProps {
    text: string;
    storeProfile: StoreProfile;
    onChange?: (text: string) => void;
}

export const LinePreview: React.FC<LinePreviewProps> = ({ text, storeProfile, onChange }) => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    return (
        <div className="bg-[#7494C0] rounded-2xl p-4 sm:p-6 min-h-[300px] flex flex-col gap-4 font-sans border-2 border-black/10 shadow-inner overflow-hidden">
            {/* Date Header */}
            <div className="flex justify-center">
                <span className="bg-black/15 text-white text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full">
                    {now.getMonth() + 1}月{now.getDate()}日({['日', '月', '火', '水', '木', '金', '土'][now.getDay()]})
                </span>
            </div>

            <div className="flex items-start gap-2 sm:gap-3 text-left">
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-left">
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-1 max-w-[85%] text-left">
                    <span className="text-white text-[10px] sm:text-[11px] font-black pl-1 drop-shadow-sm text-left">
                        {storeProfile.name || 'Store Name'}
                    </span>
                    <div className="flex items-end gap-1.5 text-left">
                        {/* Bubble */}
                        <div className="relative bg-[#8EE071] text-black px-3 sm:px-4 py-2 sm:py-2.5 rounded-[18px] rounded-tl-none shadow-sm border border-[#7BC560]/40 text-left">
                            {/* Triangle hook */}
                            <div className="absolute top-0 -left-[7px] w-0 h-0 border-t-[8px] border-t-[#8EE071] border-l-[8px] border-l-transparent text-left" />

                            <div className="text-[15px] leading-relaxed font-medium w-[15.5em] max-w-full text-left">
                                <AutoResizingTextarea
                                    value={text}
                                    onChange={(e) => onChange?.(e.target.value)}
                                    className="w-full bg-transparent focus:outline-none resize-none p-0 inline-block font-medium min-h-[1.5em] text-black"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex flex-col text-[#f8f8f8] text-[9px] sm:text-[10px] font-bold leading-tight pb-0.5 text-left">
                            <span>{timeStr}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 flex justify-center opacity-40 pointer-events-none">
                <div className="w-20 h-1 bg-white/20 rounded-full" />
            </div>
        </div>
    );
};

