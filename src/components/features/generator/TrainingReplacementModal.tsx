import React from 'react';
import { createPortal } from 'react-dom';
import { TrainingItem, Platform } from '../../../types';
import { CloseIcon, InstagramIcon, XIcon, GoogleMapsIcon, MagicWandIcon, TrashIcon } from '../../Icons';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface TrainingReplacementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReplace: (id: string) => void;
    currentItems: TrainingItem[];
    newContent: string;
    platform: Platform;
    presetName: string;
}

const TrainingReplacementModal: React.FC<TrainingReplacementModalProps> = ({
    isOpen,
    onClose,
    onReplace,
    currentItems,
    newContent,
    platform,
    presetName,
}) => {
    useScrollLock(isOpen);

    if (!isOpen) return null;

    const getPlatformIcon = (p: Platform) => {
        switch (p) {
            case Platform.X: return <XIcon className="w-3 h-3 text-white" />;
            case Platform.Instagram: return <InstagramIcon className="w-3 h-3 text-white" />;
            case Platform.GoogleMaps: return <GoogleMapsIcon className="w-3 h-3 text-white" />;
            default: return null;
        }
    };

    const getPlatformColor = (p: Platform) => {
        switch (p) {
            case Platform.X: return 'bg-black';
            case Platform.Instagram: return 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500';
            case Platform.GoogleMaps: return 'bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 ring-1 ring-white/10">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/60">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100">
                            <MagicWandIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="font-black text-xl text-slate-800 tracking-tight">AIプロフィールの育成</h2>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">Limit: 5 Items per profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Info Box */}
                <div className="px-8 pt-8 pb-4">
                    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100/50 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <p className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">育成データが上限に達しています</p>
                        </div>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed">
                            「{presetName}」の学習データは5件までです。学習を続けるには、既存のデータ1件と入れ替えてください。
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {/* New Item Preview */}
                    <div className="space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">追加したい新しい文体</span>
                        <div className="p-6 bg-white border-2 border-dashed border-indigo-200 rounded-[28px] relative overflow-hidden group">
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm ring-1 ring-indigo-200">NEW</span>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center shadow-md ${getPlatformColor(platform)}`}>
                                    {getPlatformIcon(platform)}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-700 leading-relaxed pr-16">{newContent}</p>
                        </div>
                    </div>

                    {/* Existing Items List */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">入れ替え候補を選択してください</span>
                        <div className="space-y-3">
                            {currentItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onReplace(item.id)}
                                    className="w-full text-left p-6 rounded-[28px] bg-white border border-slate-100 hover:border-indigo-300 hover:bg-slate-50 transition-all shadow-sm group flex flex-col gap-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${getPlatformColor(item.platform)}`}>
                                                {getPlatformIcon(item.platform)}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center gap-1">
                                            Replace with this
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed">{item.content}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TrainingReplacementModal;
