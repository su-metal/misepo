import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PROMO_KEY = "intro_monthly_1000off";
const STARTER_COUPON =
  process.env.STRIPE_COUPON_STARTER_MONTHLY ??
  process.env.STRIPE_COUPON_FIRST_MONTH_1000OFF ??
  null;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return NextResponse.json(
      { ok: false, error: "missing signature" },
      { status: 400 }
    );

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: `signature error: ${err.message}` },
      { status: 400 }
    );
  }

  const fallbackAppId = process.env.APP_ID!;

  // --- Stripe webhook dedupe（二重処理防止） ---
  const { error: dedupeErr } = await supabaseAdmin
    .from("stripe_events")
    .insert({
      event_id: event.id,
      app_id: fallbackAppId,
      type: event.type,
    });

  if (dedupeErr) {
    if (dedupeErr.message?.includes("duplicate key")) {
      console.log("[stripe] deduped event:", event.id, event.type);
      return NextResponse.json({ ok: true, deduped: true });
    }
    throw new Error(dedupeErr.message);
  }
  // --- dedupe end ---

  try {
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;

      const userId: string | undefined =
        session?.metadata?.user_id ?? session?.client_reference_id;
      const appId: string = session?.metadata?.app_id ?? fallbackAppId;

      if (!userId)
        throw new Error(
          "user_id not found in session metadata/client_reference_id"
        );

      const subId: string | undefined = session?.subscription;
      if (!subId) throw new Error("subscription id not found in session");

      const sub: any = await stripe.subscriptions.retrieve(subId);

      const cpe: number | undefined =
        sub?.current_period_end ?? sub?.data?.current_period_end;
      const expiresAt = cpe ? new Date(cpe * 1000).toISOString() : null;

      const status =
        sub?.status === "active" || sub?.status === "trialing"
          ? "active"
          : sub?.status === "canceled"
          ? "canceled"
          : "past_due";

      const plan = status === "active" ? "pro" : "free";
      const customerId =
        typeof sub?.customer === "string"
          ? sub.customer
          : sub?.customer?.id ?? null;

      await upsertEntitlement({
        userId,
        appId,
        plan,
        status,
        expiresAt,
        billingRef: subId,
        customerId,
      });
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub: any = event.data.object;

      const userId: string | undefined = sub?.metadata?.user_id;
      const appId: string = sub?.metadata?.app_id ?? fallbackAppId;

      if (!userId)
        throw new Error("user_id not found in subscription metadata");

      const cpe: number | undefined =
        sub?.current_period_end ?? sub?.data?.current_period_end;
      const expiresAt = cpe ? new Date(cpe * 1000).toISOString() : null;

      const status =
        sub?.status === "active"
          ? "active"
          : sub?.status === "canceled"
          ? "canceled"
          : "past_due";

      const plan = status === "active" ? "pro" : "free";
      const customerId =
        typeof sub?.customer === "string"
          ? sub.customer
          : sub?.customer?.id ?? null;

      await upsertEntitlement({
        userId,
        appId,
        plan,
        status,
        expiresAt,
        billingRef: sub?.id ?? null,
        customerId,
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const { userId, appId } = await resolveUserFromInvoice(invoice, fallbackAppId);
      if (userId) {
        const isPromoApplied = isIntroPromo(invoice);
        if (isPromoApplied && appId) {
          await recordPromotion({
            userId,
            appId,
            promoKey: PROMO_KEY,
            stripeCustomerId:
              typeof invoice.customer === "string"
                ? invoice.customer
                : invoice.customer?.id ?? null,
            stripeSubscriptionId: getInvoiceSubscriptionId(invoice),
            stripeInvoiceId: invoice.id,
            stripeEventId: event.id,
            metadata: {
              ...invoice.metadata,
              coupon_ids: extractCouponIdsFromInvoice(invoice),
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("webhook error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "unknown error" },
      { status: 500 }
    );
  }
}

async function upsertEntitlement(params: {
  userId: string;
  appId: string;
  plan: "free" | "pro";
  status: string;
  expiresAt: string | null;
  billingRef: string | null;
  customerId?: string | null;
}) {
  const { userId, appId, plan, status, expiresAt, billingRef } = params;

  const payload: Record<string, unknown> = {
    user_id: userId,
    app_id: appId,
    plan,
    status,
    expires_at: expiresAt,
    billing_provider: "stripe",
    billing_reference_id: billingRef,
  };

  if (params.customerId !== undefined) {
    payload.stripe_customer_id = params.customerId;
  }

  const { error } = await supabaseAdmin
    .from("entitlements")
    .upsert(payload, { onConflict: "user_id,app_id" });

  if (error) throw new Error(error.message);
}

async function resolveUserFromInvoice(
  invoice: Stripe.Invoice,
  fallbackAppId: string
): Promise<{ userId: string | null; appId: string }> {
  let userId: string | null = invoice.metadata?.user_id ?? null;
  let appId = invoice.metadata?.app_id ?? fallbackAppId;

  if (!userId && invoice.lines?.data?.length) {
    for (const line of invoice.lines.data) {
      if (line.metadata?.user_id) {
        userId = line.metadata.user_id;
        appId = line.metadata.app_id ?? appId;
        break;
      }
    }
  }

  if (!userId) {
    const subscriptionId = getInvoiceSubscriptionId(invoice);
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      userId = subscription?.metadata?.user_id ?? userId;
      appId = subscription?.metadata?.app_id ?? appId;
    }
  }

  return { userId, appId };
}

function isIntroPromo(invoice: Stripe.Invoice) {
  const couponApplied =
    STARTER_COUPON !== null &&
    extractCouponIdsFromInvoice(invoice).some((couponId) => couponId === STARTER_COUPON);

  const metadataPromo =
    invoice.metadata?.promo_key === PROMO_KEY ||
    invoice.lines?.data?.some((line) => line.metadata?.promo_key === PROMO_KEY);

  const discountAmount =
    (invoice.total_discount_amounts ?? []).some((entry) => (entry?.amount ?? 0) > 0) &&
    invoice.metadata?.promo_key === PROMO_KEY;

  return couponApplied || metadataPromo || discountAmount;
}

async function recordPromotion(params: {
  userId: string;
  appId: string;
  promoKey: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeInvoiceId: string;
  stripeEventId: string;
  metadata: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin
    .from("promotion_redemptions")
    .insert(
      {
        app_id: params.appId,
        user_id: params.userId,
        promo_key: params.promoKey,
        stripe_customer_id: params.stripeCustomerId,
        stripe_subscription_id: params.stripeSubscriptionId,
        stripe_invoice_id: params.stripeInvoiceId,
        stripe_event_id: params.stripeEventId,
        metadata: params.metadata,
      },
      ({ onConflict: "app_id,user_id,promo_key", ignoreDuplicates: true } as any)
    );

  if (error) throw new Error(error.message);
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice) {
  const subscriptionField = (invoice as any).subscription;
  return typeof subscriptionField === "string"
    ? subscriptionField
    : subscriptionField?.id ?? null;
}

function extractCouponIdsFromInvoice(invoice: Stripe.Invoice): string[] {
  const discounts = (invoice as any).discounts;
  if (!Array.isArray(discounts)) {
    return [];
  }

  const ids = discounts.flatMap((discount: any): string[] => {
    if (!discount) return [];
    if (typeof discount === "string") return [];

    const coupon = discount.coupon;
    if (!coupon) return [];

    if (typeof coupon === "string") {
      return [coupon];
    }

    return coupon?.id ? [coupon.id] : [];
  });

  return Array.from(new Set(ids));
}
