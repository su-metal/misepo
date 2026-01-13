import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const APP_ID = process.env.APP_ID!;

const getCurrentWeekId = () => {
  const now = new Date();
  const jstOffset = 9 * 60; // minutes
  const jst = new Date(now.getTime() + jstOffset * 60 * 1000);
  const day = jst.getUTCDay();
  const diff = (day + 6) % 7; // days since Monday
  const weekStart = new Date(jst.getTime() - diff * 24 * 60 * 60 * 1000);
  weekStart.setUTCHours(0, 0, 0, 0);
  const year = weekStart.getUTCFullYear();
  const month = String(weekStart.getUTCMonth() + 1).padStart(2, "0");
  const date = String(weekStart.getUTCDate()).padStart(2, "0");
  return `week:${year}-${month}-${date}`;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json(
      { ok: false, error: authError.message },
      { status: 500 }
    );
  }

  if (!user) {
    return NextResponse.json({ ok: true, isGuest: true, remaining: null });
  }

  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json(
      { ok: false, error: entErr.message },
      { status: 500 }
    );
  }

  const isPro = !!(ent?.plan === "pro" && ent?.status === "active");
  if (isPro) {
    return NextResponse.json({ ok: true, isPro: true, remaining: null });
  }

  const weekId = getCurrentWeekId();
  const { data: balanceRow, error: balanceErr } = await supabaseAdmin
    .from("ticket_balances")
    .select("balance,billing_month")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .eq("billing_month", weekId)
    .maybeSingle();

  if (balanceErr) {
    return NextResponse.json(
      { ok: false, error: balanceErr.message },
      { status: 500 }
    );
  }

  const remaining = typeof balanceRow?.balance === "number" ? balanceRow.balance : 5;

  return NextResponse.json({ ok: true, remaining, isPro: false });
}
