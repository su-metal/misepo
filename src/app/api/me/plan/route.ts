import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

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
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS }
    );
  }

  const userId = userData.user.id;

  const { data: ent, error: readErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json(
      { ok: false, error: readErr.message },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }

  // entitlements が無い場合は inactive を作成し、canUseApp は必ず false
  if (!ent) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert(
        {
          app_id: APP_ID,
          user_id: userId,
          plan: "free", // 互換のため残してOK（判定には使わない）
          status: "inactive",
          expires_at: null,
          trial_ends_at: null,
        },
        { onConflict: "user_id,app_id" }
      )
      .select("plan,status,expires_at,trial_ends_at")
      .single();

    if (createErr) {
      return NextResponse.json(
        { ok: false, error: createErr.message },
        { status: 500, headers: NO_STORE_HEADERS }
      );
    }

    // For new users without entitlement, they are eligible if no redemption exists
    const { data: trialRedemption } = await supabaseAdmin
      .from("promotion_redemptions")
      .select("id")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .eq("promo_key", "trial_7days")
      .maybeSingle();

    return NextResponse.json(
      {
        ok: true,
        app_id: APP_ID,
        plan: created.plan,
        status: created.status,
        expires_at: created.expires_at,
        trial_ends_at: created.trial_ends_at,
        canUseApp: false,
        isPro: false,
        eligibleForTrial: !trialRedemption,
      },
      { headers: NO_STORE_HEADERS }
    );
  }

  const nowMs = Date.now();
  const trialEndsMs = ent.trial_ends_at ? new Date(ent.trial_ends_at).getTime() : null;
  const expiresMs = ent.expires_at ? new Date(ent.expires_at).getTime() : null;

  const isTrial = trialEndsMs !== null && trialEndsMs > nowMs;
  const isPaidActive =
    ent.status === "active" && (expiresMs === null || expiresMs > nowMs);

  const canUseApp = isTrial || isPaidActive;

  // 互換（残っているUI向け）。今後は削除してOK。
  const isPro = canUseApp;

  // --- Check Trial Eligibility ---
  // Eligible if: never had pro plan, never had a trial redemption
  const isCurrentlyFree = ent.plan === "free";
  
  const { data: trialRedemption } = await supabaseAdmin
    .from("promotion_redemptions")
    .select("id")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .eq("promo_key", "trial_7days")
    .maybeSingle();

  const eligibleForTrial = isCurrentlyFree && !trialRedemption;

  return NextResponse.json(
    {
      ok: true,
      app_id: APP_ID,
      plan: ent.plan,
      status: ent.status,
      expires_at: ent.expires_at,
      trial_ends_at: ent.trial_ends_at,
      canUseApp,
      isPro,
      eligibleForTrial,
    },
    { headers: NO_STORE_HEADERS }
  );
}
