// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
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

  if ((authError || !user) && !allowGuest) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (userId) {
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) {
      return NextResponse.json(
        { ok: false, error: entErr.message },
        { status: 500 }
      );
    }

    let effectiveEnt = ent ?? null;
    if (!effectiveEnt) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("entitlements")
        .upsert(
          {
            app_id: APP_ID,
            user_id: userId,
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
      return NextResponse.json(
        { ok: false, error: "access_denied" },
        { status: 403 }
      );
    }
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

  let savedRunId: string | null = null;

  console.debug("Generating content for user", userId ?? "guest");

  try {
    const isPro = userId ? true : false; // For now, if logged in and passed the canUseApp check, they get "pro" features (trial/paid)
    const result = await generateContent(profile, config, isPro);

    if (userId) {
      const runType =
        typeof body.run_type === "string" && body.run_type.trim()
          ? body.run_type
          : "generation";

      const inputPayload = { profile, config };
      const shouldSaveHistory = body.save_history !== false;

      if (shouldSaveHistory) {
        const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc(
          "save_history_with_cap",
          {
            p_app_id: APP_ID,
            p_user_id: userId,
            p_run_type: runType,
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
    }

    return NextResponse.json({
      ok: true,
      result,
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
