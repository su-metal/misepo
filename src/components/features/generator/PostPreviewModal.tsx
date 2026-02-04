import React from 'react';
import { createPortal } from 'react-dom';
import { Platform, StoreProfile } from '../../../types';
import { getPlatformIcon } from './utils';
import { CloseIcon, HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, MoreHorizontalIcon, ShareIcon, RotateCcwIcon } from '../../Icons';
import { LinePreview } from './LinePreview';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface PostPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: Platform;
    text: string;
    storeProfile: StoreProfile;
    onChange?: (text: string) => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
    isOpen,
    onClose,
    platform,
    text,
    storeProfile,
    onChange
}) => {
    // State to handle client-side rendering for Portal
    const [mounted, setMounted] = React.useState(false);

    useScrollLock(isOpen);

    React.useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.setAttribute('data-preview-modal-open', 'true');
        } else {
            document.body.removeAttribute('data-preview-modal-open');
        }
        return () => {
            document.body.removeAttribute('data-preview-modal-open');
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-opacity animate-in fade-in duration-500"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg h-[90vh] bg-white rounded-[48px] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 shadow-[0_30px_80px_rgba(0,0,0,0.15)] flex flex-col">
                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#80CAFF]/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#F87171]/5 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex items-center justify-between p-7 sm:p-9 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm text-[#2b2b2f]">
                            {getPlatformIcon(platform)}
                        </div>
                        <div>
                            <h3 className="text-[14px] font-black text-[#2b2b2f] leading-tight uppercase tracking-tight">
                                プレビュー
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Platform Preview</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-[#2b2b2f] hover:bg-slate-50 transition-all active:scale-90 shadow-sm"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 bg-white overflow-y-auto no-scrollbar relative z-10">
                    {/* Platform Specific Preview */}
                    <div className="flex justify-center px-4 py-12">

                        {/* Instagram Preview */}
                        {platform === Platform.Instagram && (
                            <div className="w-full max-w-[400px] overflow-hidden text-left bg-white rounded-[32px] shadow-lg border border-white/5">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-[#F5F5F5]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[11px] font-black text-black uppercase border-2 border-white">
                                                {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[12px] font-black text-black leading-none mb-1">
                                                {storeProfile.name || 'your_account'}
                                            </div>
                                            <div className="text-[10px] font-bold text-black/40 leading-none">Original Audio</div>
                                        </div>
                                    </div>
                                    <MoreHorizontalIcon className="w-5 h-5 text-black/40" />
                                </div>

                                {/* Image Placeholder */}
                                <div className="w-full aspect-square bg-[#FAFAFA] flex flex-col items-center justify-center gap-4 border-y border-[#F5F5F5]">
                                    <div className="w-14 h-14 rounded-[20px] bg-white border-2 border-[#E5E5E5] flex items-center justify-center text-[#CCCCCC]">
                                        <ShareIcon className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black text-[#CCCCCC] uppercase tracking-[0.3em]">Image Area</span>
                                </div>

                                {/* Actions */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-5">
                                            <HeartIcon className="w-7 h-7 text-black" />
                                            <MessageCircleIcon className="w-7 h-7 text-black" />
                                            <SendIcon className="w-7 h-7 text-black" />
                                        </div>
                                        <BookmarkIcon className="w-7 h-7 text-black" />
                                    </div>

                                    <div className="text-xs font-black text-black mb-4">1,234 likes</div>

                                    <div className="text-[14px] text-black font-medium leading-relaxed">
                                        <span className="font-black mr-2">{storeProfile.name || 'your_account'}</span>
                                        <AutoResizingTextarea
                                            value={text}
                                            onChange={(e) => onChange?.(e.target.value)}
                                            className="w-full bg-transparent focus:outline-none resize-none p-0 inline-block font-medium min-h-[1.5em]"
                                        />
                                    </div>
                                    <div className="text-[10px] font-black text-[#CCCCCC] mt-6 uppercase tracking-widest text-left">2 hours ago</div>
                                </div>
                            </div>
                        )}

                        {/* X (Twitter) Preview */}
                        {platform === Platform.X && (
                            <div className="w-full px-4 py-5 max-w-[475px] text-left bg-white rounded-[32px] shadow-lg border border-white/5">
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-[12px] font-black text-white flex-shrink-0">
                                        {(storeProfile.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-1.5 truncate">
                                                <span className="text-[15px] font-black text-black truncate">{storeProfile.name || 'Name'}</span>
                                                <span className="text-[13px] font-bold text-[#666666] truncate">@{storeProfile.name ? 'store_id' : 'id'}</span>
                                                <span className="text-[13px] text-[#999999]">· 2h</span>
                                            </div>
                                            <MoreHorizontalIcon className="w-5 h-5 text-[#CCCCCC]" />
                                        </div>

                                        <div className="text-[15px] text-black font-medium leading-tight mb-4">
                                            <AutoResizingTextarea
                                                value={text}
                                                onChange={(e) => onChange?.(e.target.value)}
                                                className="w-full bg-transparent focus:outline-none resize-none p-0 inline-block font-medium min-h-[1.2em]"
                                            />
                                        </div>

                                        <div className="mt-6 flex items-center justify-between text-[#999999]">
                                            <div className="flex items-center gap-2 group text-left">
                                                <MessageCircleIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">2</span>
                                            </div>
                                            <div className="flex items-center gap-2 group text-left">
                                                <RotateCcwIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">5</span>
                                            </div>
                                            <div className="flex items-center gap-2 group text-left">
                                                <HeartIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                                <span className="text-[12px] font-black">12</span>
                                            </div>
                                            <div className="flex items-center gap-2 group text-left">
                                                <ShareIcon className="w-5 h-5 group-hover:text-black transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Google Maps Preview */}
                        {platform === Platform.GoogleMaps && (
                            <div className="w-full p-8 max-w-[500px] text-left bg-white rounded-[32px] shadow-lg border border-white/5">
                                <div className="flex gap-4">
                                    {/* Left Border Line (Thread indicator) */}
                                    <div className="w-1 bg-[#F5F5F5] shrink-0 rounded-full" />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-6 text-left">
                                            {/* Google blue user icon */}
                                            <div className="w-12 h-12 rounded-full bg-[#E5E5E5] text-[#999999] flex items-center justify-center shrink-0">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                            </div>

                                            <div className="text-left">
                                                <div className="text-[15px] font-black text-black leading-tight">
                                                    {storeProfile.name || 'Your Store Name'}（オーナー）
                                                </div>
                                                <div className="text-[12px] font-bold text-[#999999] mt-1">
                                                    1 分前
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-[14px] text-black font-medium leading-relaxed">
                                            <AutoResizingTextarea
                                                value={text}
                                                onChange={(e) => onChange?.(e.target.value)}
                                                className="w-full bg-transparent focus:outline-none resize-none p-0 inline-block font-medium min-h-[1.5em]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LINE Preview */}
                        {platform === Platform.Line && (
                            <div className="w-full max-w-[450px]">
                                <LinePreview text={text} storeProfile={storeProfile} onChange={onChange} />
                            </div>
                        )}

                    </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto relative z-10">
                    <button
                        onClick={onClose}
                        className="w-full py-5 rounded-[20px] font-black text-[14px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-xl bg-[#2b2b2f] text-white hover:bg-black relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-shine opacity-10 group-hover:animate-shine pointer-events-none" />
                        <div className="relative z-10">保存して閉じる</div>
                    </button>
                    <p className="mt-4 text-[10px] font-black text-slate-400 text-center uppercase tracking-widest leading-relaxed opacity-60">
                        ※ 実際の表示結果とは多少異なる場合があります
                    </p>
                </div>
            </div>
        </div>,

        document.body
    );
};

