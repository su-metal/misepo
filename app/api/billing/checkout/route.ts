import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Plan = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    // env
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("missing NEXT_PUBLIC_APP_URL");
    if (!process.env.APP_ID) throw new Error("missing APP_ID");
    if (!process.env.STRIPE_PRICE_MONTHLY_ID) throw new Error("missing STRIPE_PRICE_MONTHLY_ID");
    if (!process.env.STRIPE_PRICE_YEARLY_ID) throw new Error("missing STRIPE_PRICE_YEARLY_ID");
    if (!process.env.STRIPE_COUPON_FIRST_MONTH_1000OFF)
      throw new Error("missing STRIPE_COUPON_FIRST_MONTH_1000OFF");

    // plan（未指定なら monthly）
    const body = await req.json().catch(() => ({}));
    const plan: Plan = body?.plan === "yearly" ? "yearly" : "monthly";

    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(`auth.getUser error: ${error.message}`);
    if (!data.user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;
    const appId = process.env.APP_ID!;
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`;

    const priceId =
      plan === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY_ID!
        : process.env.STRIPE_PRICE_MONTHLY_ID!;

    // ✅ 初月980円（1980-1000）にする：月額だけクーポンを付ける
    const discounts =
      plan === "monthly"
        ? [{ coupon: process.env.STRIPE_COUPON_FIRST_MONTH_1000OFF! }]
        : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      discounts,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,

      subscription_data: {
        metadata: {
          user_id: userId,
          app_id: appId,
          plan_selected: plan, // デバッグ用（任意）
        },
      },
      metadata: {
        user_id: userId,
        app_id: appId,
        plan_selected: plan, // デバッグ用（任意）
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e: any) {
    console.error("checkout error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unknown error" }, { status: 500 });
  }
}
