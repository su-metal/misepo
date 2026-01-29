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
        <div className="w-full min-h-[300px] flex flex-col gap-5 font-sans relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
            {/* Date Header */}
            <div className="flex justify-center">
                <span className="bg-[#E5E5E5] text-[#666666] text-[10px] sm:text-[11px] font-bold px-3 py-0.5 rounded-full">
                    {now.getMonth() + 1}月{now.getDate()}日({['日', '月', '火', '水', '木', '金', '土'][now.getDay()]})
                </span>
            </div>

            <div className="flex items-start gap-2 sm:gap-3 text-left">
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shrink-0 shadow-sm overflow-hidden text-left">
                    <div className="w-full h-full bg-[#FAFAFA] flex items-center justify-center text-[#CCCCCC]">
                        <SparklesIcon className="w-5 h-5" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col gap-1 max-w-[85%] text-left">
                    <span className="text-[#666666] text-[10px] sm:text-[11px] font-black pl-1 drop-shadow-sm text-left">
                        {storeProfile.name || 'Store Name'}
                    </span>
                    <div className="flex items-end gap-1.5 text-left">
                        {/* Bubble */}
                        <div className="relative bg-[#111111] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-[18px] rounded-tl-none shadow-sm border border-[#111111] text-left">
                            {/* Triangle hook */}
                            <div className="absolute top-0 -left-[7px] w-0 h-0 border-t-[8px] border-t-[#111111] border-l-[8px] border-l-transparent text-left" />

                            <div className="text-[15px] leading-relaxed font-medium w-[15em] max-w-full text-left">
                                <AutoResizingTextarea
                                    value={text}
                                    onChange={(e) => onChange?.(e.target.value)}
                                    className="w-full bg-transparent focus:outline-none resize-none p-0 inline-block font-medium min-h-[1.5em] text-white break-all"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div className="flex flex-col text-[#999999] text-[9px] sm:text-[10px] font-bold leading-tight pb-0.5 text-left">
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

