// app/api/refine/route.ts
import { NextResponse } from "next/server";
import { refineContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const COST = 1;
const WEEKLY_CAP = 5;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
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

  const currentContent = body.currentContent;
  if (typeof currentContent !== "string" || !currentContent.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing currentContent" },
      { status: 400 }
    );
  }

  const instruction = body.instruction;
  if (typeof instruction !== "string" || !instruction.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing instruction" },
      { status: 400 }
    );
  }

  console.debug("Refining content for user", user.id);

  const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
    "consume_weekly_credits",
    {
      p_app_id: env.APP_ID,
      p_user_id: user.id,
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

  const creditRow = Array.isArray(rpcData) ? rpcData[0] : rpcData;

  if (!creditRow?.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "quota_exceeded",
        balance: creditRow?.out_balance ?? 0,
        remaining: 0,
      },
      { status: 402 }
    );
  }
  try {
    const result = await refineContent(profile, config, currentContent, instruction);
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    console.error("Refine error:", e);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
