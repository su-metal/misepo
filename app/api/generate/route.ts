// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const APP_ID = process.env.APP_ID!;
const COST = 1; // 生成1回 = 1クレジット
const WEEKLY_CAP = 5;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const allowGuest = body.allowGuest === true;

  // ゲスト許可のときは「isPro=false」で固定し、クレジット消費もしない（=体験版）
  const userId = user?.id ?? null;
  const isGuest = !userId;

  if ((authError || !user) && !allowGuest) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = body.profile as StoreProfile | undefined;
  if (!profile)
    return NextResponse.json(
      { ok: false, error: "Missing profile" },
      { status: 400 }
    );
  if (typeof profile.industry !== "string" || !profile.industry.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing profile.industry" },
      { status: 400 }
    );
  }

  const config = body.config as GenerationConfig | undefined;
  if (!config)
    return NextResponse.json(
      { ok: false, error: "Missing generation config" },
      { status: 400 }
    );

  // ✅ isPro はクライアントを信じない（DBから決める）
  let isPro = false;

  if (!isGuest) {
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) {
      return NextResponse.json(
        { ok: false, error: entErr.message },
        { status: 500 }
      );
    }

    isPro = ent?.plan === "pro" && ent?.status === "active";

    // ✅ Free（ログイン済）だけクレジット消費
    if (!isPro) {
      const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
        "consume_weekly_credits",
        {
          p_app_id: APP_ID,
          p_user_id: userId,
          p_cost: 1,
          p_weekly_cap: 5,
        }
      );

      if (rpcErr) {
        return NextResponse.json(
          { ok: false, error: rpcErr.message },
          { status: 500 }
        );
      }

      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

      if (!row?.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: "quota_exceeded",
            balance: row?.out_balance ?? 0,
          },
          { status: 402 }
        );
      }
    }
  }

  console.debug("Generating content for user", userId ?? "guest", { isPro });

  try {
    const result = await generateContent(profile, config, isPro);
    return NextResponse.json({ ok: true, result, isPro }); // isPro を返すとUI側が楽
  } catch (e: any) {
    console.error("Generation error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
