import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;
const WEEKLY_CAP = 5;

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ ok: false, error: authError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ ok: true, isGuest: true, remaining: null });
  }

  // Pro判定（今まで通り）
  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json({ ok: false, error: entErr.message }, { status: 500 });
  }

  const isPro = ent?.plan === "pro" && ent?.status === "active";
  if (isPro) {
    return NextResponse.json({ ok: true, isPro: true, remaining: null });
  }

  // ✅ Freeは「消費なしRPC」で今週の付与(+1 or 初回+5)を適用しつつ残高取得
  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc("consume_weekly_credits", {
    p_app_id: APP_ID,
    p_user_id: user.id,
    p_cost: 0,
    p_weekly_cap: WEEKLY_CAP,
  });

  if (rpcErr) {
    return NextResponse.json({ ok: false, error: rpcErr.message }, { status: 500 });
  }

  const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

  const remaining =
    typeof row?.out_balance === "number"
      ? row.out_balance
      : 0;

  return NextResponse.json({ ok: true, remaining, isPro: false });
}
