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
    if (!process.env.STRIPE_SECRET_KEY)
      throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_APP_URL)
      throw new Error("missing NEXT_PUBLIC_APP_URL");
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

    // ✅ ここが唯一の正：サーバ側でSupabase Authからユーザーを取得
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(`auth.getUser error: ${error.message}`);
    if (!data.user) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const userId = data.user.id;
    const userEmail = data.user.email ?? null; // ✅ 追加
    const appId = APP_ID;

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`;

    // entitlements は app_id + user_id で必ず絞る（取り違え防止）
    const entRes = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,stripe_customer_id")
      .eq("app_id", appId)
      .eq("user_id", userId)
      .maybeSingle();

    if (entRes.error) throw new Error(entRes.error.message);
    const entitlement = entRes.data as {
      plan?: string | null;
      status?: string | null;
      stripe_customer_id?: string | null;
    } | null;

    // 既にProなら弾く
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

    /**
     * ✅ ここが今回の本修正ポイント
     *
     * - 「新規ユーザー」で stripe_customer_id が無いときに
     *   先に Stripe Customer を作って保存するのはOK。
     *
     * - ただし customer_email を渡す分岐が必要（Link/メール取り違え防止）
     * - customerId が無いのに customer_email も無いケースは弾く
     */
    let customerId = entitlement?.stripe_customer_id ?? null;

    if (!customerId) {
      if (!userEmail) {
        return NextResponse.json(
          { ok: false, error: "missing_user_email" },
          { status: 400 }
        );
      }

      // ✅ 顧客を作る時点で email を固定（Stripe側の顧客に正しいメールを持たせる）
      const customer = await stripe.customers.create({
        email: userEmail,
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

    const base: Stripe.Checkout.SessionCreateParams = {
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
    };

    /**
     * ✅ 重要：customerId がある時は customer を渡す。
     * これにより Checkout 画面のメールが他ユーザーに引っ張られない。
     *
     * （customerId は app_id + user_id で取得したもの or 今作ったもの）
     */
    const session = await stripe.checkout.sessions.create({
      ...base,
      customer: customerId,
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
