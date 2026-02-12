import React from 'react';
import { GeneratedPost, Platform, Preset } from '../types';
import {
  CloseIcon,
  XIcon,
  InstagramIcon,
  GoogleMapsIcon,
  LineIcon,
  LockIcon,
  TrashIcon,
  HistoryIcon,
  PinIcon,
  UserCircleIcon,
  MessageSquareIcon,
  SparklesIcon
} from './Icons';
import { cleanUserInstruction, hasActualUserInstruction } from '../lib/historyUtils';
import { UI } from '../constants';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onDelete: (id: string) => void;
  presets?: Preset[];
  onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
  onSelectPlatform?: (post: GeneratedPost, platform: Platform) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isLoggedIn,
  onSelect,
  isOpen,
  toggleOpen,
  onOpenLogin,
  onDelete,
  onTogglePin,
  onSelectPlatform,
  presets
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const pickFirstText = (item: GeneratedPost): string => {
    if (Array.isArray(item.results) && item.results.length > 0) {
      const group = item.results.find(
        (group) => group && Array.isArray(group.data) && group.data.length > 0
      );
      if (group) {
        const validEntry = group.data.find(
          (entry) => typeof entry === "string" && entry.trim()
        );
        if (typeof validEntry === "string") return validEntry;
      }
    }
    return "";
  };

  const displayHistory = React.useMemo(() => {
    return [...history].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [history]);

  const getPlatformIcon = (p: Platform, className?: string, isColored?: boolean) => {
    let iconClass = className || "w-3 h-3 text-slate-400";

    if (isColored) {
      const base = className || "w-3 h-3";
      switch (p) {
        case Platform.X: iconClass = `${base} text-black`; break;
        case Platform.Instagram: iconClass = `${base} text-[#E4405F]`; break;
        case Platform.GoogleMaps: iconClass = `${base} text-[#4285F4]`; break;
        case Platform.Line: iconClass = `${base} text-[#06C755]`; break;
      }
    }

    switch (p) {
      case Platform.X: return <XIcon className={iconClass} />;
      case Platform.Instagram: return <InstagramIcon className={iconClass} />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className={iconClass} />;
      case Platform.Line: return <LineIcon className={iconClass} color={isColored ? "#06C755" : "currentColor"} textFill="white" />;
      default: return null;
    }
  };

  const toneLabels: Record<string, string> = {
    formal: 'きっちり',
    standard: '標準',
    friendly: '親しみ',
    casual: 'もっと親しみ'
  };

  const lengthLabels: Record<string, string> = {
    short: '短め',
    medium: '普通',
    long: '長め'
  };

  const replyDepthLabels: Record<string, string> = {
    light: 'あっさり',
    standard: 'バランス',
    deep: '丁寧'
  };

  // Define supported platforms for regeneration suggestions
  const supportedPlatforms = [Platform.Instagram, Platform.X, Platform.Line];

  const renderHistoryItem = (item: GeneratedPost, idx: number) => {
    const firstResult = pickFirstText(item);
    const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";
    const dateLabel = new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    // Identify which platforms were used for this generation
    const usedPlatforms = new Set(item.config.platforms);

    // Identify which platforms are available for "Create for other SNS"
    const unusedPlatforms = supportedPlatforms.filter(p => !usedPlatforms.has(p));

    return (
      <div
        key={item.id}
        className="group relative animate-in fade-in slide-in-from-right-8 duration-500"
        style={{ animationDelay: `${idx * 40}ms` }}
      >
        <div
          className={`w-full text-left rounded-[28px] transition-all duration-500 relative overflow-hidden flex flex-col gap-3 ${item.isPinned
            ? 'bg-white p-[1.5px] shadow-[0_15px_40px_rgba(128,202,255,0.12)] ring-1 ring-[#80CAFF]/80'
            : 'bg-white border-2 border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
            }`}
        >
          {/* Subtle Inner Glow for Pinned */}
          {item.isPinned && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#80CAFF]/5 via-[#C084FC]/5 to-[#F87171]/5 pointer-events-none" />
          )}

          <div
            className={`relative w-full h-full flex flex-col gap-4 ${item.isPinned ? 'bg-white rounded-[27px] p-6' : 'p-6 pb-5'}`}
            onClick={() => {
              onSelect(item);
              toggleOpen();
            }}
            style={{ cursor: 'pointer' }}
          >
            <div className="flex items-center justify-between pointer-events-none pr-10">
              <div className="flex -space-x-2">
                {item.config.platforms.map((p, pIdx) => (
                  <div key={`${p}-${pIdx}`} className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-100 shadow-sm transition-colors">
                    {getPlatformIcon(p, "w-4 h-4", true)}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {hasActualUserInstruction(item.config.customPrompt) && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100/50" title="追加指示あり">
                    <SparklesIcon className="w-2.5 h-2.5 text-amber-500" />
                  </div>
                )}
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {dateLabel}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pointer-events-none">
              <p className="text-sm text-black font-bold tracking-tight line-clamp-2 leading-relaxed transition-colors md:text-[#2b2b2f] md:group-hover:text-black pr-12">
                {previewText}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-1">
                {item.profile?.name && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                    <UserCircleIcon className="w-2.5 h-2.5" />
                    <span className="truncate max-w-[80px]">{item.profile.name}</span>
                  </div>
                )}
                {item.config.platforms.includes(Platform.GoogleMaps) ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                    <span className="opacity-50">丁寧さ:</span>
                    <span>{replyDepthLabels[item.config.replyDepth as string] || 'バランス'}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                      <span className="opacity-50">口調:</span>
                      <span>{(() => {
                        if (item.config.presetId && item.config.presetId !== 'plain-ai') {
                          const preset = presets?.find(p => p.id === item.config.presetId);
                          if (preset) return preset.name;
                        }
                        return toneLabels[item.config.tone] || item.config.tone;
                      })()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100/50">
                      <span className="opacity-50">長さ:</span>
                      <span>{lengthLabels[item.config.length] || item.config.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Create for other SNS Section */}
            {unusedPlatforms.length > 0 && !usedPlatforms.has(Platform.GoogleMaps) && (
              <div
                className="mt-2 pt-3 border-t border-slate-100 flex items-center gap-3"
                onClick={(e) => e.stopPropagation()} // Prevent card click
              >
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">他のSNSで作成:</span>
                <div className="flex gap-2">
                  {unusedPlatforms.map(p => (
                    <button
                      key={p}
                      onClick={() => onSelectPlatform && onSelectPlatform(item, p)}
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:scale-105 active:scale-95 transition-all"
                      title={`${p}で作成`}
                    >
                      {getPlatformIcon(p, "w-3 h-3 text-slate-400")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Actions */}
        <div className={`absolute top-6 right-6 flex flex-row md:flex-col gap-0.5 transition-all duration-500 z-30 ${item.isPinned ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onTogglePin(item.id, !item.isPinned); }}
            className={`w-8 h-8 flex items-center justify-center transition-all ${item.isPinned
              ? 'text-[#C084FC]'
              : 'text-slate-300 hover:text-[#2b2b2f] hover:scale-110'
              }`}
            title={item.isPinned ? "ピン留めを解除" : "ピン留めして保護"}
          >
            <PinIcon className="w-4 h-4" fill={item.isPinned ? "currentColor" : "none"} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:scale-110 transition-all font-black"
            title="履歴を削除"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Pinned Accent Bar */}
        {item.isPinned && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#80CAFF] via-[#C084FC] to-[#F87171] rounded-r-full shadow-[2px_0_10px_rgba(192,132,252,0.3)] z-20" />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9990] animate-in fade-in duration-300"
          onClick={toggleOpen}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[400px] md:w-[440px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-8 py-6 md:py-8 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="font-black text-[#2b2b2f] text-xl md:text-2xl tracking-tight uppercase leading-none">生成履歴</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 opacity-60">過去に作成した全ての投稿案</p>
          </div>
          <button
            onClick={toggleOpen}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
            aria-label="Close menu"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 space-y-8 no-scrollbar bg-slate-50">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#2b2b2f] shadow-sm">
                <HistoryIcon className="w-6 h-6 opacity-80" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Saved Results</span>
                {isLoggedIn && (
                  <span className="text-sm font-black text-[#2b2b2f] tracking-tighter">
                    {history.length} <span className="text-[10px] opacity-40 ml-1">件の履歴</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-10 pb-10">
            {isLoggedIn ? (
              history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                  <div className="w-24 h-24 mb-6 bg-white rounded-[32px] flex items-center justify-center text-slate-100 shadow-sm ring-1 ring-slate-100/50">
                    <HistoryIcon className="w-10 h-10" />
                  </div>
                  <h5 className="text-sm font-black text-[#2b2b2f] mb-2">まだ履歴がありません</h5>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    作成した投稿案は、ここに自動で保存されます。<br />
                    いつでも見返したり、再編集したりできますよ。
                  </p>
                </div>
              ) : (
                <>
                  {/* Pinned Section */}
                  {displayHistory.some(i => i.isPinned) && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#80CAFF] to-[#C084FC]"></div>
                        <span className="text-[11px] font-black bg-gradient-to-r from-[#80CAFF] via-[#C084FC] to-[#F87171] bg-clip-text text-transparent uppercase tracking-[0.25em]">お気に入り</span>
                      </div>
                      <div className="space-y-4">
                        {displayHistory.filter(i => i.isPinned).map((item, idx) => renderHistoryItem(item, idx))}
                      </div>
                    </div>
                  )}

                  {/* Recent Section */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">最近の履歴</span>
                    </div>
                    <div className="space-y-4">
                      {displayHistory.filter(i => !i.isPinned).map((item, idx) => renderHistoryItem(item, idx))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-24 h-24 bg-white rounded-[40px] shadow-sm flex items-center justify-center mb-10 ring-1 ring-slate-100">
                  <LockIcon className="w-10 h-10 text-slate-100" />
                </div>
                <h3 className="font-black text-[#2b2b2f] text-xl md:text-2xl mb-3 tracking-tight">ログインが必要です</h3>
                <p className="text-sm font-bold text-slate-400 mb-10 max-w-[240px] leading-relaxed">
                  履歴を安全に保存・同期するには、アカウントへのログインが必要です。
                </p>
                <button
                  onClick={() => { onOpenLogin(); toggleOpen(); }}
                  className="w-full py-5 bg-[#2b2b2f] text-white rounded-[20px] shadow-xl shadow-black/5 font-black text-xs uppercase tracking-[0.2em] hover:bg-black active:scale-95 transition-all"
                >
                  ログイン / 新規登録
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 bg-white">
          <p className="text-[9px] font-black text-[#2b2b2f]/30 text-center uppercase tracking-[0.4em]">© 2026 {UI.name}</p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
