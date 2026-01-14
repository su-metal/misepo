"use client";

export default function BillingPage() {
  const goCheckout = async () => {
    const res = await fetch("/api/billing/checkout", { method: "POST" });

    const text = await res.text(); // ←まず文字列で受ける
    console.log("checkout status:", res.status);
    console.log("checkout raw:", text);

    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      alert("APIがJSONを返していません。Consoleに raw を出しました。");
      return;
    }

    if (!res.ok || !data?.ok) {
      alert(data?.error ?? `checkout failed (${res.status})`);
      return;
    }

    window.location.href = data.url;
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Proプラン</h1>
      <button onClick={goCheckout}>Stripeで支払う（テスト）</button>
      <p style={{ marginTop: 16 }}>
        <a href="/billing/manage">サブスク管理・解約はこちら</a>
      </p>
    </main>
  );
}
