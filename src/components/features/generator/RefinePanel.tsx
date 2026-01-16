import React from 'react';
import { MagicWandIcon, RotateCcwIcon } from '../../Icons';

interface RefinePanelProps {
    refineText: string;
    onRefineTextChange: (text: string) => void;
    onRefine: () => void;
    onCancel: () => void;
    isRefining: boolean;
}

export const RefinePanel: React.FC<RefinePanelProps> = ({
    refineText,
    onRefineTextChange,
    onRefine,
    onCancel,
    isRefining
}) => {
    return (
        <div className="mt-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 animate-in zoom-in-95 duration-200">
            <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 px-1">
                AIへの修正指示（例：もう少し柔らかい表現に、ハッシュタグを増やして）
            </label>
            <div className="relative">
                <textarea
                    value={refineText}
                    onChange={(e) => onRefineTextChange(e.target.value)}
                    className="w-full bg-white border border-orange-100 rounded-xl p-3 text-sm text-stone-800 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all min-h-[80px]"
                    placeholder="AIにお願いしたい修正内容を入力..."
                    autoFocus
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-stone-400 hover:text-stone-600 transition"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-2 px-6 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition shadow-md disabled:opacity-50"
                    >
                        {isRefining ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <RotateCcwIcon className="w-3.5 h-3.5" />
                        )}
                        修正して再生成
                    </button>
                </div>
            </div>
        </div>
    );
};
