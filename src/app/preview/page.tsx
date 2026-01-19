"use client";

import React, { useState } from 'react';
import { DeviceFrame } from '@/components/DeviceFrame';

export default function PreviewPage() {
    const [currentUrl, setCurrentUrl] = useState('/');
    const [key, setKey] = useState(0); // To force refresh iframe

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentUrl(e.target.value);
    };

    const navigateTo = (path: string) => {
        setCurrentUrl(path);
    };

    const refresh = () => {
        setKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-8 font-sans text-slate-900">

            {/* Header / Controls */}
            <div className="w-full max-w-2xl mb-8 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Mobile Preview</h1>
                    <div className="flex gap-2 text-sm">
                        <button
                            onClick={() => navigateTo('/')}
                            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${currentUrl === '/' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => navigateTo('/start')}
                            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${currentUrl === '/start' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Start
                        </button>
                        <button
                            onClick={() => navigateTo('/login')}
                            className={`px-3 py-1.5 rounded-full font-bold transition-colors ${currentUrl === '/login' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                            Login
                        </button>
                    </div>
                </div>

                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                    <button
                        onClick={refresh}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Reload"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    </button>
                    <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-600 font-mono flex items-center overflow-hidden">
                        <span className="text-slate-400 mr-1">localhost:3000</span>
                        <input
                            type="text"
                            value={currentUrl}
                            onChange={handleUrlChange}
                            className="bg-transparent w-full outline-none text-slate-700"
                            placeholder="/"
                        />
                    </div>
                    <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Open in new tab"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                </div>
            </div>

            {/* The Device Frame */}
            <DeviceFrame>
                <iframe
                    key={key}
                    src={currentUrl}
                    className="w-full h-full border-none bg-white"
                    title="App Preview"
                />
            </DeviceFrame>

            <p className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-wider">
                MisePo Development Environment
            </p>
        </div>
    );
}
