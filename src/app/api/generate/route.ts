// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";
import { getUserUsage } from "@/lib/billing/usage";

const APP_ID = env.APP_ID;

export const maxDuration = 60; // 60 seconds (requires Pro plan on Vercel)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("[GENERATE API] Auth error:", authError);
    return NextResponse.json({ ok: false, error: "Authentication failed" }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  let effectiveEnt: any = null;

  if (userId) {
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
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
      // 3. TRIAL ELIGIBILITY CHECK
      const { data: trialRedemption } = await supabaseAdmin
        .from("promotion_redemptions")
        .select("id")
        .eq("app_id", APP_ID)
        .eq("user_id", userId)
        .eq("promo_key", "trial_7days")
        .maybeSingle();

      const isEligibleForTrial = !trialRedemption;

      if (isEligibleForTrial) {
        const jstOffset = 9 * 60 * 60 * 1000;
        const nowJST = new Date(Date.now() + jstOffset);
        const endsAtJST = new Date(nowJST.getTime() + (7 * 24 * 60 * 60 * 1000));
        const finalTrialEndsAt = new Date(endsAtJST.getTime() - jstOffset).toISOString();

        // Mark trial as redeemed
        await supabaseAdmin
          .from("promotion_redemptions")
          .insert({
            app_id: APP_ID,
            user_id: userId,
            promo_key: "trial_7days"
          });

        const { data: created, error: createErr } = await supabaseAdmin
          .from("entitlements")
          .upsert({ 
            app_id: APP_ID, 
            user_id: userId, 
            plan: "trial", 
            status: "active", 
            expires_at: null, 
            trial_ends_at: finalTrialEndsAt 
          }, { onConflict: "user_id,app_id" })
          .select("plan,status,expires_at,trial_ends_at")
          .single();

        if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
        effectiveEnt = created;
        console.log(`[GenerateAPI] Auto-initialized trial for new user ${userId}`);
      } else {
        // Not eligible for trial and no entitlement: fallback to inactive trial
        const { data: created, error: createErr } = await supabaseAdmin
          .from("entitlements")
          .upsert(
            {
              app_id: APP_ID,
              user_id: userId,
              plan: "trial",
              status: "inactive",
              expires_at: null,
              trial_ends_at: null,
            },
            { onConflict: "user_id,app_id" }
          )
          .select("plan,status,expires_at,trial_ends_at")
          .single();

        if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
        effectiveEnt = created;
      }
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
    // Plan-based limits
    const planName = effectiveEnt?.plan;
    const status = effectiveEnt?.status;
    const isPro = !!(planName === 'entry' || planName === 'standard' || planName === 'professional' || planName === 'monthly' || planName === 'yearly' || planName === 'pro');

    let usage = 0;
    let limit = 0;

    if (isPro && (status === 'active' || status === 'trialing' || status === 'past_due')) {
        // Paid plans: Monthly limit with Stripe-aligned start date
        if (planName === 'entry') limit = 50;
        else if (planName === 'standard') limit = 150;
        else if (planName === 'professional' || planName === 'monthly' || planName === 'yearly' || planName === 'pro') limit = 300;

        const { startOfMonth } = getJSTDateRange();
        let usageStartTime = startOfMonth;
        if (effectiveEnt.billing_reference_id && effectiveEnt.billing_reference_id.startsWith('sub_')) {
            try {
                const Stripe = require("stripe");
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
                const sub: any = await stripe.subscriptions.retrieve(effectiveEnt.billing_reference_id);
                const effectiveStart = sub.current_period_start ?? sub.billing_cycle_anchor ?? sub.start_date;
                if (effectiveStart) {
                    usageStartTime = new Date(effectiveStart * 1000).toISOString();
                }
            } catch (e) {
                console.error("[GenerateAPI] Stripe subscription retrieval failed:", e);
            }
        }
        usage = await getUserUsage(userId, APP_ID, 'monthly', usageStartTime);

        if (usage + cost > limit) {
            return NextResponse.json({ 
                ok: false, 
                error: "monthly_limit_reached", 
                limit, 
                current: usage 
            }, { status: 403 });
        }
    } else {
        // Trial/Free users: 5 per day
        limit = 5;
        let trialStartTime = null;
        if (effectiveEnt?.trial_ends_at) {
            // トライアル開始時刻（終了の7日前）を起点にする
            trialStartTime = new Date(new Date(effectiveEnt.trial_ends_at).getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
        }
        usage = await getUserUsage(userId, APP_ID, 'daily', trialStartTime);

        if (usage + cost > limit) {
            return NextResponse.json({ ok: false, error: "daily_limit_reached", limit, current: usage }, { status: 403 });
        }
    }

    // --- Record usage (Capture cost before potentially long generation) ---
    const { data: runData, error: runError } = await supabaseAdmin
      .from("ai_runs")
      .insert({
        app_id: APP_ID,
        user_id: userId,
        run_type: runType, // 'generation' or 'multi-gen'
      })
      .select("id")
      .single();

    if (runError || !runData) {
      console.error("[GENERATE] Failed to create run record:", runError);
      return NextResponse.json({ ok: false, error: "Failed to record generation" }, { status: 500 });
    }

    const savedRunId = runData.id;

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
        if (presetId && !hasLearningSamples) {
            console.log(`[LEARNING] Fallback to Omakase for ${config.platform} (No learning data)`);
            config.presetPrompt = undefined;
            config.persona_yaml = null;
        } else {
            if (config.presetPrompt) {
                if (config.customPrompt) {
                    config.customPrompt = `${config.presetPrompt}\n\n---\n\n【今回の追加指示】\n${config.customPrompt}`;
                } else {
                    config.customPrompt = config.presetPrompt;
                }
            }
        }

        // Apply persona_yaml
        if (userId && presetId && config.persona_yaml !== null) {
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
        
        return {
          ...generatedResult,
          platform: config.platform,
        };
      }));

      // --- Save Output History ---
      const { error: recordError } = await supabaseAdmin
        .from("ai_run_records")
        .insert({
          run_id: savedRunId,
          app_id: APP_ID,
          user_id: userId,
          input: { profile, configs },
          output: results,
        });

      if (recordError) {
        console.error("[GENERATE] Record insert error, rolling back run:", recordError);
        await supabaseAdmin.from("ai_runs").delete().eq("id", savedRunId);
        return NextResponse.json({ ok: false, error: "Failed to save generation history" }, { status: 500 });
      }

      return NextResponse.json({
        ok: true,
        results,
        run_id: savedRunId,
      });
    } catch (e: any) {
      console.error("Generation error:", e);
      // ROLLBACK: Cleanup the run record if actual AI generation failed
      if (savedRunId) {
        await supabaseAdmin.from("ai_runs").delete().eq("id", savedRunId);
      }
      return NextResponse.json(
        { ok: false, error: e.message || "Internal Server Error" },
        { status: 500 }
      );
    }

  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}
