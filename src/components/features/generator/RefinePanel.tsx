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
        <div className="mt-4 p-4 glass-panel rounded-[24px] border border-white/60 animate-in zoom-in-95 duration-200 shadow-xl shadow-indigo-900/5">
            <label className="block text-[10px] font-black text-primary uppercase tracking-widest mb-2 px-1 opacity-60">
                AIへの修正指示（例：もう少し柔らかい表現に、ハッシュタグを増やして）
            </label>
            <div className="relative">
                <textarea
                    value={refineText}
                    onChange={(e) => onRefineTextChange(e.target.value)}
                    className="w-full bg-white/50 border border-slate-200 rounded-xl p-3 text-sm text-primary placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all min-h-[80px]"
                    placeholder="AIにお願いしたい修正内容を入力..."
                    autoFocus
                />
                <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-primary transition"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-black hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition shadow-lg disabled:opacity-50 disabled:shadow-none"
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
