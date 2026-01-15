import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;

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

interface SaveHistoryBody {
  profile?: any;
  config?: any;
  result?: any;
  run_type?: string;
  is_pro?: boolean;
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: SaveHistoryBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const profile = body.profile;
  const config = body.config;
  const result = body.result;

  if (!profile || !config || !Array.isArray(result)) {
    return NextResponse.json({ ok: false, error: "missing history payload" }, { status: 400 });
  }

  const runType =
    typeof body.run_type === "string" && body.run_type.trim()
      ? body.run_type
      : "generation";

  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
    "save_history_with_cap",
    {
      p_app_id: APP_ID,
      p_user_id: user.id,
      p_run_type: runType,
      p_is_pro: body.is_pro === true,
      p_input: { profile, config },
      p_output: result,
    }
  );

  if (rpcErr) {
    return NextResponse.json({ ok: false, error: rpcErr.message }, { status: 500 });
  }

  const normalized = Array.isArray(rpcData) ? rpcData[0] : rpcData;
  let runId: string | null = null;
  if (normalized) {
    if (typeof normalized === "string") {
      runId = normalized;
    } else if (typeof normalized === "object") {
      runId =
        typeof normalized.run_id === "string"
          ? normalized.run_id
          : typeof normalized.id === "string"
            ? normalized.id
            : null;
    }
  }

  return NextResponse.json({ ok: true, run_id: runId });
}
