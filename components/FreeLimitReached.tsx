"use client";

import React from 'react';
import { SparklesIcon } from './Icons';

interface FreeLimitReachedProps {
  onUpgrade: () => void;
  nextRefillAt?: string | null;
  remaining?: number;
}

const formatRefillText = (nextRefillAt?: string | null) => {
  if (!nextRefillAt) {
    return '次の無料クレジットは週次で回復します。';
  }

  const parsed = new Date(nextRefillAt);
  if (Number.isNaN(parsed.getTime())) {
    return '次の無料クレジットは週次で回復します。';
  }
  return `次の無料クレジットは ${parsed.toLocaleDateString('ja-JP')} に回復します。`;
};

const FreeLimitReached: React.FC<FreeLimitReachedProps> = ({ onUpgrade, nextRefillAt, remaining }) => (
  <div className="w-full max-w-2xl mx-auto rounded-3xl border border-amber-200 bg-gradient-to-b from-white to-amber-50 p-8 text-center shadow-xl">
    <div className="flex items-center justify-center mx-auto mb-3 w-12 h-12 rounded-full bg-amber-100 text-amber-600">
      <SparklesIcon className="w-5 h-5" />
    </div>
    <h3 className="text-2xl font-black text-slate-800 mb-2">今週の無料クレジットを使い切りました</h3>
    <p className="text-sm text-slate-500 mb-6">
      {formatRefillText(nextRefillAt)}
    </p>
    {typeof remaining === 'number' && (
      <p className="text-xs text-slate-500 mb-4">残りクレジット: {remaining}回</p>
    )}
    <div className="space-y-3">
      <button
        onClick={onUpgrade}
        className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold shadow-lg hover:bg-indigo-600 transition-colors"
      >
        Proで無制限に使う
      </button>
      <button
        onClick={() => {}}
        className="w-full py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold hover:border-slate-300 transition-colors"
      >
        次の回復を待つ
      </button>
    </div>
    <p className="text-[11px] text-slate-500 mt-4">Proはいつでも解約できます。</p>
  </div>
);

export default FreeLimitReached;
