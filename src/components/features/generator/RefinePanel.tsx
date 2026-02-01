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
        <div className="w-full relative z-10 space-y-5">
            <div className="space-y-1.5 px-1">
                <label className="block text-[11px] font-black text-[#111111] uppercase tracking-wider opacity-40">
                    AIへの指示
                </label>
                <p className="text-[12px] font-medium text-[#666666]">
                    どのような点を修正したいか具体的に入力してください。
                </p>
            </div>

            <div className="space-y-6">
                <textarea
                    value={refineText}
                    onChange={(e) => onRefineTextChange(e.target.value)}
                    className="w-full bg-[#F5F5F7] border border-black/[0.03] rounded-[24px] p-6 text-[15px] font-bold text-black placeholder:text-black/20 focus:bg-[#EDEDF0] outline-none transition-all min-h-[160px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]"
                    placeholder="例：もっと親しみやすい口調にして、絵文字を少し増やして"
                    autoFocus
                />

                <div className="flex flex-wrap gap-2">
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
                            className="px-5 py-2.5 rounded-full text-[12px] font-bold transition-all duration-300 active:scale-95 border border-black/[0.05] bg-white text-black/60 hover:bg-[#0071b9] hover:text-white hover:border-[#0071b9] shadow-sm"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-black/[0.03]">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 rounded-xl text-[12px] font-bold transition text-black/40 hover:text-black"
                    >
                        戻る
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-2.5 px-10 py-4 rounded-full text-[13px] font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:shadow-none bg-[#0071b9] text-white"
                    >
                        {isRefining ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MagicWandIcon className="w-5 h-5 ml-0.5" />
                        )}
                        調整する
                    </button>
                </div>
            </div>
        </div>
    );
};
