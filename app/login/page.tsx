"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoginPanel from '@/components/LoginPanel';

export default function LoginPage() {
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

  const handleLoginGoogle = async () => {
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      console.error('Google login error:', error.message);
      alert('Googleログインに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl">
        <LoginPanel
          title="ログイン"
          description="アカウントを作成して、お店専用のAI広報担当を育てましょう。"
          onLoginGoogle={handleLoginGoogle}
          showLineButton={false}
          helperText="利用規約 と プライバシーポリシー に同意した上でログインしてください。"
        />
      </div>
    </main>
  );
}
