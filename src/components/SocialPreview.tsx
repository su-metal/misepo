
import React from 'react';
import { Platform } from '../types';

interface SocialPreviewProps {
  platform: Platform;
  text: string;
  storeName: string;
}

const SocialPreview: React.FC<SocialPreviewProps> = ({ platform, text, storeName }) => {
  const formatText = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  const currentDate = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  // --- X (Twitter) Layout ---
  if (platform === Platform.X) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden w-full max-w-md mx-auto font-sans text-[15px] leading-normal text-stone-900 shadow-sm">
        <div className="p-4 flex gap-3">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[15px]">
              <span className="font-bold text-stone-900 truncate">{storeName}</span>
              <span className="text-stone-500 truncate">@{storeName.replace(/\s+/g, '').toLowerCase()}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-500">1m</span>
            </div>
            <div className="mt-0.5 whitespace-pre-wrap break-words text-stone-900">
              {/* Hashtags in blue */}
              {text.split(/(\s+)/).map((part, i) => {
                 if (part.startsWith('#') || part.startsWith('http')) {
                   return <span key={i} className="text-[#1d9bf0] whitespace-nowrap">{part}</span>;
                 }
                 return part;
              })}
            </div>
            
            {/* Actions Mockup */}
            <div className="flex justify-between mt-3 max-w-[80%] text-stone-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Instagram Layout ---
  if (platform === Platform.Instagram) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden w-full max-w-sm mx-auto font-sans text-sm shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-2.5 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white border-2 border-transparent overflow-hidden">
                <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
            </div>
            <span className="font-semibold text-xs text-stone-900">{storeName}</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-900"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </div>

        {/* Image Placeholder */}
        <div className="aspect-square bg-stone-100 flex items-center justify-center text-stone-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex justify-between mb-2">
            <div className="flex gap-4 text-stone-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </div>
          <div className="font-semibold text-xs mb-2 text-stone-900">128 likes</div>
          
          {/* Caption */}
          <div className="text-sm whitespace-pre-wrap break-words text-stone-900 leading-relaxed">
            <div className="font-semibold mb-1">{storeName}</div>
            {text.split(/(\s+)/).map((part, i) => {
                 if (part.startsWith('#')) {
                   return <span key={i} className="text-blue-900 whitespace-nowrap">{part}</span>;
                 }
                 return part;
            })}
          </div>
          <div className="text-[10px] text-stone-400 mt-2 uppercase tracking-wide">2 HOURS AGO</div>
        </div>
      </div>
    );
  }

  // --- Google Maps Layout ---
  if (platform === Platform.GoogleMaps) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 w-full max-w-md mx-auto font-sans shadow-sm">
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div className="flex-1">
             <div className="text-xs font-medium text-stone-500 mb-0.5">{storeName}</div>
             <div className="text-[10px] text-stone-400 mb-2">a week ago</div>
             <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap break-words">
                {formatText(text)}
             </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialPreview;
