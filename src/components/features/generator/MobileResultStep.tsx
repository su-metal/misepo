import React from 'react';
import { usePostInput } from './PostInputContext';
import { PostResultTabs } from './PostResultTabs';

export const MobileResultStep: React.FC = () => {
    const {
        generatedResults = [], activeResultTab = 0, onResultTabChange,
        onManualEdit, onToggleFooter, onRefine, onRegenerateSingle,
        onShare, getShareButtonLabel, storeProfile,
        refiningKey, onRefineToggle, refineText, onRefineTextChange,
        onPerformRefine, isRefining,
        includeFooter, onIncludeFooterChange,
        onAutoFormat, isAutoFormatting, onCopy
    } = usePostInput();

    return (
        <div className="flex-1 overflow-x-hidden overflow-y-auto pb-4 animate-in fade-in slide-in-from-bottom-10 duration-700 px-0">
            <PostResultTabs
                results={generatedResults}
                activeTab={activeResultTab}
                onTabChange={onResultTabChange!}
                onManualEdit={onManualEdit!}
                onToggleFooter={onToggleFooter!}
                onRefine={onRefine!}
                onRegenerateSingle={onRegenerateSingle!}
                onShare={onShare!}
                getShareButtonLabel={getShareButtonLabel!}
                storeProfile={storeProfile}
                refiningKey={refiningKey!}
                onRefineToggle={onRefineToggle!}
                refineText={refineText!}
                onRefineTextChange={onRefineTextChange!}
                onPerformRefine={onPerformRefine!}
                isRefining={isRefining!}
                includeFooter={includeFooter!}
                onIncludeFooterChange={onIncludeFooterChange!}
                onAutoFormat={onAutoFormat!}
                isAutoFormatting={isAutoFormatting!}
                onCopy={onCopy!}
            />
        </div>
    );
};
