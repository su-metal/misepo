import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const APP_ID = env.APP_ID;
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  : null;

const getSafeReturnUrl = async (request: Request) => {
  if (!BASE_URL) throw new Error("missing NEXT_PUBLIC_APP_URL");

  let candidate: string | null = null;
  try {
    const body = await request.json();
    if (body && typeof body.returnUrl === "string") {
      candidate = body.returnUrl;
    }
  } catch {
    // Ignore invalid JSON and fall back to BASE_URL.
  }

  if (!candidate) return `${BASE_URL}/`;

  if (candidate.startsWith("/")) {
    return `${BASE_URL}${candidate}`;
  }

  try {
    const candidateUrl = new URL(candidate);
    const baseUrl = new URL(BASE_URL);
    if (candidateUrl.origin === baseUrl.origin) {
      return candidateUrl.toString();
    }
  } catch {
    // Ignore invalid URLs and fall back to BASE_URL.
  }

  return `${BASE_URL}/`;
};

export async function POST(request: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY)
      throw new Error("missing STRIPE_SECRET_KEY");

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw new Error(`auth.getUser error: ${authError.message}`);
    if (!user)
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );

    const { data: entitlement, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("stripe_customer_id,billing_reference_id")
      .eq("app_id", APP_ID)
      .eq("user_id", user.id)
      .maybeSingle();

    if (entErr)
      throw new Error(`supabase error: ${entErr.message}`);

    let customerId = entitlement?.stripe_customer_id ?? null;

    if (!customerId) {
      const subId = entitlement?.billing_reference_id;
      if (!subId)
        return NextResponse.json(
          { ok: false, error: "no_active_subscription" },
          { status: 400 }
        );

      const subscription = await stripe.subscriptions.retrieve(subId);
      const retrievedCustomer =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id ?? null;

      if (!retrievedCustomer)
        return NextResponse.json(
          { ok: false, error: "no_subscription" },
          { status: 400 }
        );

      customerId = retrievedCustomer;

      const { error: updateErr } = await supabaseAdmin
        .from("entitlements")
        .update({ stripe_customer_id: customerId })
        .eq("app_id", APP_ID)
        .eq("user_id", user.id);

      if (updateErr) throw new Error(updateErr.message);
    }

    const returnUrl = await getSafeReturnUrl(request);

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ ok: true, url: portal.url });
  } catch (error: any) {
    console.error("portal error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "portal error" },
      { status: error?.statusCode ?? 500 }
    );
  }
}
