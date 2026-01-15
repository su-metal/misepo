import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;

export async function GET() {
  // 1) ログイン中ユーザーを取得（cookieから）
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {}, // GETなので未使用
      },
    }
  );

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  // 2) entitlements を読む（app_id + user_id）
  const { data: ent, error: readErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr) {
    return NextResponse.json({ ok: false, error: readErr.message }, { status: 500 });
  }

  // 3) 無ければ「free」を作る（このAPIを叩いたら必ず1行になる）
  if (!ent) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .insert({
        app_id: APP_ID,
        user_id: userId,
        plan: "free",
        status: "active",
        expires_at: null,
      })
      .select("plan,status,expires_at")
      .single();

    if (createErr) {
      return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      app_id: APP_ID,
      plan: created.plan,
      status: created.status,
      expires_at: created.expires_at,
      isPro: false,
    });
  }

  // 4) Pro判定（plan=pro AND status=active AND (expires_at future or null)）
  const now = new Date();
  const expiresAt = ent.expires_at ? new Date(ent.expires_at) : null;
  const isActive = ent.status === "active";
  const notExpired = !expiresAt || expiresAt.getTime() > now.getTime();
  const isPro = ent.plan === "pro" && isActive && notExpired;

  return NextResponse.json({
    ok: true,
    app_id: APP_ID,
    plan: ent.plan,
    status: ent.status,
    expires_at: ent.expires_at,
    isPro,
  });
}
