"use client";

import { createClient } from "@/lib/supabase/client";

export default function DebugAuthPage() {
  const supabase = createClient();

  const showUid = async () => {
    const { data, error } = await supabase.auth.getUser();
    console.log("user:", data.user, "error:", error);
    alert(data.user?.id ? `UID: ${data.user.id}` : "UIDが取れません（未ログインの可能性）");
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Auth Debug</h1>
      <button onClick={showUid}>UIDを表示</button>
    </main>
  );
}
