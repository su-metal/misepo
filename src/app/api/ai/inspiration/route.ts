import { NextResponse } from "next/server";
import { generateInspirationCards } from "@/services/geminiService";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";

const APP_ID = env.APP_ID;

export const maxDuration = 30; // 30 seconds timeout for AI generation

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  try {
    const { date, storeProfile, reviews, trend, seed, templates, mode } = await req.json();

    if (!date || !storeProfile) {
      return NextResponse.json({ error: "Missing required fields (date, storeProfile)" }, { status: 400 });
    }

    // --- Entitlement Check ---
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) {
      return NextResponse.json({ error: entErr.message }, { status: 500 });
    }

    let effectiveEnt = ent ?? null;
    if (!effectiveEnt) {
      // Create default free entitlement if missing
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

      if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 });
      effectiveEnt = created;
    }

    if (!computeCanUseApp(effectiveEnt)) {
      return NextResponse.json({ error: "access_denied" }, { status: 403 });
    }

    // Record usage (Auxiliary tools do not consume generation credits)
    await supabaseAdmin.from("ai_runs").insert({
      app_id: APP_ID,
      user_id: userId,
      run_type: 'inspiration',
    });

    // Call Gemini Service
    const cards = await generateInspirationCards(date, storeProfile, reviews, trend, seed, templates, mode);

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error("Inspiration API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate inspiration" }, { status: 500 });
  }
}
