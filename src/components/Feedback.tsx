"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CloseIcon, SendIcon, StarIcon, MessageCircleIcon } from './Icons';


export const Feedback = ({ mode = 'floating' }: { mode?: 'floating' | 'sidebar' }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only show on App/Generator pages (/generate)
    const showFeedback = pathname?.startsWith('/generate');

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('満足度を選択してください');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const { error: submitError } = await supabase
                .from('feedbacks')
                .insert({
                    user_id: user?.id || null,
                    rating,
                    content,
                });

            if (submitError) throw submitError;

            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                resetForm();
            }, 2000);
        } catch (err: any) {
            console.error('Feedback submission error:', err);
            setError('送信に失敗しました。時間をおいて再度お試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setContent('');
        setIsSuccess(false);
        setError(null);
    };

    if (!showFeedback) return null;

    return (
        <>
            {/* Trigger Button */}
            {mode === 'sidebar' ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all group w-full h-full bg-white shadow-sm ring-1 ring-slate-100 hover:shadow-md hover:bg-slate-50 active:scale-95"
                    title="フィードバック"
                >
                    <MessageCircleIcon className="w-4 h-4 text-slate-400 group-hover:text-[#7F5AF0] group-hover:scale-110 transition-all" />
                    <span className="text-[8px] font-black text-slate-400 tracking-widest uppercase group-hover:text-slate-600">Feedback</span>
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="hidden md:flex fixed bottom-8 right-8 z-[100] items-center gap-3 transition-all group px-6 py-4 bg-[#7F5AF0] text-white rounded-full shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 active:scale-95 active:translate-y-0"
                >
                    <MessageCircleIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-extrabold text-sm tracking-tight">フィードバック</span>
                </button>
            )}

            {/* Modal Overlay */}
            {(isOpen && mounted) && createPortal(
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                >
                    {/* VisionOS Style Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        className="relative w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 bg-white rounded-[40px] shadow-2xl ring-1 ring-black/5"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">FEEDBACK</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10">
                            {isSuccess ? (
                                <div className="py-12 text-center animate-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-indigo-100 shadow-xl">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">送信完了！</h3>
                                    <p className="text-slate-400 font-medium text-sm">貴重なご意見ありがとうございます。</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10">
                                    {/* Star Rating */}
                                    <div className="text-center">
                                        <p className="text-sm font-black text-slate-600 mb-8 tracking-tight capitalize">どのくらい満足されましたか？ <span className="text-rose-500 ml-1">*</span></p>
                                        <div className="flex justify-center gap-5">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onMouseEnter={() => setHoverRating(num)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(num)}
                                                    className="focus:outline-none transition-all hover:scale-125 active:scale-90"
                                                >
                                                    <StarIcon
                                                        className={`w-12 h-12 transition-colors duration-300 ${(hoverRating || rating) >= num ? 'text-[#FFD700] fill-[#FFD700]' : 'text-slate-100'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 tracking-widest uppercase flex justify-between px-1">
                                            詳細なご意見・ご要望 <span>Optional</span>
                                        </label>
                                        <div className="relative group">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="アプリの使い心地はいかがですか？改善点やご要望など..."
                                                className="w-full h-44 p-6 rounded-[28px] transition-all outline-none text-base font-medium text-slate-700 resize-none placeholder:text-slate-300 bg-slate-50 focus:bg-white focus:shadow-lg focus:shadow-slate-100 group-hover:bg-slate-100 focus:group-hover:bg-white ring-1 ring-transparent focus:ring-[#7F5AF0]/10"
                                                maxLength={500}
                                            />
                                            <div className="absolute bottom-4 right-6">
                                                <span className="text-[10px] font-bold text-slate-300 tracking-widest">{content.length} / 500</span>
                                            </div>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-xs font-bold text-rose-500 text-center animate-bounce">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || rating === 0}
                                        className="w-full relative group rounded-[20px] transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none hover:-translate-y-1 active:scale-95 active:translate-y-0 p-[1.5px] overflow-hidden"
                                    >
                                        {/* 1. Radiant Aura Container (Clipped Background) */}
                                        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                                                style={{
                                                    background: 'linear-gradient(45deg, #22D3EE, #FACC15, #F472B6)'
                                                }}
                                            />
                                        </div>

                                        {/* 2. Content Layer */}
                                        <div className="relative z-10 w-full h-full bg-[#111111] text-white rounded-[19px] py-5 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group-hover:shadow-2xl">
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    <SendIcon className="w-4 h-4" />
                                                    フィードバックを送信
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                , document.body)}

            <style jsx>{`
                .animate-in { 
                    animation-duration: 400ms;
                    animation-fill-mode: both;
                }
                .fade-in {
                    animation-name: fadeIn;
                }
                .zoom-in-95 {
                    animation-name: zoomIn95;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoomIn95 {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </>
    );
};
