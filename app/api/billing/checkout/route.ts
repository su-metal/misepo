import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Plan = "monthly" | "yearly";
const PROMO_KEY = "intro_monthly_1000off";
const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("missing NEXT_PUBLIC_APP_URL");
    if (!process.env.STRIPE_PRICE_MONTHLY_ID)
      throw new Error("missing STRIPE_PRICE_MONTHLY_ID");
    if (!process.env.STRIPE_PRICE_YEARLY_ID)
      throw new Error("missing STRIPE_PRICE_YEARLY_ID");

    const couponStarter =
      process.env.STRIPE_COUPON_STARTER_MONTHLY ??
      process.env.STRIPE_COUPON_FIRST_MONTH_1000OFF ??
      null;

    const body = await req.json().catch(() => ({}));
    const plan: Plan = body?.plan === "yearly" ? "yearly" : "monthly";

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(`auth.getUser error: ${error.message}`);
    if (!data.user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;
    const appId = APP_ID;
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`;

    const entRes = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,stripe_customer_id")
      .eq("app_id", appId)
      .eq("user_id", userId)
      .maybeSingle();

    if (entRes.error) throw new Error(entRes.error.message);
    const entitlement = entRes.data as
      | { plan?: string | null; status?: string | null; stripe_customer_id?: string | null }
      | null;

    if (entitlement?.plan === "pro" && entitlement?.status === "active") {
      return NextResponse.json(
        { ok: false, error: "already_active" },
        { status: 400 }
      );
    }

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY_ID!
        : process.env.STRIPE_PRICE_MONTHLY_ID!;

    let customerId = entitlement?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({
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
            status: entitlement?.status ?? "active",
            billing_provider: "stripe",
            stripe_customer_id: customerId,
          },
          { onConflict: "user_id,app_id" }
        );

      if (saveErr) throw new Error(saveErr.message);
    }

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    let promoKey: string | null = null;
    if (plan === "monthly" && couponStarter) {
      const { data: redemption, error: redemptionErr } = await supabaseAdmin
        .from("promotion_redemptions")
        .select("id")
        .eq("app_id", appId)
        .eq("user_id", userId)
        .eq("promo_key", PROMO_KEY)
        .maybeSingle();
      if (redemptionErr) throw new Error(redemptionErr.message);
      if (!redemption) {
        discounts = [{ coupon: couponStarter }];
        promoKey = PROMO_KEY;
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
      subscription_data: {
        metadata: {
          user_id: userId,
          app_id: appId,
          plan,
          promo_key: promoKey,
        },
      },
      metadata: {
        user_id: userId,
        app_id: appId,
        plan,
        promo_key: promoKey,
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    console.error("checkout error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
