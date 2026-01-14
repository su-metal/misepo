// src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      // Supabase-js がURL内の code を検知してセッション確定（PKCE）
      // ここで getSession() が取れればOK
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("auth callback error:", error);
        router.replace("/?auth=error");
        return;
      }

      if (data.session?.user) {
        router.replace("/");
        return;
      }

      // セッションがまだなら少し待って再試行（稀にタイミングで起きる）
      setTimeout(async () => {
        const { data: retry } = await supabase.auth.getSession();
        router.replace(retry.session?.user ? "/" : "/?auth=retry_failed");
      }, 300);
    };

    run();
  }, [router]);

  return (
    <div style={{ padding: 24 }}>
      ログイン処理中…
    </div>
  );
}
