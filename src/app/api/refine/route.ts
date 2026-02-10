// app/api/refine/route.ts
import { NextResponse } from "next/server";
import { refineContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";
import { getUserUsage } from "@/lib/billing/usage";
import Stripe from "stripe";

const APP_ID = env.APP_ID;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
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
          plan: "trial",
          status: "inactive",
          expires_at: null,
          trial_ends_at: null,
        },
        { onConflict: "user_id,app_id" }
      )
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
      .single();

    if (createErr) {
      return NextResponse.json(
        { ok: false, error: createErr.message },
        { status: 500 }
      );
    }

    effectiveEnt = created as any;
  }

  const canUseApp = computeCanUseApp(effectiveEnt);

  if (!canUseApp) {
    return NextResponse.json({ ok: false, error: "access_denied" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
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

  const currentContent = body.currentContent;
  if (typeof currentContent !== "string" || !currentContent.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing currentContent" },
      { status: 400 }
    );
  }

  const instruction = body.instruction;
  if (typeof instruction !== "string" || !instruction.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing instruction" },
      { status: 400 }
    );
  }

  console.debug("Refining content for user", user.id);

  // --- Usage Limit Check ---
  const { startOfMonth } = getJSTDateRange();
  
  // Plan-based limits
  const planName = effectiveEnt?.plan;
  const status = effectiveEnt?.status;
  const isPro = !!(planName === 'entry' || planName === 'standard' || planName === 'professional' || planName === 'monthly' || planName === 'yearly' || planName === 'pro');

  let usage = 0;
  let limit = 0;
  const cost = 1;

  if (isPro && (status === 'active' || status === 'trialing' || status === 'past_due')) {
      if (planName === 'entry') limit = 50;
      else if (planName === 'standard') limit = 150;
      else if (planName === 'professional' || planName === 'monthly' || planName === 'yearly' || planName === 'pro') limit = 300;

      let usageStartTime = startOfMonth;
      if (effectiveEnt.billing_reference_id && effectiveEnt.billing_reference_id.startsWith('sub_')) {
          try {
              const sub: any = await stripe.subscriptions.retrieve(effectiveEnt.billing_reference_id);
              const effectiveStart = sub.current_period_start ?? sub.billing_cycle_anchor ?? sub.start_date;
              if (effectiveStart) {
                  usageStartTime = new Date(effectiveStart * 1000).toISOString();
              }
          } catch (e) {
              console.error("[RefineAPI] Stripe subscription retrieval failed:", e);
          }
      }
      usage = await getUserUsage(user.id, APP_ID, 'monthly', usageStartTime);

      if (usage + cost > limit) {
          return NextResponse.json({ ok: false, error: "monthly_limit_reached" }, { status: 403 });
      }
  } else {
      limit = 5;
      let trialStartTime = null;
      if (effectiveEnt?.trial_ends_at) {
          // トライアル開始時刻（終了の7日前）を起点にする
          trialStartTime = new Date(new Date(effectiveEnt.trial_ends_at).getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
      }
      usage = await getUserUsage(user.id, APP_ID, 'daily', trialStartTime);
      
      if (usage + cost > limit) {
          return NextResponse.json({ ok: false, error: "daily_limit_reached" }, { status: 403 });
      }
  }

  // --- Record usage ---
  const { data: runData, error: runError } = await supabaseAdmin
    .from("ai_runs")
    .insert({
      app_id: APP_ID,
      user_id: user.id,
      run_type: "refine",
    })
    .select("id")
    .single();

  if (runError || !runData) {
    console.error("[REFINE] Failed to create run record:", runError);
    return NextResponse.json({ ok: false, error: "Failed to record generation" }, { status: 500 });
  }

  const savedRunId = runData.id;

  try {
    const result = await refineContent(profile, config, currentContent, instruction);
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    console.error("Refine error:", e);
    if (savedRunId) {
      await supabaseAdmin.from("ai_runs").delete().eq("id", savedRunId);
    }
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
