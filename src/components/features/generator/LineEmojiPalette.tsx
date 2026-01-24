import React from 'react';
import { CopyIcon } from '../../Icons';

interface LineEmojiPaletteProps {
    onSelect: (emoji: string) => void;
}

export const LineEmojiPalette: React.FC<LineEmojiPaletteProps> = ({ onSelect }) => {
    const categories = [
        {
            label: '数値 (デコ文字変換用)',
            items: ['(0)', '(1)', '(2)', '(3)', '(4)', '(5)', '(6)', '(7)', '(8)', '(9)', '(10)']
        },
        {
            label: '記号・強調',
            items: ['(!!)', '(?)', '(祝)', '(新)', '(割)', '❶', '❷', '❸', '❹', '❺', '❻', '❼', '❽', '❾', '❿']
        },
        {
            label: '装飾レイアウト',
            items: ['＼＼  ／／', '𓊆  𓊇', '〖  〗', '━━━━━━━━', '↓↓↓↓↓', '⇣⇣⇣']
        }
    ];

    const [copiedIdx, setCopiedIdx] = React.useState<string | null>(null);

    const handleCopy = (val: string, id: string) => {
        navigator.clipboard.writeText(val);
        setCopiedIdx(id);
        setTimeout(() => setCopiedIdx(null), 1000);
        onSelect(val);
    };

    return (
        <div className="bg-white border-2 border-black rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#06C755] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border border-black">
                    <span className="text-[10px] font-black">L</span>
                </div>
                <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em]">LINEデコ文字＆装飾パレット</h4>
            </div>

            <div className="space-y-6">
                {categories.map((cat, catIdx) => (
                    <div key={catIdx}>
                        <p className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-3 ml-1">{cat.label}</p>
                        <div className="flex flex-wrap gap-2">
                            {cat.items.map((item, itemIdx) => {
                                const id = `${catIdx}-${itemIdx}`;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => handleCopy(item, id)}
                                        className={`
                                            group relative px-3 py-2 rounded-xl border-2 font-bold text-sm transition-all active:scale-95
                                            ${copiedIdx === id
                                                ? 'bg-[#06C755] text-white border-black scale-105 z-10'
                                                : 'bg-black/[0.02] border-black/5 text-black/60 hover:bg-white hover:border-black hover:text-black hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10">{item}</span>
                                        {copiedIdx === id && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-2 py-1 rounded-md animate-in fade-in slide-in-from-bottom-1">
                                                COPIED!
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-6 text-[10px] font-bold text-black/40 leading-relaxed border-t border-black/5 pt-4">
                <span className="text-black">※Tips:</span> <span className="text-[#06C755] font-black">(1)</span> などをLINEに貼り付けると、アプリが自動でピンクのデコ文字を候補に表示してくれます。
            </p>
        </div>
    );
};
