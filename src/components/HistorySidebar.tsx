import React from 'react';
import { GeneratedPost, Platform, GeneratedResult, StoreProfile, TrainingItem, Preset } from '../types';
import { CloseIcon, XIcon, InstagramIcon, GoogleMapsIcon, LineIcon, LockIcon, TrashIcon, HistoryIcon, HelpIcon, LogOutIcon, ChevronDownIcon, PinIcon, MagicWandIcon } from './Icons';

interface HistorySidebarProps {
  history: GeneratedPost[];
  isLoggedIn: boolean;
  onSelect: (post: GeneratedPost) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  onOpenLogin: () => void;
  onDelete: (id: string) => void;
  onOpenGuide?: () => void;
  onOpenSettings?: () => void;
  onOpenAccount?: () => void;
  onLogout?: () => void;
  storeProfile?: StoreProfile | null;
  favorites: Set<string>;
  trainingItems?: TrainingItem[];
  presets?: Preset[];
  onToggleFavorite: (text: string, platform: Platform, presetId: string | null, replaceId?: string, source?: 'generated' | 'manual') => Promise<void>;
  onTogglePin: (id: string, isPinned: boolean) => Promise<void>;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  history,
  isLoggedIn,
  onSelect,
  isOpen,
  toggleOpen,
  onOpenLogin,
  onDelete,
  onOpenGuide,
  onOpenSettings,
  onOpenAccount,
  onLogout,
  storeProfile,
  favorites,
  trainingItems = [],
  presets = [],
  onToggleFavorite,
  onTogglePin
}) => {
  const [showTrainedOnly, setShowTrainedOnly] = React.useState(false);

  // Helper to pick representative text
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

  const getTrainedItem = React.useCallback((item: GeneratedPost) => {
    if (!item.results) return null;
    const allTexts = item.results.flatMap(r => r.data || []);
    const matchingText = allTexts.find(text => text && favorites.has(text.trim()));
    if (!matchingText) return null;
    return trainingItems.find(ti => ti.content.trim() === matchingText.trim());
  }, [favorites, trainingItems]);

  const checkIfFavorited = React.useCallback((item: GeneratedPost) => {
    return !!getTrainedItem(item);
  }, [getTrainedItem]);

  const displayHistory = React.useMemo(() => {
    if (showTrainedOnly) {
      // Show persistent TrainingItems mapped to GeneratedPost structure
      // Show only items registered via the 'Magic Wand' (generation results)
      return trainingItems
        .filter(ti => ti.source === 'generated')
        .map(ti => ({
          id: ti.id, // ID collision theoretical risk but low for display
          timestamp: new Date(ti.createdAt).getTime(),
          results: [{
            platform: ti.platform,
            data: [ti.content]
          }],
          config: {
            inputText: ti.content, // Fallback for preview
            platforms: [ti.platform],
            platform: ti.platform,
            purpose: 'auto', // Dummy
            tone: 'standard', // Dummy
            length: 'medium', // Dummy
            presetId: ti.presetId
          },
          isPinned: false, // Training items don't have pinned state
          isTrainingItem: true // Flag to distinguish
        } as any)); // Type casting for compatibility
    }

    // Default: Show history log
    return [...history].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [history, showTrainedOnly, trainingItems]);

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case Platform.X: return <XIcon className="w-3 h-3 text-white" />;
      case Platform.Instagram: return <InstagramIcon className="w-3 h-3 text-white" />;
      case Platform.GoogleMaps: return <GoogleMapsIcon className="w-3 h-3 text-white" />;
      case Platform.Line: return <LineIcon className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  const getPlatformColor = (p: Platform) => {
    switch (p) {
      case Platform.X: return 'bg-black';
      case Platform.Instagram: return 'bg-[#E1306C]'; // Instagram official color
      case Platform.GoogleMaps: return 'bg-[#34A853]'; // Google Green
      case Platform.Line: return 'bg-[#06C755]'; // LINE Official Green
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Mobile Toggle Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9990] transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-[var(--bg-beige)] border-r-[3px] border-black shadow-[8px_0_0_0_rgba(0,0,0,0.1)] w-[85vw] sm:w-[400px] md:w-[480px] transform transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) z-[9999] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header: User Profile & Close */}
        <div className="p-6 md:p-8 border-b-[3px] border-black relative z-10 bg-[var(--bg-beige)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black text-black text-3xl tracking-tighter">MENU</h2>
            <button
              onClick={toggleOpen}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border-2 border-black text-black hover:bg-[var(--rose)] transition-all active:translate-y-1 active:shadow-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              aria-label="Close menu"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="space-y-4">
              <button
                onClick={() => { onOpenSettings?.(); toggleOpen(); }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] w-full hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--lavender)] border-2 border-black flex items-center justify-center text-black font-black text-xl">
                  {(storeProfile?.name?.[0] || 'S').toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Store Profile</p>
                  <p className="text-sm font-black text-black tracking-tight">{storeProfile?.name || 'User'}</p>
                </div>
              </button>

              {/* Quick Navigation Pack */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { onOpenAccount?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--bg-beige)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all group"
                >
                  <ChevronDownIcon className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-black tracking-widest uppercase">アカウント設定</span>
                </button>
                <button
                  onClick={() => { onOpenGuide?.(); toggleOpen(); }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-[var(--bg-beige)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all group"
                >
                  <HelpIcon className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-black tracking-widest uppercase">Docs</span>
                </button>
              </div>

              <button
                onClick={() => { onLogout?.(); toggleOpen(); }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-slate-500 hover:text-black hover:bg-white border-2 border-transparent hover:border-black transition-all text-[10px] font-black tracking-widest uppercase hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
              >
                <LogOutIcon className="w-4 h-4" />
                Sign Out
              </button>

            </div>
          ) : (
            <button
              onClick={() => { onOpenLogin(); toggleOpen(); }}
              className="w-full py-4 bg-[var(--gold)] text-black border-2 border-black rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] text-sm font-black hover:bg-[var(--rose)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 group"
            >
              ログイン / 登録
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </button>
          )}
        </div>

        {/* Content Segment: History */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-8 relative z-10 space-y-6 no-scrollbar bg-[var(--bg-beige)]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <HistoryIcon className="w-4 h-4 text-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-black uppercase tracking-[0.3em]">{showTrainedOnly ? 'Collection' : 'History'}</span>
                {isLoggedIn && (
                  <span className="text-[9px] font-bold text-slate-500 -mt-0.5">
                    {showTrainedOnly ? displayHistory.length : history.filter(h => !h.isPinned).length} items
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation & Filter */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTrainedOnly(!showTrainedOnly)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${showTrainedOnly ? 'bg-[var(--teal)] border-black text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]' : 'bg-white border-black text-slate-500 hover:bg-[var(--teal)] hover:text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]'}`}
            >
              <MagicWandIcon className={`w-4 h-4 ${showTrainedOnly ? 'text-black' : 'text-slate-400'}`} />
              <span>{showTrainedOnly ? '学習データ一覧' : '学習済みで絞り込む'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {isLoggedIn ? (
              displayHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <div className="w-16 h-16 mb-4 rounded-full bg-white border-2 border-black flex items-center justify-center text-slate-300">
                    <HistoryIcon className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                    {showTrainedOnly ? '学習データはありません' : '履歴はありません'}
                  </p>
                </div>
              ) : (
                displayHistory.map((item, idx) => {
                  const firstResult = pickFirstText(item);
                  const previewText = (firstResult && firstResult.trim()) || item.config.inputText || "...";

                  const isFavorited = (item as any).isTrainingItem || checkIfFavorited(item);
                  const primaryPlatform = item.config.platforms[0] || Platform.Instagram;
                  const isTraining = (item as any).isTrainingItem;

                  return (
                    <div
                      key={item.id}
                      className="group relative animate-in slide-in-from-bottom-2 duration-500"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <button
                        onClick={() => {
                          if (isTraining) {
                            // Restore from training item
                            // We need to call onSelect with a structure that mimics a history item effectively
                            onSelect(item);
                          } else {
                            onSelect(item);
                          }
                          toggleOpen();
                        }}
                        className="w-full text-left p-5 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all group-hover:bg-[var(--bg-beige)]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {item.config.platforms.map((p, pIdx) => (
                            <span key={`${p}-${pIdx}`} className={`flex items-center justify-center w-6 h-6 rounded-full ${getPlatformColor(p)} border-2 border-black text-white`}>
                              {getPlatformIcon(p)}
                            </span>
                          ))}
                          <div className="ml-auto flex items-center gap-2">
                            {isFavorited && (
                              <div className="px-2 py-1 bg-[var(--lavender)] border border-black rounded-md animate-in fade-in slide-in-from-right-2 duration-300">
                                <span className="text-[9px] font-black text-black uppercase tracking-tight whitespace-nowrap">
                                  {(() => {
                                    // For training items, we can try to resolve the preset name from item.config.presetId if mapped above
                                    const presetId = isTraining ? (item as any).config.presetId : getTrainedItem(item)?.presetId;
                                    const preset = presets.find(p => p.id === presetId);
                                    return preset?.name || (presetId === 'omakase' ? 'おまかせ' : 'Trained');
                                  })()}
                                </span>
                              </div>
                            )}
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">
                              {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 font-bold line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 group-hover:text-black transition-colors">
                          {previewText}
                        </p>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isTraining) {
                            // Un-learn: Remove from favorite/training
                            // item.id here is the TrainingItem ID
                            // onToggleFavorite expects (text, platform, presetId)
                            // We mapped content to item.results[0].data[0]
                            const text = item.results[0].data[0];
                            const presetId = (item as any).config.presetId;
                            onToggleFavorite(text, primaryPlatform, presetId);
                          } else {
                            onDelete(item.id);
                          }
                        }}
                        className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white text-rose-500 border-2 border-black rounded-full md:opacity-0 md:group-hover:opacity-100 transform md:scale-75 md:group-hover:scale-100 transition-all hover:bg-rose-50 shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-20 hover:scale-110"
                        title={isTraining ? "学習データを削除" : "履歴を削除"}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      {/* Pin Button - Only for normal history */}
                      {!isTraining && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onTogglePin(item.id, !item.isPinned); }}
                          className={`absolute -top-3 left-6 w-8 h-8 flex items-center justify-center rounded-full border-2 border-black transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] z-20 hover:scale-110 ${item.isPinned
                            ? 'bg-[var(--gold)] text-black'
                            : 'bg-white text-slate-300 md:opacity-0 md:group-hover:opacity-100 transform md:scale-75 md:group-hover:scale-100 hover:text-black'
                            }`}
                          title={item.isPinned ? "ピン留めを解除" : "ピン留めして保護"}
                        >
                          <PinIcon className="w-4 h-4" fill={item.isPinned ? "currentColor" : "none"} />
                        </button>
                      )}

                      {/* Training Button - Show for history items if not favorited? Or just show indicator */}
                      {/* If it's a Training View, we don't need a button to 'add' it, it's already there. 'Trash' removes it. */}
                      {!isTraining && firstResult && (
                        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 group/training z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFavorited) {
                                const favoritedText = item.results.flatMap(r => r.data || []).find(t => favorites.has(t?.trim()));
                                if (favoritedText) {
                                  onToggleFavorite(favoritedText.trim(), primaryPlatform, item.config.presetId || null, undefined, 'generated');
                                }
                              } else {
                                onToggleFavorite(firstResult.trim(), primaryPlatform, item.config.presetId || null, undefined, 'generated');
                              }
                            }}
                            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 border-black transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:scale-110 ${isFavorited
                              ? 'bg-[var(--teal)] text-black'
                              : 'bg-white text-slate-300 hover:bg-[var(--teal)] hover:text-black opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100'
                              }`}
                          >
                            <MagicWandIcon className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : null}
          </div>
        </div>

        {/* Footer: Legal */}
        <div className="p-6 border-t-[3px] border-black bg-[var(--bg-beige)] relative z-20">
          <div className="flex items-center justify-center gap-6 mb-2">
            <a href="/terms" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">利用規約</a>
            <a href="/privacy" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">プライバシーポリシー</a>
            <a href="/commercial-law" className="text-[10px] font-black text-slate-500 hover:text-black transition-colors uppercase tracking-widest">特定商取引法</a>
          </div>
          <p className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-[0.2em] mt-2">© 2026 MisePo</p>
        </div>
      </div >
    </>
  );
};

export default HistorySidebar;
