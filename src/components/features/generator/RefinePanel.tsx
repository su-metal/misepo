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
                <div className="mt-4 flex flex-wrap gap-2 mb-6">
                    {[
                        { label: '✨ 読みやすく整える', text: '文体や内容は一切変えずに、スマホ画面で読みやすくなるように適宜記号や「改行」や「空白行（1行あけ）」をバランスよく使って整形してください。' },
                        { label: '📝 スッキリ短く', text: '内容の質を落とさず、できるだけ簡潔に短くまとめてください。' },
                        { label: '📣 情熱を伝える', text: 'もっとお店の情熱が伝わるような、感情豊かな表現を増やしてください。' },
                        { label: '🤝 詳しく丁寧に', text: 'より詳細な情報を盛り込んで、丁寧で誠実なトーンに調整してください。' },
                    ].map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                onRefineTextChange(chip.text);
                                // Set timeout to allow state to settle before performing refine
                                setTimeout(() => onRefine(), 0);
                            }}
                            className="px-4 py-2 rounded-full text-[11px] font-black transition-all shadow-sm active:scale-95 border-2 bg-white border-black/10 text-black/60 hover:border-black hover:text-black"
                        >
                            {chip.label}
                        </button>
                    ))}
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold transition text-slate-500 hover:text-primary"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onRefine}
                        disabled={isRefining || !refineText.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:shadow-none bg-slate-900 text-white hover:bg-black"
                    >
                        {isRefining ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <MagicWandIcon className="w-3.5 h-3.5" />
                        )}
                        修正して再生成
                    </button>
                </div>
            </div>
        </div>
    );
};
