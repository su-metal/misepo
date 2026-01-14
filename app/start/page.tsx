"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function StartPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (isMounted && data.user) {
        router.replace('/');
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-4">MisePoへようこそ</h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          AIが店舗の投稿を自動生成します。まずはアカウントを作成・ログインしてはじめましょう。
        </p>

        <div className="space-y-4">
          <button
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-600 transition-all"
            onClick={() => router.push('/signup')}
          >
            無料で新規登録
          </button>
          <button
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-slate-300 transition-all"
            onClick={() => router.push('/login')}
          >
            ログイン
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-6">
          初回は自動でアカウントが作成されます。
        </p>
      </div>
    </main>
  );
}
