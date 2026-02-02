import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const APP_ID = env.APP_ID;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getJSTDateRange } from "@/lib/dateUtils";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const userId = userData.user.id;

  let { data: ent, error: readErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ ok: false, error: readErr.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  // entitlements が無い場合は新規作成
  if (!ent) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert({ app_id: APP_ID, user_id: userId, plan: "free", status: "inactive", expires_at: null, trial_ends_at: null }, { onConflict: "user_id,app_id" })
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();

    if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500, headers: NO_STORE_HEADERS });
    ent = created;
  }

  // --- SELF-HEALING: Check for Trial Expiration or Webhook Latency ---
  // If user has a customer ID but no sub info (or stale info), try to recover from Stripe.
  if (ent.stripe_customer_id && (!ent.billing_reference_id || (ent.status === 'inactive' || ent.status === 'trialing'))) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: ent.stripe_customer_id,
        status: 'all',
        limit: 1,
      });

      if (subs.data.length > 0) {
        const sub: any = subs.data[0];
        const subPlan = sub.metadata.plan || "entry"; // Fallback to entry if metadata missing
        
        if (sub.status !== ent.status || subPlan !== ent.plan) {
          console.log(`[api/me/plan] Healing subscription for ${userId}: ${ent.status} -> ${sub.status}, ${ent.plan} -> ${subPlan}`);
          
          const newExpiresAt = sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : 
                               sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : 
                               null;
          const newTrialEndsAt = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

          const { data: updated } = await supabaseAdmin
            .from("entitlements")
            .update({
              plan: subPlan,
              status: sub.status,
              expires_at: newExpiresAt,
              trial_ends_at: newTrialEndsAt,
              billing_reference_id: sub.id
            })
            .eq("user_id", userId)
            .eq("app_id", APP_ID)
            .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
            .single();
          
          if (updated) ent = updated;
        }
      }
    } catch (e) {
      console.error("[api/me/plan] Stripe healing failed:", e);
    }
  }
  
  const now = new Date();
  if (ent.status === 'trialing' && ent.trial_ends_at && new Date(ent.trial_ends_at) < now) {
    // Legacy healing by sub ID
    console.log(`[api/me/plan] Detected trial lag for user ${userId}. Fetching Stripe sub...`);
    if (ent.billing_reference_id) {
      try {
        const sub: any = await stripe.subscriptions.retrieve(ent.billing_reference_id);
        if (sub.status !== ent.status) {
          const newExpiresAt = sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : 
                               sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : 
                               null;
          const newTrialEndsAt = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;

          const { data: updated } = await supabaseAdmin
            .from("entitlements")
            .update({
              status: sub.status,
              expires_at: newExpiresAt,
              trial_ends_at: newTrialEndsAt
            })
            .eq("user_id", userId)
            .eq("app_id", APP_ID)
            .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
            .single();
          
          if (updated) ent = updated;
        }
      } catch (e) {
        console.error("[api/me/plan] Stripe sub fallback failed:", e);
      }
    }
  }

  // --- TRIAL ELIGIBILITY CHECK ---
  const { data: trialRedemption } = await supabaseAdmin
    .from("promotion_redemptions")
    .select("id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .eq("promo_key", "trial_7days")
    .maybeSingle();

  const isEligibleForTrial = !trialRedemption;

  // --- CARDLESS TRIAL INITIALIZATION ---
  let finalTrialEndsAt = ent.trial_ends_at;

  if (isEligibleForTrial && ent.plan === 'free') {
    // New user or user without trial. Initialize it to 7 days from now (JST)
    const jstOffset = 9 * 60 * 60 * 1000;
    const nowJST = new Date(Date.now() + jstOffset);
    const endsAtJST = new Date(nowJST.getTime() + (7 * 24 * 60 * 60 * 1000));
    finalTrialEndsAt = new Date(endsAtJST.getTime() - jstOffset).toISOString();

    // Mark trial as redeemed FIRST to prevent race condition
    await supabaseAdmin
      .from("promotion_redemptions")
      .insert({
        app_id: APP_ID,
        user_id: userId,
        promo_key: "trial_7days"
      });

    // Update to 'trial' plan and 'active' status
    const { data: updated } = await supabaseAdmin
      .from('entitlements')
      .update({ 
        plan: 'trial',
        status: 'active',
        trial_ends_at: finalTrialEndsAt 
      })
      .eq('app_id', APP_ID)
      .eq('user_id', userId)
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();
    
    if (updated) {
      ent = updated;
    }
    
    console.log(`[PlanAPI] Initialized cardless trial for ${userId}: ends at ${finalTrialEndsAt}`);
  }

  const nowMs = Date.now();
  const trialEndsMs = finalTrialEndsAt ? new Date(finalTrialEndsAt).getTime() : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;

  const isTrialWindow = trialEndsMs !== null && trialEndsMs > nowMs;
  const isPaidActive = ent.plan !== 'free' && ent.plan !== 'trial' && ent.status === 'active' && (expiresMs === null || expiresMs > nowMs);
  
  const canUseApp = isTrialWindow || isPaidActive;
  const isPro = isPaidActive; // Explicitly Pro if paid

  // --- Usage Stats Calculation ---
  let usage = 0;
  let limit = 0;
  let usage_period: 'daily' | 'monthly' = 'daily';

  // JST Calculation (Using shared utility)
  const { startOfToday, startOfMonth } = getJSTDateRange();

  // Define limits for each plan
  let monthlyLimit = 0;
  if (ent.plan === 'entry') monthlyLimit = 50;
  else if (ent.plan === 'standard') monthlyLimit = 150;
  else if (ent.plan === 'professional') monthlyLimit = 300;
  else if (ent.plan === 'monthly' || ent.plan === 'yearly' || ent.plan === 'pro') monthlyLimit = 300; // Legacy

  if (monthlyLimit > 0 && (ent.status === 'active' || ent.status === 'trialing' || ent.status === 'past_due')) {
    // Paid Plans: Monthly Limit
    limit = monthlyLimit;
    usage_period = 'monthly';
    const { data: usageData } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .gte("created_at", startOfMonth);
    
    if (usageData) {
        usage = usageData.reduce((acc, curr) => acc + (curr.run_type === 'multi-gen' ? 2 : 1), 0);
    }
  } else {
    // Free/Trial: Daily Limit (Changed from 10 to 5)
    limit = 5;
    usage_period = 'daily';
    const { data: usageData } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .gte("created_at", startOfToday);
    
    if (usageData) {
        usage = usageData.reduce((acc, curr) => acc + (curr.run_type === 'multi-gen' ? 2 : 1), 0);
    }
  }

  return NextResponse.json({
    ok: true,
    app_id: APP_ID,
    plan: ent.plan,
    status: ent.status,
    expires_at: ent.expires_at,
    trial_ends_at: finalTrialEndsAt,
    canUseApp,
    isPro: monthlyLimit > 0,
    eligibleForTrial: isEligibleForTrial,
    limit,
    usage,
    usage_period,
  }, { headers: NO_STORE_HEADERS });
}
