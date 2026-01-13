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

  const userId = user?.id ?? null;
  const isGuest = !userId;

  if ((authError || !user) && !allowGuest) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const profile = body.profile as StoreProfile | undefined;
  if (!profile) {
    return NextResponse.json(
      { ok: false, error: "Missing profile" },
      { status: 400 }
    );
  }
  if (typeof profile.industry !== "string" || !profile.industry.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing profile.industry" },
      { status: 400 }
    );
  }

  const config = body.config as GenerationConfig | undefined;
  if (!config) {
    return NextResponse.json(
      { ok: false, error: "Missing generation config" },
      { status: 400 }
    );
  }

  let isPro = false;
  let remainingCredits: number | null = null;
  let savedRunId: string | null = null;

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

    if (!isPro) {
      const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
        "consume_weekly_credits",
        {
          p_app_id: APP_ID,
          p_user_id: userId,
          p_cost: COST,
          p_weekly_cap: WEEKLY_CAP,
        }
      );

      if (rpcErr) {
        return NextResponse.json(
          { ok: false, error: rpcErr.message },
          { status: 500 }
        );
      }

      const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      remainingCredits = row?.out_balance ?? null;

      if (!row?.ok) {
        return NextResponse.json(
          {
            ok: false,
            error: "quota_exceeded",
            balance: remainingCredits ?? 0,
            remaining: 0,
          },
          { status: 402 }
        );
      }
    }
  }

  console.debug("Generating content for user", userId ?? "guest", { isPro });

  try {
    const result = await generateContent(profile, config, isPro);

    if (userId) {
      const runType =
        typeof body.run_type === "string" && body.run_type.trim()
          ? body.run_type
          : "generation";

      const inputPayload = { profile, config };

      const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
        "save_history_with_cap",
        {
          p_app_id: APP_ID,
          p_user_id: userId,
          p_run_type: runType,
          p_is_pro: isPro,
          p_input: inputPayload, // ← stringifyしない
          p_output: result, // ← stringifyしない
          // p_free_cap: 5,       // defaultあるなら省略OK
        }
      );

      const normalized = Array.isArray(rpcData) ? rpcData[0] : rpcData;
      if (normalized) {
        if (typeof normalized === "string") {
          savedRunId = normalized;
        } else if (typeof normalized === "object") {
          savedRunId =
            typeof normalized.run_id === "string"
              ? normalized.run_id
              : typeof normalized.id === "string"
                ? normalized.id
                : null;
        }
      }

      console.log("save_history_with_cap result:", {
        rpcData,
        rpcErr,
        savedRunId,
      });
    }

    return NextResponse.json({
      ok: true,
      result,
      isPro,
      remaining: isPro ? null : remainingCredits,
      run_id: savedRunId,
    });
  } catch (e: any) {
    console.error("Generation error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
