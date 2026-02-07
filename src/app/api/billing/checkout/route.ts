import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Plan = "entry" | "standard" | "professional";
const PROMO_KEY = "intro_monthly_1000off";
const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  try {
    // ---- env guard
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("missing STRIPE_SECRET_KEY");
    if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("missing NEXT_PUBLIC_APP_URL");
    
    const PRICE_ID_ENTRY = process.env.STRIPE_PRICE_MONTHLY_EARLY_BIRD_ID;
    const PRICE_ID_STANDARD = process.env.STRIPE_PRICE_MONTHLY_STANDARD_ID;
    const PRICE_ID_PROFESSIONAL = process.env.STRIPE_PRICE_MONTHLY_ID;

    if (!PRICE_ID_ENTRY || !PRICE_ID_STANDARD || !PRICE_ID_PROFESSIONAL) {
      throw new Error("Missing required Stripe Price IDs in environment variables");
    }



    // ---- request
    const body = await req.json().catch(() => ({}));
    const plan: Plan = body?.plan || "standard";

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
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
    const successUrl = `${baseUrl}/generate?pwa=true&success=1`;
    const cancelUrl = `${baseUrl}/billing/cancel?pwa=true`;

    // ---- load entitlement (DB is source of truth)
    const entRes = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at,stripe_customer_id,billing_reference_id")
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
          billing_reference_id?: string | null;
        }
      | null;

    // If missing, we'll create it during checkout or trial start

    // If already on a paid plan, don't create a new checkout unless it's an upgrade (simplified for now to just block if active)

    // ---- pick price
    let priceId = PRICE_ID_STANDARD;
    if (plan === "entry") priceId = PRICE_ID_ENTRY;
    if (plan === "professional") priceId = PRICE_ID_PROFESSIONAL;

    // ---- ensure customer
    let customerId = entitlement?.stripe_customer_id ?? null;
    
    // --- SELF-HEALING: Verify existing customer exists in Stripe ---
    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId);
      } catch (err: any) {
        if (err.code === 'resource_missing' || err.status === 404 || err.message?.includes("No such customer")) {
          console.log(`[CheckoutAPI] Customer ${customerId} not found in Stripe. Clearing and re-creating...`);
          customerId = null; // Mark as null to trigger re-creation below
        } else {
          throw err; // Re-throw other errors
        }
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail || undefined,
        metadata: { user_id: userId, app_id: appId },
      });
      customerId = customer.id;

      const { error: saveErr } = await supabaseAdmin
        .from("entitlements")
        .upsert(
          {
            user_id: userId,
            app_id: appId,
            plan: entitlement?.plan ?? plan,
            status: entitlement?.status ?? "inactive",
            billing_provider: "stripe",
            stripe_customer_id: customerId,
          },
          { onConflict: "user_id,app_id" }
        );

      if (saveErr) throw new Error(saveErr.message);
    }

    const isAlreadyPaid = (entitlement?.plan === 'entry' || entitlement?.plan === 'standard' || entitlement?.plan === 'professional' || entitlement?.plan === 'monthly' || entitlement?.plan === 'yearly') && 
                          (entitlement?.status === 'active' || entitlement?.status === 'trialing');

    if (isAlreadyPaid && entitlement?.billing_reference_id && customerId) {
      try {
        // Redirect to Stripe Billing Portal for plan change (Subscription Update flow)
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: successUrl,
          flow_data: {
            type: 'subscription_update',
            subscription_update: {
              subscription: entitlement.billing_reference_id
            }
          }
        });
        return NextResponse.json({ ok: true, url: session.url });
      } catch (err: any) {
        console.warn("Stripe Billing Portal Update flow failed (likely disabled in dashboard):", err.message);
        // Fallback to plain portal session
        try {
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: successUrl,
          });
          return NextResponse.json({ ok: true, url: session.url });
        } catch (innerErr: any) {
          throw innerErr; // Re-throw if even plain portal fails
        }
      }
    } else if (isAlreadyPaid) {
      // Safety check: if they are paid but we don't have sub ID, block and suggest support
      return NextResponse.json({ ok: false, error: "already_active" }, { status: 400 });
    }

    // ---- check for auto-applied coupon
    const STARTER_COUPON =
      process.env.STRIPE_COUPON_STARTER_MONTHLY ??
      process.env.STRIPE_COUPON_FIRST_MONTH_1000OFF ??
      null;

    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = 
      STARTER_COUPON ? [{ coupon: STARTER_COUPON }] : undefined;

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
        },
      },

      metadata: {
        user_id: userId,
        app_id: appId,
        plan,
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
