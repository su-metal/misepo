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
import { getPlanFromPriceId } from "@/lib/billing/plans";
import { getUserUsage } from "@/lib/billing/usage";

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

  // --- デモモード時のクレジット制限バイパス ---
  const isDemoMode = cookieStore.get("demo-mode")?.value === "true";
  if (isDemoMode) {
    console.info(`[PlanAPI] Demo mode detected for user ${userId}. Granting infinite credits.`);
    return NextResponse.json({
      ok: true,
      app_id: APP_ID,
      plan: "pro",
      status: "active",
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      trial_ends_at: null,
      canUseApp: true,
      isPro: true,
      eligibleForTrial: false,
      limit: 1000,
      usage: 0,
      usage_period: 'monthly',
    }, { headers: NO_STORE_HEADERS });
  }

  // 1. Ensure Profile & App exist (Foreign Key safety)
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

  // Auto-register APP_ID if missing
    const { data: appData } = await supabaseAdmin
      .from("apps")
      .select("app_id")
      .eq("app_id", APP_ID)
      .maybeSingle();

    if (!appData) {
      const APP_NAME = process.env.APP_NAME || (APP_ID === 'misepo' ? 'MisePo' : 'MisePo Dev');
      const { error: appErr } = await supabaseAdmin
        .from("apps")
        .insert({ app_id: APP_ID, name: APP_NAME });
      
      if (appErr) {
        console.error(`[PlanAPI] Failed to auto-create app ${APP_ID}:`, appErr);
      }
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

  // 4. Auto-initialize Trial for all users (active if eligible, inactive otherwise)
  if (!ent) {
    const trialDurationDays = 7;
    const finalTrialEndsAt = new Date(Date.now() + trialDurationDays * 24 * 60 * 60 * 1000).toISOString();

    if (isEligibleForTrial) {
      // Mark trial as redeemed
      await supabaseAdmin
        .from("promotion_redemptions")
        .insert({
          app_id: APP_ID,
          user_id: userId,
          promo_key: "trial_7days"
        });
    }

    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert({ 
        app_id: APP_ID, 
        user_id: userId, 
        plan: "trial", 
        status: isEligibleForTrial ? "active" : "inactive", 
        expires_at: null, 
        trial_ends_at: isEligibleForTrial ? finalTrialEndsAt : "2024-01-01T00:00:00Z" 
      }, { onConflict: "user_id,app_id" })
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();

    if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500, headers: NO_STORE_HEADERS });
    ent = created;
    console.info(`[PlanAPI] Auto-initialized trial for user ${userId} (eligible: ${isEligibleForTrial})`);
  }

  // --- SELF-HEALING: Convert 'free' plan users to trial if eligible (Legacy cleanup) ---
  if (ent.plan === 'free') {
    console.info(`[PlanAPI] Healing 'free' user ${userId} to trial`);
    const trialDurationDays = 7;
    const finalTrialEndsAt = isEligibleForTrial 
      ? new Date(Date.now() + trialDurationDays * 24 * 60 * 60 * 1000).toISOString()
      : "2024-01-01T00:00:00Z";

    if (isEligibleForTrial) {
      await supabaseAdmin
        .from("promotion_redemptions")
        .upsert({
          app_id: APP_ID,
          user_id: userId,
          promo_key: "trial_7days"
        }, { onConflict: "app_id,user_id,promo_key" });
    }

    const { data: healed } = await supabaseAdmin
      .from("entitlements")
      .update({ 
        plan: "trial", 
        status: isEligibleForTrial ? "active" : "inactive", 
        expires_at: null, 
        trial_ends_at: finalTrialEndsAt 
      })
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();
    
    if (healed) ent = healed;
  }

  // --- SELF-HEALING: Populate missing trial_ends_at for existing trial users ---
  if (ent.plan === 'trial' && !ent.trial_ends_at) {
    console.info(`[PlanAPI] Healing missing trial_ends_at for user ${userId}`);
    let finalTrialEndsAt = "2024-01-01T00:00:00Z"; // 実質的な期限切れとして扱う過去の日付
    
    if (isEligibleForTrial) {
      finalTrialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      // Mark trial as redeemed
      await supabaseAdmin
        .from("promotion_redemptions")
        .upsert({
          app_id: APP_ID,
          user_id: userId,
          promo_key: "trial_7days"
        }, { onConflict: "app_id,user_id,promo_key" });
    }

    const { data: updated } = await supabaseAdmin
      .from("entitlements")
      .update({ trial_ends_at: finalTrialEndsAt })
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
      .single();
    
    if (updated) ent = updated;
  }

  // --- SELF-HEALING: Check for Stripe ---
  let stripeCustomerId = ent.stripe_customer_id;
  
  if (stripeCustomerId) {
    try {
      const subs = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'all',
        limit: 1,
      });

      if (subs.data.length > 0) {
        const sub: any = subs.data[0];
        const priceId = sub.items.data[0]?.price?.id;
        const subPlanFromPrice = getPlanFromPriceId(priceId);
        
        // ✅ 修正: Stripe側のメタデータを確認し、現在の APP_ID と一致する場合のみ同期する
        // これがないと、同じメールアドレスの別環境（本番/開発）のデータが混ざってしまいます。
        const stripeAppId = sub.metadata?.app_id;
        if (stripeAppId && stripeAppId !== APP_ID) {
           console.info(`[PlanAPI] Ignoring Stripe sub ${sub.id} because app_id mismatch: Stripe(${stripeAppId}) vs Current(${APP_ID})`);
           // 別のアプリのサブスクなので、ここでは何もしない（同期しない）
        } else if (!ent.billing_reference_id || sub.status !== ent.status || (subPlanFromPrice && subPlanFromPrice !== ent.plan)) {
          console.info(`[PlanAPI] Healing triggered: DB(${ent.plan}/${ent.status}) -> Stripe(${subPlanFromPrice}/${sub.status})`);
          const subPlan = subPlanFromPrice || sub.metadata.plan || "entry";
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
      } else {
          // 有料プラン設定なのにStripeにサブスクがない場合、trialに引き戻す
          // ※ 本番と開発で APP_ID を分けていれば、ここでモード違いによる誤作動は起きません
          console.info(`[PlanAPI] Resetting user ${userId} to trial (No Stripe sub found but DB says ${ent.plan})`);
          
          let newTrialEndsAt = ent.trial_ends_at;
          if (!newTrialEndsAt) {
            if (isEligibleForTrial) {
              newTrialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
              
              // Mark trial as redeemed
              await supabaseAdmin
                .from("promotion_redemptions")
                .upsert({
                  app_id: APP_ID,
                  user_id: userId,
                  promo_key: "trial_7days"
                }, { onConflict: "app_id,user_id,promo_key" });
            } else {
              newTrialEndsAt = "2024-01-01T00:00:00Z";
            }
          }

          const { data: reverted } = await supabaseAdmin
            .from("entitlements")
            .update({
              plan: 'trial',
              status: 'active',
              expires_at: null,
              trial_ends_at: newTrialEndsAt,
              billing_reference_id: null
            })
            .eq("user_id", userId)
            .eq("app_id", APP_ID)
            .select("plan,status,expires_at,trial_ends_at,billing_reference_id,stripe_customer_id")
            .single();
          
          if (reverted) ent = reverted;
      }
    } catch (e: any) {
      if (e.code === 'resource_missing' || e.status === 404 || e.message?.includes("No such customer")) {
        console.info(`[PlanAPI] Customer ${ent.stripe_customer_id} not found in Stripe. Purging from DB...`);
        await supabaseAdmin
          .from("entitlements")
          .update({ stripe_customer_id: null, billing_reference_id: null })
          .eq("user_id", userId)
          .eq("app_id", APP_ID);
        ent.stripe_customer_id = null;
        ent.billing_reference_id = null;
      } else {
        console.error("[PlanAPI] Stripe healing failed:", e);
      }
    }
  }


  const nowMs = Date.now();
  const trialEndsMs = ent.trial_ends_at ? new Date(ent.trial_ends_at).getTime() : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;

  const isTrialActive = ent.plan === 'trial' && ent.status === 'active' && (trialEndsMs === null || trialEndsMs > nowMs);
  const isPaidActive = ent.plan !== 'trial' && (ent.status === 'active' || ent.status === 'trialing') && (expiresMs === null || expiresMs > nowMs);
  
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

    // ✅ プラン開始日（Stripeの現在の期間開始日 または 契約作成日 の新しい方）を基準にする
    // これにより、アップグレード直後のクレジットを「満タン」にする（過去のトライアル使用分をカウントしない）
    let usageStartTime = startOfMonth;

    if (ent.billing_reference_id && ent.billing_reference_id.startsWith('sub_')) {
      try {
        const sub: any = await stripe.subscriptions.retrieve(ent.billing_reference_id);
        const effectiveStart = Math.max(
          sub.current_period_start || 0, 
          sub.start_date || 0, 
          sub.created || 0
        );
        
        if (effectiveStart) {
          usageStartTime = new Date(effectiveStart * 1000).toISOString();
        }
      } catch (e) {
        console.error("[PlanAPI] Stripe subscription retrieval failed:", e);
      }
    }

    usage = await getUserUsage(userId, APP_ID, 'monthly', usageStartTime);
  } else {
    limit = 5;
    usage_period = 'daily';
    let trialStartTime = null;
    if (ent.trial_ends_at) {
      trialStartTime = new Date(new Date(ent.trial_ends_at).getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
    }
    usage = await getUserUsage(userId, APP_ID, 'daily', trialStartTime);
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
