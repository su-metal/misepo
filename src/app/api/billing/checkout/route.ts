import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Plan = "monthly" | "yearly";
const PROMO_KEY = "intro_monthly_1000off";
const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  try {
    // ---- env guard
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("missing NEXT_PUBLIC_APP_URL");
    if (!process.env.STRIPE_PRICE_MONTHLY_ID) throw new Error("missing STRIPE_PRICE_MONTHLY_ID");
    if (!process.env.STRIPE_PRICE_YEARLY_ID) throw new Error("missing STRIPE_PRICE_YEARLY_ID");

    const TRIAL_DAYS = Number(process.env.STRIPE_TRIAL_DAYS ?? "7");
    if (!Number.isFinite(TRIAL_DAYS) || TRIAL_DAYS < 0 || TRIAL_DAYS > 365) {
      throw new Error("invalid STRIPE_TRIAL_DAYS");
    }


    // ---- request
    const body = await req.json().catch(() => ({}));
    const plan: Plan = body?.plan === "yearly" ? "yearly" : "monthly";

    // ---- auth
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(`auth.getUser error: ${error.message}`);
    if (!data.user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;
    const userEmail = data.user.email; // Get user email
    const appId = APP_ID;
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`;

    // ---- load entitlement (DB is source of truth)
    const entRes = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at,stripe_customer_id")
      .eq("app_id", appId)
      .eq("user_id", userId)
      .maybeSingle();

    if (entRes.error) throw new Error(entRes.error.message);

    let entitlement = entRes.data as
      | {
          plan?: string | null;
          status?: string | null;
          expires_at?: string | null;
          trial_ends_at?: string | null;
          stripe_customer_id?: string | null;
        }
      | null;

    // create baseline row if missing (keeps downstream logic simple)
    if (!entitlement) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("entitlements")
        .upsert(
          {
            user_id: userId,
            app_id: appId,
            plan: "free",
            status: "inactive",
            expires_at: null,
            trial_ends_at: null,
            billing_provider: "stripe",
            stripe_customer_id: null,
          },
          { onConflict: "user_id,app_id" }
        )
        .select("plan,status,expires_at,trial_ends_at,stripe_customer_id")
        .single();

      if (createErr) throw new Error(createErr.message);
      entitlement = created;
    }

    // if already active, don't create a new checkout
    const canUseApp = entitlement
      ? computeCanUseApp({
          status: entitlement.status ?? null,
          expires_at: entitlement.expires_at ?? null,
          trial_ends_at: entitlement.trial_ends_at ?? null,
        })
      : false;

    if (canUseApp) {
      return NextResponse.json({ ok: false, error: "already_active" }, { status: 400 });
    }

    // ---- pick price
    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY_ID!
        : process.env.STRIPE_PRICE_MONTHLY_ID!;

    // ---- ensure customer
    let customerId = entitlement?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail, // Set user email
        metadata: { user_id: userId, app_id: appId },
      });
      customerId = customer.id;

      const { error: saveErr } = await supabaseAdmin
        .from("entitlements")
        .upsert(
          {
            user_id: userId,
            app_id: appId,
            plan: entitlement?.plan ?? "free",
            status: entitlement?.status ?? "inactive",
            billing_provider: "stripe",
            stripe_customer_id: customerId,
          },
          { onConflict: "user_id,app_id" }
        );

      if (saveErr) throw new Error(saveErr.message);
    }

    // ---- discount removed as per request
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;

    // ---- 7-day trial (restricted to new users only)
    const TRIAL_PROMO_KEY = "trial_7days";
    let trialDaysToApply = 0;

    // Trial eligibility: user has never redeemed trial before
    // (removed plan check - now only checks redemption history)
    if (TRIAL_DAYS > 0) {
      const { data: trialRedemption, error: trialRedemptionErr } = await supabaseAdmin
        .from("promotion_redemptions")
        .select("id")
        .eq("app_id", appId)
        .eq("user_id", userId)
        .eq("promo_key", TRIAL_PROMO_KEY)
        .maybeSingle();

      if (trialRedemptionErr) throw new Error(trialRedemptionErr.message);

      if (!trialRedemption) {
        trialDaysToApply = TRIAL_DAYS;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      discounts,
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,

      // 推奨：支払い方法は最初に回収（payment_method_collection は指定しない）
      // payment_method_collection: "if_required", // ←カードなしトライアルにしたい時だけ

      subscription_data: {
        ...(trialDaysToApply > 0 ? { trial_period_days: trialDaysToApply } : {}),
        metadata: {
          user_id: userId,
          app_id: appId,
          plan,
          // promo_key removed
          trial_days: trialDaysToApply > 0 ? String(trialDaysToApply) : "0",
          trial_promo_key: TRIAL_PROMO_KEY,
        },
      },

      metadata: {
        user_id: userId,
        app_id: appId,
        plan,
        // promo_key removed
        trial_days: trialDaysToApply > 0 ? String(trialDaysToApply) : "0",
        trial_promo_key: TRIAL_PROMO_KEY,
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    console.error("checkout error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}
