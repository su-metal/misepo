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
        <div className="mt-4 p-8 bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 animate-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

            <label className="block text-[10px] font-black text-black uppercase tracking-[0.4em] mb-4 px-1 opacity-30 relative z-10">
                AI Instructions
            </label>

            <div className="relative z-10">
                <textarea
                    value={refineText}
                    onChange={(e) => onRefineTextChange(e.target.value)}
                    className="w-full bg-black/[0.03] border border-black/5 rounded-[24px] p-6 text-[15px] font-bold text-black placeholder:text-black/10 focus:bg-black/[0.05] outline-none transition-all min-h-[120px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                    placeholder="Tell AI what to fix..."
                    autoFocus
                />

                <div className="mt-6 flex flex-wrap gap-2.5 mb-8">
                    {[
                        { label: '✨ 整形', text: 'スマホで読みやすくなるように、適宜記号や改行、空行をバランスよく使って整形してください。文体や内容は変えないでください。' },
                        { label: '📝 短く', text: '内容の質を落とさず、できるだけ簡潔に短くまとめてください。' },
                        { label: '📣 情熱', text: 'もっとお店の情熱が伝わるような、感情豊かな表現を増やしてください。' },
                        { label: '🤝 丁寧', text: 'より詳細な情報を盛り込んで、丁寧で誠実なトーンに調整してください。' },
                    ].map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onRefineTextChange(chip.text);
                                setTimeout(() => onRefine(), 0);
                            }}
                            className="px-5 py-2.5 rounded-full text-[11px] font-black transition-all duration-300 active:scale-95 border border-black/5 bg-white/50 text-black/40 hover:bg-black hover:text-white hover:border-black shadow-sm"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition text-black/30 hover:text-black"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none bg-black text-white"
                    >
                        {isRefining ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MagicWandIcon className="w-4 h-4" />
                        )}
                        Refine
                    </button>
                </div>
            </div>
        </div>
    );
};
