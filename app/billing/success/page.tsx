"use client";

import { useState } from "react";

export default function BillingSuccessPage() {
  const [plan, setPlan] = useState<string>("");

  const refresh = async () => {
    const res = await fetch("/api/me/plan");
    const data = await res.json();
    setPlan(`isPro=${data.isPro} plan=${data.plan} status=${data.status}`);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>お支払いが完了しました（テスト）</h1>
      <button onClick={refresh}>Pro状態を確認</button>
      {plan && <p style={{ marginTop: 12 }}>{plan}</p>}
      <p><a href="/">トップへ戻る</a></p>
    </main>
  );
}
