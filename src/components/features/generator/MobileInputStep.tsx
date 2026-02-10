import React from 'react';
import { Platform } from '../../../types';
import { usePostInput } from './PostInputContext';
import { AutoResizingTextarea } from './AutoResizingTextarea';
import {
    MicIcon, EraserIcon, SparklesIcon, CloseIcon, ChevronRightIcon
} from '../../Icons';
import { InspirationDeck } from './InspirationDeck';

interface MobileInputStepProps {
    isOmakaseMode: boolean;
    setIsOmakaseMode: (v: boolean) => void;
    isListening: boolean;
    toggleVoiceInput: () => void;
    handleOmakaseStart: () => void;
    cachedInspirationCards: any[];
    setCachedInspirationCards: (cards: any[]) => void;
    questionContainerRef: React.RefObject<HTMLDivElement>;
    isPromptExpanded: boolean;
    setIsPromptExpanded: (v: boolean) => void;
    onGoToConfirm: () => void;
}

export const MobileInputStep: React.FC<MobileInputStepProps> = ({
    isOmakaseMode,
    setIsOmakaseMode,
    isListening,
    toggleVoiceInput,
    handleOmakaseStart,
    cachedInspirationCards,
    setCachedInspirationCards,
    questionContainerRef,
    isPromptExpanded,
    setIsPromptExpanded,
    onGoToConfirm
}) => {
    const {
        platforms, platform, inputText, onInputTextChange,
        question, onQuestionChange, topicPrompt, onTopicPromptChange,
        storeProfile, activePresetId
    } = usePostInput();

    const isGoogleMaps = platform === Platform.GoogleMaps;
    const isAIDisabled = platforms.includes(Platform.GoogleMaps);

    return (
        <div className="flex-1 relative flex flex-col min-h-0 animate-in fade-in zoom-in-95 duration-700">

            {/* 1. Top Fixed Header Section */}
            {!isGoogleMaps && (
                <div className="flex-shrink-0 flex justify-center py-4 bg-transparent z-10">
                    <button
                        onClick={toggleVoiceInput}
                        className={`relative w-28 h-28 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-700 ${isListening ? 'scale-110' : 'hover:scale-105'}`}
                    >
                        {/* Animated Rings for Listening */}
                        {isListening && (
                            <>
                                <div className="absolute inset-0 rounded-full bg-[#80CAFF]/20 animate-ping [animation-duration:2s]" />
                                <div className="absolute inset-4 rounded-full bg-[#80CAFF]/20 animate-pulse [animation-duration:1s]" />
                            </>
                        )}
                        <div className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-xl border border-slate-100 ${isListening ? 'bg-[#2b2b2f] text-white' : 'bg-slate-50 text-[#2b2b2f]'}`}>
                            {isListening ? (
                                <div className="flex gap-1.5 h-6 items-center">
                                    <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0s]" />
                                    <div className="w-1 h-7 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                    <div className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                </div>
                            ) : (
                                <MicIcon className="w-10 h-10 text-[#2b2b2f]" />
                            )}
                            <span className={`mt-1.5 text-[8px] font-black uppercase tracking-[0.2em] ${isListening ? 'text-white' : 'text-slate-400'}`}>
                                {isListening ? '聞き取り中...' : '音声入力'}
                            </span>
                        </div>
                    </button>
                </div>
            )}

            {/* 2. Middle Scrollable Area (Main Text inputs) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-8 py-2 pb-[190px] sm:pb-[160px] no-scrollbar scrollbar-hide">
                <div className="w-full relative py-2 mb-4">
                    {/* AI Inspiration Deck for "AI Standard" */}
                    <InspirationDeck
                        storeProfile={storeProfile}
                        isVisible={
                            isOmakaseMode &&
                            activePresetId === 'plain-ai' &&
                            !inputText &&
                            !isGoogleMaps
                        }
                        cachedCards={cachedInspirationCards}
                        onCardsLoaded={setCachedInspirationCards}
                        onSelect={(prompt, q) => {
                            onInputTextChange(""); // Clear for user answer
                            if (onQuestionChange) onQuestionChange(q);
                            if (onTopicPromptChange) onTopicPromptChange(prompt);
                            setIsPromptExpanded(false);
                        }}
                    />

                    <div className="text-center space-y-2 mb-6 relative">
                        <h4 className="text-xl font-bold text-[#2b2b2f]">{isGoogleMaps ? 'Review Reply' : 'New Post'}</h4>
                        <p className="text-sm text-slate-400">
                            {isGoogleMaps ? 'Googleマップの口コミを貼り付けてください' : '今日はどんなことを伝えますか？'}
                        </p>

                        {/* AI Consultation Pill */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={!isAIDisabled ? (isOmakaseMode ? () => setIsOmakaseMode(false) : handleOmakaseStart) : undefined}
                                disabled={isAIDisabled}
                                className={`
                                    flex items-center gap-2 px-5 py-2 rounded-full border shadow-sm transition-all active:scale-95
                                    ${isAIDisabled
                                        ? 'bg-slate-50 border-slate-100 text-slate-300 opacity-60 grayscale cursor-not-allowed'
                                        : (isOmakaseMode
                                            ? 'bg-[#2b2b2f] border-[#2b2b2f] text-white hover:bg-black/80'
                                            : 'bg-white border-stone-200 text-[#2b2b2f] hover:border-stone-300 hover:bg-stone-50'
                                        )
                                    }
                                `}
                            >
                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${isAIDisabled ? 'bg-slate-200' : (isOmakaseMode ? 'bg-white/20' : 'bg-stone-800')} shadow-sm`}>
                                    {isOmakaseMode ? <CloseIcon className="w-3 h-3 text-white" /> : <SparklesIcon className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-[11px] font-black tracking-tight">
                                    {isAIDisabled ? 'AI相談 非対応' : (isOmakaseMode ? '相談を閉じる' : 'AIトピック・ソムリエに相談')}
                                </span>
                            </button>
                        </div>
                    </div>
                    {question && (
                        <div
                            ref={questionContainerRef}
                            className="mb-6 p-6 bg-[#edeff1] border border-slate-100 rounded-[32px] animate-in slide-in-from-top-4 duration-500 relative group scroll-mt-4"
                        >
                            {/* Individual Close Button for Question */}
                            <button
                                onClick={() => {
                                    if (onQuestionChange) onQuestionChange('');
                                    if (onTopicPromptChange) onTopicPromptChange('');
                                }}
                                className="absolute top-4 right-4 w-10 h-10 -m-1.5 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#2b2b2f] shadow-sm transition-all opacity-100 active:scale-90 z-20"
                                title="質問を閉じる"
                            >
                                <CloseIcon className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#80CAFF] via-[#C084FC] to-[#F87171] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <SparklesIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-[#C084FC] uppercase tracking-wider opacity-60 pointer-events-none">Sommelier Question</span>
                                    <p className="text-[15px] font-bold text-[#2b2b2f] leading-relaxed italic">
                                        「{question}」
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <AutoResizingTextarea
                        value={inputText}
                        onChange={(e) => onInputTextChange(e.target.value)}
                        placeholder={question ? "こちらの質問への答えを短く入力してください..." : (isGoogleMaps ? "こちらにお客様からの口コミを貼り付けてください。丁寧な返信案をいくつか作成します。" : "「旬の食材が入荷した」「雨の日限定の割引をする」など、短いメモ書きでも大丈夫ですよ。")}
                        className="w-full min-h-[220px] p-8 bg-[#edeff1] border border-slate-100 rounded-[40px] text-lg font-bold leading-relaxed focus:outline-none focus:border-slate-200 transition-all placeholder:text-slate-300 text-[#2b2b2f] resize-none overflow-hidden"
                    />

                    {isGoogleMaps && (
                        <button
                            onClick={toggleVoiceInput}
                            className={`absolute bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${isListening ? 'bg-[#4338CA] text-white animate-pulse' : 'bg-[#edeff1] text-[#2b2b2f]'}`}
                        >
                            <MicIcon className="w-6 h-6" />
                        </button>
                    )}

                    {inputText && (
                        <button
                            onClick={() => onInputTextChange("")}
                            className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#edeff1] border border-slate-100 flex items-center justify-center shadow-md active:scale-95 transition-all text-slate-400 hover:text-[#2b2b2f]"
                            title="入力をクリア"
                        >
                            <EraserIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

            </div>

            {/* 3. Fixed Action Area (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 z-[250] flex flex-col items-center pointer-events-auto">
                <div
                    className="w-full px-8 pt-6 pb-[calc(env(safe-area-inset-bottom)+44px)] sm:pb-[calc(env(safe-area-inset-bottom)+24px)] flex flex-col items-center gap-4 relative bg-white border-t border-slate-100"
                >
                    <button
                        onClick={onGoToConfirm}
                        disabled={isListening || !inputText.trim()}
                        className={`
                            w-full group relative overflow-hidden rounded-[32px] py-6
                            flex items-center justify-center
                            transition-all duration-500 active:scale-95 cursor-pointer
                            ${isListening || !inputText.trim()
                                ? 'bg-slate-100 cursor-not-allowed shadow-none text-slate-300'
                                : 'bg-[#2b2b2f] shadow-[0_15px_45px_rgba(0,0,0,0.1)] text-white hover:scale-[1.02]'
                            }
                        `}
                    >
                        <div className="relative flex items-center justify-center gap-3">
                            <span className="text-base font-black uppercase tracking-[0.3em] drop-shadow-sm">
                                確認画面へ
                            </span>
                            <ChevronRightIcon className="w-5 h-5 animate-arrow-flow" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
