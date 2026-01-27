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
    .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
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
      .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
      .single();

    if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500, headers: NO_STORE_HEADERS });
    ent = created;
  }

  // --- SELF-HEALING: Check for Trial Expiration Lag ---
  // If DB says 'trialing' but the date is past, Stripe might have transitioned or webhook missed.
  const now = new Date();
  if (ent.status === 'trialing' && ent.trial_ends_at && new Date(ent.trial_ends_at) < now) {
    console.log(`[api/me/plan] Detected trial lag for user ${userId}. Fetching Stripe...`);
    if (ent.billing_reference_id) {
      try {
        const sub: any = await stripe.subscriptions.retrieve(ent.billing_reference_id);
        if (sub.status !== ent.status) {
          console.log(`[api/me/plan] Self-healing status: ${ent.status} -> ${sub.status}`);
          
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
            .select("plan,status,expires_at,trial_ends_at,billing_reference_id")
            .single();
          
          if (updated) ent = updated;
        }
      } catch (e) {
        console.error("[api/me/plan] Stripe fallback failed:", e);
      }
    }
  }

  const nowMs = Date.now();
  const trialEndsMs = ent.trial_ends_at ? new Date(ent.trial_ends_at).getTime() : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;

  const isTrial = trialEndsMs !== null && trialEndsMs > nowMs;
  const isPaidActive = ent.status === "active" && (expiresMs === null || expiresMs > nowMs);
  const canUseApp = isTrial || isPaidActive;
  const isPro = canUseApp;

  const { data: trialRedemption } = await supabaseAdmin
    .from("promotion_redemptions")
    .select("id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .eq("promo_key", "trial_7days")
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    app_id: APP_ID,
    plan: ent.plan,
    status: ent.status,
    expires_at: ent.expires_at,
    trial_ends_at: ent.trial_ends_at,
    canUseApp,
    isPro,
    eligibleForTrial: !trialRedemption,
  }, { headers: NO_STORE_HEADERS });
}
