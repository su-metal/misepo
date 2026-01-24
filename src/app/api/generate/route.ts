// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";

const APP_ID = env.APP_ID;

export const maxDuration = 60; // 60 seconds (requires Pro plan on Vercel)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const userId = user?.id ?? null;
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (userId) {
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) {
      return NextResponse.json(
        { ok: false, error: entErr.message },
        { status: 500 }
      );
    }

    let effectiveEnt = ent ?? null;
    if (!effectiveEnt) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("entitlements")
        .upsert(
          {
            app_id: APP_ID,
            user_id: userId,
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
      return NextResponse.json(
        { ok: false, error: "access_denied" },
        { status: 403 }
      );
    }
  }

  const profile = body.profile as StoreProfile | undefined;
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Missing profile" },
      { status: 400 }
    );
  }
  if (typeof profile.industry !== "string" || !profile.industry.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing profile.industry" },
      { status: 400 }
    );
  }

  const config = body.config as GenerationConfig | undefined;
  if (!config) {
    return NextResponse.json(
      { ok: false, error: "Missing generation config" },
      { status: 400 }
    );
  }

  let savedRunId: string | null = null;

  // Extract presetId from body (it's passed as part of generation context)
  const presetId = body.presetId as string | undefined;
  console.debug("[LEARNING] Request presetId:", presetId ?? "none");

  console.debug("Generating content for user", userId);

  try {
    const isPro = true; // Auth already checked above
    
    // Fetch learning sources (favorites) - Filter by presetId
    let learningSamples: string[] = [];
    if (userId) {
      const { data: presetRows, error: presetErr } = await supabase
        .from("learning_sources")
        .select("preset_id")
        .eq("user_id", userId);

      if (presetErr) {
        console.warn("[LEARNING] Failed to fetch preset summary:", presetErr.message);
      } else if (presetRows) {
        const counts = presetRows.reduce<Record<string, number>>((acc, row: any) => {
          const key = row.preset_id || "null";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        console.debug("[LEARNING] Preset sample counts:", counts);
      }
    }
    if (userId && presetId) {
      const { data: learningData } = await supabase
        .from('learning_sources')
        .select('content')
        .eq('user_id', userId)
        .eq('preset_id', presetId)
        .eq('platform', config.platform)
        .order('created_at', { ascending: false })
        .limit(50);

      if (learningData && learningData.length > 0) {
        learningSamples = learningData.map((item: any) => item.content);
        console.log(`[LEARNING] Fetched ${learningSamples.length} favorited samples for preset ${presetId}`);
      } else {
        console.warn(`[LEARNING] No samples found for preset ${presetId}`);
      }
    } else {
      console.warn("[LEARNING] Skipped fetch (missing userId or presetId)");
    }

    const generatedData = await generateContent(profile, config, isPro, learningSamples);

    if (userId) {
      const runType =
        typeof body.run_type === "string" && body.run_type.trim()
          ? body.run_type
          : "generation";

      const inputPayload = { profile, config };
      const shouldSaveHistory = body.save_history !== false;

      if (shouldSaveHistory) {
        // Step 1: Create ai_runs record first (required for foreign key)
        const { data: runData, error: runError } = await supabaseAdmin
          .from("ai_runs")
          .insert({
            app_id: APP_ID,
            user_id: userId,
            run_type: runType,
          })
          .select("id")
          .single();

        if (runError) {
          console.error("[HISTORY SAVE] Failed to create ai_runs:", runError);
        } else if (runData) {
          // Step 2: Create ai_run_records with the run_id (include all columns)
          const { error: recordError } = await supabaseAdmin
            .from("ai_run_records")
            .insert({
              run_id: runData.id,
              app_id: APP_ID,
              user_id: userId,
              input: inputPayload,
              output: generatedData, // Save full object { analysis, posts }
            });

          if (!recordError) {
            savedRunId = runData.id;
            console.log("[HISTORY SAVE] Success:", { savedRunId });
          } else {
            console.error("[HISTORY SAVE] Failed to save record:", recordError);
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      result: generatedData.posts, // Keep result as array for frontend compatibility
      analysis: generatedData.analysis, // Return analysis as separate field
      run_id: savedRunId,
    });
  } catch (e: any) {
    console.error("Generation error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
