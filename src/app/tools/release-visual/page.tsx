"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ReleaseVisualPage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // デフォルトのキャッチコピー（AI訴求は控えめに）
    const [mainCopy, setMainCopy] = useState("もう、SNS投稿で\n悩まない。");
    const [subCopy, setSubCopy] = useState("お店専用の、\n投稿作成アシスタント。");
    const [footerCopy, setFooterCopy] = useState("\\ Web & PWA で配信開始 /");
    const [isExporting, setIsExporting] = useState(false); // エクスポート時用（点線枠消しなど）

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerExportMode = () => {
        setIsExporting(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-stone-100 p-8 font-inter">
            {/* Header / Controls */}
            <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
                <h1 className="text-xl font-bold text-stone-700">Misepo Release Visual Generator</h1>
                <div className="flex gap-4">
                    <button
                        onClick={triggerExportMode}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${isExporting ? 'bg-red-500 text-white' : 'bg-stone-200 text-stone-600'}`}
                    >
                        {isExporting ? '編集モードに戻る' : 'プレビューモード（枠線を隠す）'}
                    </button>
                </div>
            </div>

            {/* Canvas Area - 16:9 Aspect Ratio Container */}
            <div className="max-w-7xl mx-auto relative group">
                <div
                    className="w-full aspect-video bg-gradient-to-br from-[#fdfcff] via-[#f5f0ff] to-[#e8e4ff] relative overflow-hidden shadow-2xl rounded-xl border border-stone-200"
                    // Misepo Gradient: from-white via-indigo-50 to-purple-50 style but more vibrant
                    style={{
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #eef2ff 50%, #fce7f3 100%)'
                    }}
                >
                    {/* Background Decor */}
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-orange-300/10 rounded-full blur-[120px]" />

                    <div className="absolute inset-0 flex items-center justify-center px-16 lg:px-24">
                        <div className="w-full max-w-6xl flex items-center justify-between gap-12">

                            {/* LEFT: Copy Area */}
                            <div className="flex-1 flex flex-col gap-8 z-10">
                                {/* Main Copy */}
                                <div className="relative group/edit">
                                    {!isExporting && <div className="absolute -inset-4 border-2 border-dashed border-blue-300/50 rounded-lg pointer-events-none opacity-0 group-hover/edit:opacity-100 transition-opacity" />}
                                    <textarea
                                        value={mainCopy}
                                        onChange={(e) => setMainCopy(e.target.value)}
                                        className="w-full bg-transparent text-5xl lg:text-7xl font-black text-[#2b2b2f] leading-tight focus:outline-none resize-none overflow-hidden placeholder-stone-300 drop-shadow-sm whitespace-pre-wrap"
                                        rows={2}
                                        spellCheck={false}
                                    />
                                </div>

                                {/* Sub Copy */}
                                <div className="relative group/edit w-fit">
                                    {!isExporting && <div className="absolute -inset-4 border-2 border-dashed border-blue-300/50 rounded-lg pointer-events-none opacity-0 group-hover/edit:opacity-100 transition-opacity" />}
                                    <textarea
                                        value={subCopy}
                                        onChange={(e) => setSubCopy(e.target.value)}
                                        className="w-full bg-transparent text-xl lg:text-2xl font-bold text-stone-500 leading-relaxed focus:outline-none resize-none overflow-hidden placeholder-stone-300 whitespace-pre-wrap"
                                        rows={2}
                                        spellCheck={false}
                                    />
                                </div>

                                {/* Footer Logo Area */}
                                <div className="mt-8 flex items-center gap-6">
                                    {/* App Icon (Placeholder or Real) */}
                                    <div className="w-20 h-20 bg-white rounded-[20px] shadow-lg flex items-center justify-center overflow-hidden border border-white/50">
                                        {/* Simple 'M' Logo representation for now, or replace with real img */}
                                        <span className="text-4xl font-black bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent transform -rotate-6 mt-1">M</span>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="relative group/edit w-fit">
                                            {!isExporting && <div className="absolute -inset-2 border-2 border-dashed border-blue-300/50 rounded-lg pointer-events-none opacity-0 group-hover/edit:opacity-100 transition-opacity" />}
                                            <input
                                                value={footerCopy}
                                                onChange={(e) => setFooterCopy(e.target.value)}
                                                className="bg-transparent text-lg lg:text-xl font-bold text-stone-400 uppercase tracking-widest focus:outline-none w-[400px]"
                                                spellCheck={false}
                                            />
                                        </div>
                                        <h2 className="text-4xl font-black text-[#2b2b2f] tracking-tight">Misepo - ミセポ</h2>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Mockup Area */}
                            <div className="flex-1 flex justify-center items-center relative z-20 h-[80vh] max-h-[700px]">
                                {/* iPhone Frame Mockup (CSS only for flexibility) */}
                                <div
                                    className="relative w-[340px] h-[680px] bg-[#1a1a1a] rounded-[50px] shadow-2xl border-[8px] border-[#393939] overflow-hidden"
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30" />

                                    {/* Screen Content */}
                                    <div className="w-full h-full bg-stone-100 relative overflow-hidden group/screen cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        {uploadedImage ? (
                                            <img src={uploadedImage} alt="Screen" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 gap-2 p-8 text-center bg-stone-50 border-2 border-dashed border-stone-200 m-2 rounded-[40px]">
                                                <span className="text-4xl">📱</span>
                                                <p className="text-sm font-bold">ここに画像をドロップ<br />またはクリックしてアップロード</p>
                                            </div>
                                        )}

                                        {/* Hover Overlay for Upload hint */}
                                        {!isExporting && uploadedImage && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/screen:opacity-100 transition-opacity">
                                                <p className="text-white font-bold bg-black/20 px-4 py-2 rounded-full backdrop-blur">画像を変更</p>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                {/* Shadow / Reflection */}
                                <div className="absolute -bottom-10 w-[300px] h-[20px] bg-black/20 blur-xl rounded-full" />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-stone-100">
                    <h3 className="font-bold text-stone-700 mb-2">使い方</h3>
                    <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                        <li>右側のスマホエリアに、アプリのスクリーンショットをドラッグ＆ドロップしてください。</li>
                        <li>左側の文字エリアをクリックすると、テキストを自由に編集できます。</li>
                        <li>編集が終わったら、右上の「プレビューモード」ボタンを押して枠線を消し、OSのスクリーンショット機能で保存してください。</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
