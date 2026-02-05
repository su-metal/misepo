import { NextRequest, NextResponse } from "next/server";
import { sanitizePostSamples } from "@/services/geminiService";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";

const APP_ID = env.APP_ID;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    // --- Entitlement Check ---
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) return NextResponse.json({ error: entErr.message }, { status: 500 });
    
    let effectiveEnt = ent ?? null;
    if (!effectiveEnt) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("entitlements")
        .upsert({ app_id: APP_ID, user_id: userId, plan: "free", status: "inactive" }, { onConflict: "user_id,app_id" })
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
      run_type: 'sanitization',
    });

    const isProPlan = effectiveEnt.plan === 'professional' || effectiveEnt.plan === 'pro' || effectiveEnt.plan === 'standard';
    const sanitized = await sanitizePostSamples(text, isProPlan);

    return NextResponse.json({ sanitized });
  } catch (error) {
    console.error("Sanitization API error:", error);
    return NextResponse.json(
      { error: "Failed to sanitize text" },
      { status: 500 }
    );
  }
}
