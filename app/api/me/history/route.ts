import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { data: ent, error: entErr } = await supabase
    .from("entitlements")
    .select("plan,status,expires_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json({ ok: false, error: entErr.message });
  }

  const isPro =
    ent?.plan === "pro" &&
    ent?.status === "active" &&
    (!ent.expires_at || new Date(ent.expires_at).getTime() > Date.now());

  let query = supabase
    .from("ai_runs")
    .select("id, run_type, created_at, ai_run_records(input, output)")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!isPro) {
    query = query.limit(5);
  }

  const { data, error: historyErr } = await query;

  if (historyErr) {
    return NextResponse.json({ ok: false, error: historyErr.message });
  }

  const history = (data ?? []).map((row: any) => {
  const rec = Array.isArray(row.ai_run_records)
    ? row.ai_run_records[0]
    : row.ai_run_records;

  return {
    run_id: row.id,                 // ★ここ
    run_type: row.run_type,
    created_at: row.created_at,
    input: rec?.input ?? null,      // ★ここ
    output: rec?.output ?? null,    // ★ここ
  };
});

  return NextResponse.json({ ok: true, history });
}
