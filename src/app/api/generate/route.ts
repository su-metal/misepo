// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";

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

  let effectiveEnt: any = null;

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

    effectiveEnt = ent ?? null;
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

  const configs = (body.configs as GenerationConfig[]) || (body.config ? [body.config as GenerationConfig] : []);
  if (configs.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Missing generation config" },
      { status: 400 }
    );
  }

  // Cost calculation: 1 for single, 2 for simultaneous
  const cost = configs.length > 1 ? 2 : 1;
  const runType = configs.length > 1 ? "multi-gen" : "generation";

  // --- Usage Limit Check ---
  if (userId) {
    // Calculate JST Date (UTC+9) using shared utility
    const { startOfToday, startOfMonth } = getJSTDateRange();

    // Sum costs of runs for this user since today/month
    // Note: older runs without weighting are counted as 1 by default
    const { data: recentRuns, error: countErr } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type, created_at")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .in("run_type", ["generation", "multi-gen"])
      .gte("created_at", startOfMonth);

    if (countErr) {
        console.error("[LIMIT CHECK] Query error:", countErr);
    } else {
        const totalMonthCredits = recentRuns.reduce((sum, run) => sum + (run.run_type === 'multi-gen' ? 2 : 1), 0);
        const totalTodayCredits = recentRuns
            .filter(run => run.created_at >= startOfToday)
            .reduce((sum, run) => sum + (run.run_type === 'multi-gen' ? 2 : 1), 0);
        
        // Plan-based limits
        const planName = effectiveEnt?.plan;
        const status = effectiveEnt?.status;
        
        // Define monthly limits for each plan
        let monthlyLimit = 0;
        if (planName === 'entry') monthlyLimit = 50;
        else if (planName === 'standard') monthlyLimit = 150;
        else if (planName === 'professional') monthlyLimit = 300;
        else if (planName === 'monthly' || planName === 'yearly') monthlyLimit = 300; // Legacy plans
        
        // Free/Trial users: 5 per day
        const isFreeOrTrial = (planName === 'free' || status === 'trialing') && !monthlyLimit;
        
        if (isFreeOrTrial && totalTodayCredits + cost > 5) {
            return NextResponse.json({ ok: false, error: "daily_limit_reached", limit: 5, current: totalTodayCredits }, { status: 403 });
        }
        
        // Paid plan users: monthly limit
        if (monthlyLimit > 0 && (status === 'active' || status === 'trialing')) {
            if (totalMonthCredits + cost > monthlyLimit) {
                return NextResponse.json({ 
                    ok: false, 
                    error: "monthly_limit_reached", 
                    limit: monthlyLimit, 
                    current: totalMonthCredits 
                }, { status: 403 });
            }
        }
    }
  }

  let savedRunId: string | null = null;

  // Extract presetId from body (it's passed as part of generation context)
  const presetId = body.presetId as string | undefined;
  console.debug("[LEARNING] Request presetId:", presetId ?? "none");

  console.debug("Generating content for user", userId);

  try {
    // --- Batch Generation Execution ---
    const results = await Promise.all(configs.map(async (originalConfig) => {
      // Create an effective copy to avoid mutating the original (which is saved to history)
      const config = { ...originalConfig };

      // Resolve Platform-Specific learning samples for this config
      let learningSamples: string[] = [];
      if (userId && presetId) {
        const { data: learningData } = await supabase
          .from('learning_sources')
          .select('content')
          .eq('user_id', userId)
          .eq('preset_id', presetId)
          .in('platform', [config.platform, 'General'])
          .order('created_at', { ascending: false })
          .limit(10);

        if (learningData) {
          learningSamples = learningData.map((item: any) => item.content);
        }
      }

      const hasLearningSamples = learningSamples.length > 0;

      // FALLBACK LOGIC: 
      // If we have a presetId but NO learning samples for this specific platform config,
      // we treat it as "Omakase" (Default) mode for this platform.
      // This means we IGNORE the preset's system prompt and persona_yaml.
      // We ONLY keep the user's manual customPrompt.
      if (presetId && !hasLearningSamples) {
          console.log(`[LEARNING] Fallback to Omakase for ${config.platform} (No learning data)`);
          config.presetPrompt = undefined;
          config.persona_yaml = null;
          // config.customPrompt remains as is (User's manual instruction)
      } else {
          // Normal Case: Combine Preset Prompt + User Prompt
          if (config.presetPrompt) {
              if (config.customPrompt) {
                  config.customPrompt = `${config.presetPrompt}\n\n---\n\n【今回の追加指示】\n${config.customPrompt}`;
              } else {
                  config.customPrompt = config.presetPrompt;
              }
          }
      }

      // Apply persona_yaml (Only if not fell back)
      if (userId && presetId && config.persona_yaml !== null) { // Check null explicit
        const { data: presetData } = await supabase
          .from("user_presets")
          .select("persona_yaml")
          .eq("id", presetId)
          .eq("user_id", userId)
          .single();
        if (presetData?.persona_yaml) {
          config.persona_yaml = presetData.persona_yaml;
        }
      }

      const generatedResult = await generateContent(profile, config, true, learningSamples);
      
      // CRITICAL: Add platform information to each result for history reconstruction
      return {
        ...generatedResult,
        platform: config.platform, // Explicitly add platform to ensure it's preserved in history
      };
    }));

    // --- History & Counter Update ---
    if (userId && body.save_history !== false) {
      const { data: runData, error: runError } = await supabaseAdmin
        .from("ai_runs")
        .insert({
          app_id: APP_ID,
          user_id: userId,
          run_type: runType, // 'generation' or 'multi-gen'
        })
        .select("id")
        .single();

      if (!runError && runData) {
        savedRunId = runData.id;
        // Batch record save - save results array directly (not nested)
        // This ensures consistency with history fetch logic
        const { error: recordError } = await supabaseAdmin
          .from("ai_run_records")
          .insert({
            run_id: runData.id,
            app_id: APP_ID,
            user_id: userId,
            input: { profile, configs },
            output: results, // Save results array directly with platform info
          });

        if (recordError) {
          console.error("[GENERATE] Record insert error, rolling back run:", recordError);
          // Manual rollback
          await supabaseAdmin.from("ai_runs").delete().eq("id", runData.id);
          savedRunId = null;
          // We continue to return the results to user even if history save failed, 
          // but we log it. Or we could throw error. Returning results is more UX friendly.
        }
      }
    }

    return NextResponse.json({
      ok: true,
      results,
      run_id: savedRunId,
    });
  } catch (e: any) {
    console.error("Generation error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
