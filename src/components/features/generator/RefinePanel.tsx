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
        <div className="w-full flex flex-col relative z-10 gap-2">
            <div className="flex-none px-1">
                <label className="block text-[10px] font-black text-[#111111] uppercase tracking-wider opacity-40">
                    AIへの指示
                </label>
            </div>

            <div className="w-full flex flex-col gap-3">
                <textarea
                    value={refineText}
                    onChange={(e) => onRefineTextChange(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.03] rounded-[20px] p-4 text-[15px] font-bold text-black placeholder:text-black/20 focus:bg-[#EDEDF0] outline-none transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] h-40"
                    placeholder="例：もっと親しみやすい口調にして、絵文字を少し増やして"
                    autoFocus
                />

                <div className="flex-none flex flex-wrap gap-1.5">
                    {[
                        { label: '✨ 整える', text: 'スマホで読みやすくなるように、適宜記号や改行、空行をバランスよく使って整形してください。文体や内容は変えないでください。' },
                        { label: '📝 短くする', text: '内容の質を落とさず、できるだけ簡潔に短くまとめてください。' },
                        { label: '📣 情熱的に', text: 'もっとお店の情熱が伝わるような、感情豊かな表現を増やしてください。' },
                        { label: '🤝 丁寧に', text: 'より詳細な情報を盛り込んで、丁寧で誠実なトーンに調整してください。' },
                    ].map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onRefineTextChange(chip.text);
                                setTimeout(() => onRefine(), 0);
                            }}
                            className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95 border border-black/[0.05] bg-white text-[#2b2b2f]/60 hover:bg-[#2b2b2f] hover:text-white hover:border-[#2b2b2f] shadow-sm"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <div className="flex-none flex items-center justify-end gap-3 pt-2 border-t border-black/[0.03]">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-xl text-[12px] font-bold transition text-[#2b2b2f]/40 hover:text-[#2b2b2f]"
                    >
                        戻る
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-2 px-6 py-2 rounded-full text-[13px] font-black shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none bg-[#2b2b2f] text-white"
                    >
                        {isRefining ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MagicWandIcon className="w-3.5 h-3.5" />
                        )}
                        調整する (1回分)
                    </button>
                </div>
            </div>
        </div>
    );
};
