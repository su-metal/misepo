import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { User } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/api/rateLimit";

const APP_ID = env.APP_ID;

/**
 * Unified AI action types across the entire application.
 * Covers both main generations and auxiliary tool runs.
 */
export type AiRunType = 'inspiration' | 'analysis' | 'sanitization' | 'extract' | 'generation' | 'multi-gen';

export interface Entitlement {
  plan: string | null;
  status: string | null;
  expires_at: string | null;
  trial_ends_at: string | null;
}

export type AiAccessResult = {
  user: User | null;
  entitlement: Entitlement | null;
  errorResponse?: NextResponse;
};

/**
 * Validates user authentication, checks entitlements, and records usage.
 * Used by auxiliary AI endpoints (inspiration, analysis, sanitization, extract).
 */
export async function validateAiAccess(
  runType: AiRunType, 
  options: { skipInsert?: boolean } = {}
): Promise<AiAccessResult> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(`[AI ACCESS] Auth error during ${runType}:`, authError);
    return {
      user: null, entitlement: null,
      errorResponse: NextResponse.json({ error: "Authentication failed" }, { status: 500 })
    };
  }

  if (!user) {
    return { 
      user: null, 
      entitlement: null, 
      errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) 
    };
  }

  const userId = user.id;

  // --- Rate Limit Check (per user, 20 requests per minute) ---
  const rl = checkRateLimit(`ai:${userId}`, 20, 60_000);
  if (!rl.success) {
    return {
      user, entitlement: null,
      errorResponse: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    };
  }

  // --- Entitlement Check ---
  const { data: ent, error: entErr } = await supabaseAdmin
    .from("entitlements")
    .select("plan,status,expires_at,trial_ends_at")
    .eq("app_id", APP_ID)
    .eq("user_id", userId)
    .maybeSingle();

  if (entErr) {
    console.error(`[AI ACCESS] Entitlement query error for user ${userId}:`, entErr);
    return {
      user, entitlement: null,
      errorResponse: NextResponse.json({ error: entErr.message }, { status: 500 })
    };
  }

  let effectiveEnt = ent ?? null;
  if (!effectiveEnt) {
    const { data: created, error: createErr } = await supabaseAdmin
      .from("entitlements")
      .upsert(
        { app_id: APP_ID, user_id: userId, plan: "trial", status: "inactive" },
        { onConflict: "user_id,app_id" }
      )
      .select("plan,status,expires_at,trial_ends_at")
      .single();

    if (createErr) {
      console.error(`[AI ACCESS] Entitlement upsert failed for user ${userId}:`, createErr);
      return {
        user, entitlement: null,
        errorResponse: NextResponse.json({ error: createErr.message }, { status: 500 })
      };
    }
    effectiveEnt = created;
  }

  if (!computeCanUseApp(effectiveEnt)) {
    return {
      user, entitlement: effectiveEnt,
      errorResponse: NextResponse.json({ error: "access_denied" }, { status: 403 })
    };
  }

  // Record usage (optional skip)
  if (!options.skipInsert) {
    const { error: runError } = await supabaseAdmin.from("ai_runs").insert({
      app_id: APP_ID,
      user_id: userId,
      run_type: runType,
    });

    if (runError) {
      console.error(`[AI ACCESS] Failed to record usage (${runType}) for user ${userId}:`, runError);
      return {
          user, entitlement: effectiveEnt,
          errorResponse: NextResponse.json({ error: "Failed to record usage" }, { status: 500 })
      };
    }
  }

  return { user, entitlement: effectiveEnt };
}
