"use client";
import React from 'react';
import { Icons } from '../LandingPageIcons';

interface HeaderProps {
    scrolled: boolean;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    loginWithGoogle: (type: 'login' | 'signup') => void;
}

export const Header = ({ scrolled, isMenuOpen, setIsMenuOpen, loginWithGoogle }: HeaderProps) => {
    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="bg-gradient-to-br from-indigo-600 to-pink-500 p-1.5 rounded-lg text-white shadow-md">
                            <Icons.Smartphone size={20} />
                        </div>
                        <span className="font-black text-xl tracking-tight text-slate-800">MisePo</span>
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        {['お悩み', '機能', 'デモ', '料金', 'FAQ'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing', '#faq'][i]} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors relative group">
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full opacity-50" />
                            </a>
                        ))}
                    </nav>
                    <div className="hidden md:flex items-center space-x-3">
                        <button onClick={() => loginWithGoogle('login')} className="text-slate-600 font-bold hover:text-indigo-600 px-4 py-2 text-sm transition-colors">ログイン</button>
                        <button onClick={() => window.location.href = '/start'} className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-300">無料で始める</button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 hover:text-slate-900 focus:outline-none p-2" aria-label="メニューを開く">
                            {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl animate-fade-in">
                    <div className="px-4 py-6 space-y-3">
                        {['お悩み', '機能', 'デモ', '料金'].map((item, i) => (
                            <a key={item} href={['#problem', '#features', '#demo', '#pricing'][i]} className="block px-4 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsMenuOpen(false)}>{item}</a>
                        ))}
                        <div className="pt-4 flex flex-col gap-3 px-4">
                            <button onClick={() => loginWithGoogle('login')} className="w-full bg-indigo-50 text-indigo-700 px-5 py-3.5 rounded-xl font-bold hover:bg-indigo-100 transition-colors">ログイン</button>
                            <button onClick={() => window.location.href = '/start'} className="w-full bg-indigo-600 text-white px-5 py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200">無料で始める</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
