import React from 'react';
import { Platform, GenerationConfig } from '../../../types';

export function CharCounter({ platform, text, config }: { platform: Platform, text: string, config: GenerationConfig }) {
    const count = text.length;
    const isX = platform === Platform.X;
    const limit = isX ? 140 : null;

    if (!limit) return <span className="text-slate-400">{count}文字</span>;

    const isOver = count > limit;

    return (
        <div className="flex items-center gap-1.5">
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isOver ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                {count} / {limit}
            </div>
            {isOver && (
                <span className="text-[10px] text-red-500 font-medium animate-pulse">
                    （超過）
                </span>
            )}
        </div>
    );
}
