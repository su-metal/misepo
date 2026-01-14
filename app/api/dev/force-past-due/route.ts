import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const isDev = process.env.NODE_ENV !== "production";
const appId = process.env.APP_ID!;
const token = process.env.DEV_FORCE_PLAN_TOKEN;

export async function POST(req: Request) {
  // 本番では無効
  if (!isDev) {
    return NextResponse.json({ ok: false, error: "disabled in production" }, { status: 403 });
  }

  // 開発でもトークン必須
  const auth = req.headers.get("authorization") ?? "";
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const userId = body?.user_id as string | undefined;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "missing user_id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("entitlements")
    .upsert(
      {
        user_id: userId,
        app_id: appId,
        plan: "free",
        status: "past_due",
        expires_at: null,
        billing_provider: "stripe",
        billing_reference_id: null,
      },
      { onConflict: "user_id,app_id" }
    );

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
