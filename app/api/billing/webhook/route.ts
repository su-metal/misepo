import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

      await upsertEntitlement({
        userId,
        appId,
        plan,
        status,
        expiresAt,
        billingRef: subId,
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

      await upsertEntitlement({
        userId,
        appId,
        plan,
        status,
        expiresAt,
        billingRef: sub?.id ?? null,
      });
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
}) {
  const { userId, appId, plan, status, expiresAt, billingRef } = params;

  const { error } = await supabaseAdmin.from("entitlements").upsert(
    {
      user_id: userId,
      app_id: appId,
      plan,
      status,
      expires_at: expiresAt,
      billing_provider: "stripe",
      billing_reference_id: billingRef,
    },
    { onConflict: "user_id,app_id" }
  );

  if (error) throw new Error(error.message);
}
