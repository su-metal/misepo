"use client";

import { createClient } from "@/lib/supabase/client";

export default function DebugAuthPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not Found</h1>
        <p>This page is not available.</p>
      </main>
    );
  }

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
