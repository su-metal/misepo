import { NextResponse } from "next/server";
import { extractPostFromImage } from "@/services/geminiService";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { computeCanUseApp } from "@/lib/entitlements/canUseApp";
import { getJSTDateRange } from "@/lib/dateUtils";
import { Platform } from "@/types";

const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  try {
    const { image, mimeType, platform } = await req.json();

    if (!image || !mimeType || !platform) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic validation for Platform
    if (!Object.values(Platform).includes(platform as Platform)) {
        return NextResponse.json({ ok: false, error: "Invalid platform" }, { status: 400 });
    }

    // --- Entitlement Check ---
    const { data: ent, error: entErr } = await supabaseAdmin
      .from("entitlements")
      .select("plan,status,expires_at,trial_ends_at")
      .eq("app_id", APP_ID)
      .eq("user_id", userId)
      .maybeSingle();

    if (entErr) return NextResponse.json({ ok: false, error: entErr.message }, { status: 500 });
    
    let effectiveEnt = ent ?? null;
    if (!effectiveEnt) {
      const { data: created, error: createErr } = await supabaseAdmin
        .from("entitlements")
        .upsert({ app_id: APP_ID, user_id: userId, plan: "free", status: "inactive" }, { onConflict: "user_id,app_id" })
        .select("plan,status,expires_at,trial_ends_at")
        .single();
      if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 500 });
      effectiveEnt = created;
    }

    if (!computeCanUseApp(effectiveEnt)) {
      return NextResponse.json({ ok: false, error: "access_denied" }, { status: 403 });
    }

    // --- Usage tracking (Relaxed limit for UX) ---
    const { startOfToday } = getJSTDateRange();
    const { data: todayRuns } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .eq("run_type", "extract")
      .gte("created_at", startOfToday);

    const extractCount = todayRuns?.length || 0;
    
    // Set a very loose limit (e.g., 50 per day) for extract to allow learning
    if (extractCount >= 50) {
      return NextResponse.json({ ok: false, error: "daily_limit_reached", limit: 50, current: extractCount }, { status: 403 });
    }

    // Record usage
    await supabaseAdmin.from("ai_runs").insert({
      app_id: APP_ID,
      user_id: userId,
      run_type: 'extract',
    });

    const isProPlan = effectiveEnt.plan === 'professional' || effectiveEnt.plan === 'pro' || effectiveEnt.plan === 'standard';
    const extractedText = await extractPostFromImage(
      image,
      mimeType,
      platform as Platform,
      isProPlan
    );

    return NextResponse.json({
      ok: true,
      text: extractedText,
    });
  } catch (error: any) {
    console.error("Screenshot analysis error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
