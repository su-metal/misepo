// app/api/refine/route.ts
import { NextResponse } from "next/server";
import { refineContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";

const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .maybeSingle();

  if (entErr) {
    return NextResponse.json({ ok: false, error: entErr.message }, { status: 500 });
  }

  let effectiveEnt = ent ?? null;
  if (!effectiveEnt) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert(
        {
          app_id: APP_ID,
          user_id: user.id,
          plan: "free",
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
        { status: 500 }
      );
    }

    effectiveEnt = created;
  }

  const canUseApp = computeCanUseApp(effectiveEnt);

  if (!canUseApp) {
    return NextResponse.json({ ok: false, error: "access_denied" }, { status: 403 });
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
