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

  if (error) {
    console.error("[HISTORY API] Auth error:", error);
    return NextResponse.json({ ok: false, error: "Authentication failed" }, { status: 500 });
  }

  if (!user) {
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

  const effectiveEnt = ent ?? null;
  // If no entitlement found, return empty history (new or reset user)
  if (!effectiveEnt) {
    return NextResponse.json({ ok: true, history: [] });
  }

  // Allow all logged-in users to view their history
  // (removed strict canUseApp check to support trial and free users)

  // Query through ai_runs with join to ai_run_records (foreign key relationship)
  console.log("[HISTORY FETCH] Querying:", { app_id: APP_ID, user_id: user.id });
  
  const { data, error: historyErr } = await supabaseAdmin
    .from("ai_runs")
    .select("id, run_type, created_at, is_pinned, ai_run_records(input, output)")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .in("run_type", ["generation", "multi-gen"])
    .order("created_at", { ascending: false })
    .limit(100); // Fetch a safe buffer

  if (historyErr) {
    return NextResponse.json({ ok: false, error: historyErr.message });
  }

  // Enforce "Latest 20 unpinned + all pinned" in results
  let unpinnedCount = 0;
  const history = (data ?? [])
    .filter((row: any) => {
      const isPinned = Boolean(row.is_pinned);
      if (isPinned) return true;
      if (unpinnedCount < 20) {
        unpinnedCount++;
        return true;
      }
      return false;
    })
    .map((row: any) => {
      const rec = Array.isArray(row.ai_run_records)
        ? row.ai_run_records[0]
        : row.ai_run_records;

      const inputData = rec?.input ?? {};
      
      // If config is missing but configs array exists (multi-gen), merge them
      let storedConfig = inputData.config;
      if (!storedConfig && Array.isArray(inputData.configs) && inputData.configs.length > 0) {
        storedConfig = {
          ...inputData.configs[0],
          // Extract all platforms from the batch for the history UI icons
          platforms: inputData.configs.map((c: any) => c.platform)
        };
      }
      
      if (!storedConfig) storedConfig = {};
      
      
      const historyEntry = {
        id: row.id,
        timestamp: new Date(row.created_at).getTime(),
        isPinned: row.is_pinned,
        config: storedConfig,
        profile: rec?.input?.profile, // Snapshot of the profile
        results: rec?.output ?? [],
      };
      
      // Debug: Log the first history entry to see data structure
      if (row.id && process.env.NODE_ENV === 'development') {
        console.log('[HISTORY DEBUG] Entry structure:', {
          id: row.id,
          outputType: typeof rec?.output,
          outputIsArray: Array.isArray(rec?.output),
          outputSample: rec?.output,
          platforms: storedConfig?.platforms,
        });
      }
      
      return historyEntry;
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

  if (error) {
    console.error("[HISTORY API POST] Auth error:", error);
    return NextResponse.json({ ok: false, error: "Authentication failed" }, { status: 500 });
  }

  if (!user) {
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

  const effectiveEnt = ent ?? null;
  if (!effectiveEnt) {
    return NextResponse.json({ ok: false, error: "Access denied: No subscription found" }, { status: 403 });
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
    console.error("[HISTORY SAVE] Record insert error, rolling back run:", recordError);
    // Manual rollback: delete the orphan run record
    await supabaseAdmin.from("ai_runs").delete().eq("id", runData.id);
    return NextResponse.json({ ok: false, error: recordError.message }, { status: 500 });
  }

  // --- Pruning Logic:    // 3. Prune old unpinned history (beyond 20)
  try {
    // Legacy rows might have NULL is_pinned, so we treat them as false
    const { data: unpinned } = await supabaseAdmin
      .from("ai_runs")
      .select("id")
      .eq("user_id", user.id)
      .eq("app_id", APP_ID)
      .or("is_pinned.eq.false,is_pinned.is.null")
      .order("created_at", { ascending: false });

    if (unpinned && unpinned.length > 20) {
      const idsToDelete = unpinned.slice(20).map(r => r.id);
      await supabaseAdmin
        .from("ai_runs")
        .delete()
        .in("id", idsToDelete);
    }
  } catch (pruneErr) {
    console.error("[HISTORY PRUNE] Failed to prune history:", pruneErr);
    // Non-blocking error
  }

  return NextResponse.json({ ok: true, run_id: runData.id });
}
