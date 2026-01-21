import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";

const APP_ID = env.APP_ID;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json({ ok: false, error: entErr.message }, { status: 500 });
  }

  let effectiveEnt = ent ?? null;
  if (!effectiveEnt) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert(
        {
          app_id: APP_ID,
          user_id: user.id,
          plan: "free",
          status: "inactive",
          expires_at: null,
          trial_ends_at: null,
        },
        { onConflict: "user_id,app_id" }
      )
      .select("plan,status,expires_at,trial_ends_at")
      .single();

    if (createErr) {
      return NextResponse.json(
        { ok: false, error: createErr.message },
        { status: 500 }
      );
    }

    effectiveEnt = created;
  }

  // Allow all logged-in users to view their history
  // (removed strict canUseApp check to support trial and free users)

  // Query through ai_runs with join to ai_run_records (foreign key relationship)
  console.log("[HISTORY FETCH] Querying:", { app_id: APP_ID, user_id: user.id });
  
  const { data, error: historyErr } = await supabaseAdmin
    .from("ai_runs")
    .select("id, run_type, created_at, ai_run_records(input, output)")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  console.log("[HISTORY FETCH] Result:", { 
    count: data?.length ?? 0, 
    error: historyErr?.message ?? null,
  });

  if (historyErr) {
    return NextResponse.json({ ok: false, error: historyErr.message });
  }

  const history = (data ?? []).map((row: any) => {
    const rec = Array.isArray(row.ai_run_records)
      ? row.ai_run_records[0]
      : row.ai_run_records;

    return {
      id: row.id,
      created_at: row.created_at,
      config: rec?.input ?? {},
      result: rec?.output ?? [],
    };
  });

  return NextResponse.json({ ok: true, history });
}

interface SaveHistoryBody {
  profile?: any;
  config?: any;
  result?: any;
  run_type?: string;
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

  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json({ ok: false, error: entErr.message }, { status: 500 });
  }

  let effectiveEnt = ent ?? null;
  if (!effectiveEnt) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert(
        {
          app_id: APP_ID,
          user_id: user.id,
          plan: "free",
          status: "inactive",
          expires_at: null,
          trial_ends_at: null,
        },
        { onConflict: "user_id,app_id" }
      )
      .select("plan,status,expires_at,trial_ends_at")
      .single();

    if (createErr) {
      return NextResponse.json(
        { ok: false, error: createErr.message },
        { status: 500 }
      );
    }

    effectiveEnt = created;
  }

  const canUseApp = computeCanUseApp(effectiveEnt);

  if (!canUseApp) {
    return NextResponse.json({ ok: false, error: "access_denied" }, { status: 403 });
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

  // Step 1: Create ai_runs record first (required for foreign key)
  const { data: runData, error: runError } = await supabaseAdmin
    .from("ai_runs")
    .insert({
      app_id: APP_ID,
      user_id: user.id,
      run_type: runType,
    })
    .select("id")
    .single();

  if (runError) {
    return NextResponse.json({ ok: false, error: runError.message }, { status: 500 });
  }

  // Step 2: Create ai_run_records with the run_id (include all columns)
  const { error: recordError } = await supabaseAdmin
    .from("ai_run_records")
    .insert({
      run_id: runData.id,
      app_id: APP_ID,
      user_id: user.id,
      input: { profile, config },
      output: result,
    });

  if (recordError) {
    return NextResponse.json({ ok: false, error: recordError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, run_id: runData.id });
}
