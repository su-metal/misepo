import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    // 環境変数チェック（ここで落ちがち）
    if (!process.env.STRIPE_SECRET_KEY)
      throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.STRIPE_PRICE_PRO_MONTHLY)
      throw new Error("missing STRIPE_PRICE_PRO_MONTHLY");
    if (!process.env.APP_URL) throw new Error("missing APP_URL");

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

    const { data, error } = await supabase.auth.getUser();
    if (error) throw new Error(`auth.getUser error: ${error.message}`);
    if (!data.user)
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );

    const userId = data.user.id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: process.env.STRIPE_PRICE_PRO_MONTHLY!, quantity: 1 },
      ],
      success_url: `${process.env.APP_URL}/billing/success`,
      cancel_url: `${process.env.APP_URL}/billing/cancel`,
      client_reference_id: userId,
      subscription_data: {
        metadata: {
          user_id: userId,
          app_id: process.env.APP_ID!,
        },
      },
      metadata: {
        user_id: userId,
        app_id: process.env.APP_ID!,
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
