import React from 'react';
import { Platform, StoreProfile } from '../../../types';
import { getPlatformIcon } from './utils';
import { XIcon, HeartIcon, MessageCircleIcon, SendIcon, BookmarkIcon, MoreHorizontalIcon, ShareIcon, RotateCcwIcon } from '../../Icons';

interface PostPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    platform: Platform;
    text: string;
    storeProfile: StoreProfile;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
    isOpen,
    onClose,
    platform,
    text,
    storeProfile
}) => {
    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-preview-modal-open', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-preview-modal-open');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.removeAttribute('data-preview-modal-open');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-black rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-lime/20">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="text-sm font-black text-lime uppercase tracking-widest flex items-center gap-2">
                        {getPlatformIcon(platform)}
                        <span>Preview</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                    >
                        <XIcon className="w-5 h-5 text-lime/50 hover:text-lime transition-colors" />
                    </button>
                </div>

                <div className="p-0 bg-stone-900/50 max-h-[80vh] overflow-y-auto">
                    {/* Platform Specific Preview */}
                    <div className="flex justify-center p-4">

                        {/* Instagram Preview */}
                        {platform === Platform.Instagram && (
                            <div className="w-full bg-white border border-gray-200 rounded-sm shadow-sm max-w-[370px]">
                                {/* Header */}
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-black p-[2px] border border-lime/30">
                                            <div className="w-full h-full rounded-full bg-black border-2 border-transparent" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900 leading-none mb-0.5">
                                                {storeProfile.name || 'your_account'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 leading-none">Original Audio</div>
                                        </div>
                                    </div>
                                    <MoreHorizontalIcon className="w-4 h-4 text-gray-600" />
                                </div>

                                {/* Image Placeholder */}
                                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
                                    <span className="text-xs">Image Area</span>
                                </div>

                                {/* Actions */}
                                <div className="p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-4">
                                            <HeartIcon className="w-6 h-6 text-gray-800" />
                                            <MessageCircleIcon className="w-6 h-6 text-gray-800" />
                                            <SendIcon className="w-6 h-6 text-gray-800" />
                                        </div>
                                        <BookmarkIcon className="w-6 h-6 text-gray-800" />
                                    </div>

                                    <div className="text-xs font-bold text-gray-900 mb-2">1,234 likes</div>

                                    <div className="text-xs text-gray-900 whitespace-pre-wrap leading-relaxed">
                                        <span className="font-bold mr-2">{storeProfile.name || 'your_account'}</span>
                                        {text}
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-2 uppercase">2 hours ago</div>
                                </div>
                            </div>
                        )}

                        {/* X (Twitter) Preview */}
                        {platform === Platform.X && (
                            <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4 max-w-[370px]">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1 truncate">
                                                <span className="text-sm font-bold text-gray-900 truncate">{storeProfile.name || 'Name'}</span>
                                                <span className="text-sm text-gray-500 truncate">@{storeProfile.name ? 'store_id' : 'id'}</span>
                                                <span className="text-sm text-gray-500">· 2h</span>
                                            </div>
                                            <MoreHorizontalIcon className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                            {text}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between text-gray-500 max-w-xs">
                                            <div className="flex items-center gap-1 group">
                                                <MessageCircleIcon className="w-4 h-4" />
                                                <span className="text-xs">2</span>
                                            </div>
                                            <div className="flex items-center gap-1 group">
                                                <RotateCcwIcon className="w-4 h-4" />
                                                <span className="text-xs">5</span>
                                            </div>
                                            <div className="flex items-center gap-1 group">
                                                <HeartIcon className="w-4 h-4" />
                                                <span className="text-xs">12</span>
                                            </div>
                                            <div className="flex items-center gap-1 group">
                                                <ShareIcon className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Google Maps Preview */}
                        {platform === Platform.GoogleMaps && (
                            <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-[370px]">
                                <div className="p-4 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black text-lime border border-lime/20 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-lg shadow-black/20">
                                        {(storeProfile.name?.[0] || 'S').toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">{storeProfile.name || 'Your Store Name'}</div>
                                        <div className="text-xs text-gray-500">Owner · Just now</div>
                                    </div>
                                    <MoreHorizontalIcon className="w-5 h-5 text-gray-500" />
                                </div>

                                <div className="px-4 pb-4">
                                    <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                        {text}
                                    </div>
                                    <div className="mt-4">
                                        <button className="px-5 py-2 bg-black text-lime border border-lime/30 text-xs font-black uppercase tracking-widest rounded-full hover:bg-stone-900 transition-colors shadow-lg shadow-black/20">
                                            Learn more
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                <div className="p-4 bg-black border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-black text-lime border border-lime/50 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-900 transition-all shadow-xl shadow-black/20"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
