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
      auth: {
        storageKey: "misepo-auth-token",
      },
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

  // 1. Ensure Profile exists (Foreign Key safety)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  
  if (!profile) {
    await supabaseAdmin
      .from("profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  }

  // 2. Load Entitlement
  let { data: ent, error: readErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ ok: false, error: readErr.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  // 3. TRIAL ELIGIBILITY CHECK
  const { data: trialRedemption } = await supabaseAdmin
    .from("promotion_redemptions")
    .select("id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .eq("promo_key", "trial_7days")
    .maybeSingle();

  const isEligibleForTrial = !trialRedemption;

  // 4. Auto-initialize Trial for new users (instead of returning 404 or creating 'free')
  if (!ent && isEligibleForTrial) {
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
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();

    if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500, headers: NO_STORE_HEADERS });
    ent = created;
    console.log(`[PlanAPI] Auto-initialized trial for new user ${userId}`);
  }

  // If still no entitlement (not eligible for trial and no record exists)
  if (!ent) {
    return NextResponse.json({ ok: false, error: "no_plan_selected" }, { status: 404, headers: NO_STORE_HEADERS });
  }

  // --- SELF-HEALING: Check for Stripe ---
  if (ent.stripe_customer_id && (!ent.billing_reference_id || (ent.status === 'inactive' || ent.status === 'trialing'))) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: ent.stripe_customer_id,
        status: 'all',
        limit: 1,
      });

      if (subs.data.length > 0) {
        const sub: any = subs.data[0];
        const subPlan = sub.metadata.plan || "entry";
        
        if (sub.status !== ent.status || subPlan !== ent.plan) {
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
      console.error("[PlanAPI] Stripe healing failed:", e);
    }
  }

  const nowMs = Date.now();
  const trialEndsMs = ent.trial_ends_at ? new Date(ent.trial_ends_at).getTime() : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;

  const isTrialActive = ent.plan === 'trial' && ent.status === 'active' && (trialEndsMs === null || trialEndsMs > nowMs);
  const isPaidActive = ent.plan !== 'free' && ent.plan !== 'trial' && (ent.status === 'active' || ent.status === 'trialing') && (expiresMs === null || expiresMs > nowMs);
  
  const canUseApp = isTrialActive || isPaidActive;

  // --- Usage Stats ---
  let usage = 0;
  let limit = 0;
  let usage_period: 'daily' | 'monthly' = 'daily';
  const { startOfToday, startOfMonth } = getJSTDateRange();

  let monthlyLimit = 0;
  if (ent.plan === 'entry') monthlyLimit = 50;
  else if (ent.plan === 'standard') monthlyLimit = 150;
  else if (ent.plan === 'professional') monthlyLimit = 300;

  if (monthlyLimit > 0 && (ent.status === 'active' || ent.status === 'trialing' || ent.status === 'past_due')) {
    limit = monthlyLimit;
    usage_period = 'monthly';
    const { data: usageData } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .gte("created_at", startOfMonth);
    if (usageData) usage = usageData.reduce((acc, curr) => acc + (curr.run_type === 'multi-gen' ? 2 : 1), 0);
  } else {
    limit = 5;
    usage_period = 'daily';
    const { data: usageData } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .gte("created_at", startOfToday);
    if (usageData) usage = usageData.reduce((acc, curr) => acc + (curr.run_type === 'multi-gen' ? 2 : 1), 0);
  }

  return NextResponse.json({
    ok: true,
    app_id: APP_ID,
    plan: ent.plan,
    status: ent.status,
    expires_at: ent.expires_at,
    trial_ends_at: ent.trial_ends_at,
    canUseApp,
    isPro: monthlyLimit > 0,
    eligibleForTrial: isEligibleForTrial,
    limit,
    usage,
    usage_period,
  }, { headers: NO_STORE_HEADERS });
}
