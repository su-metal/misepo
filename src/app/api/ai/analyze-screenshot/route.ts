import { NextResponse } from "next/server";
import { extractPostFromImage } from "@/services/geminiService";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";
import { getJSTDateRange } from "@/lib/dateUtils";
import { Platform } from "@/types";
import { validateAiAccess } from "@/lib/api/aiHelper";

const APP_ID = env.APP_ID;

export async function POST(req: Request) {
  // We skip automatic insert to check the specific loose limit (50) first
  const { user, entitlement, errorResponse } = await validateAiAccess('extract', { skipInsert: true });
  if (errorResponse) return errorResponse;

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

    // --- Usage tracking (Relaxed limit for UX) ---
    const { startOfToday } = getJSTDateRange();
    const { data: todayRuns, error: countErr } = await supabaseAdmin
      .from("ai_runs")
      .select("run_type")
      .eq("user_id", userId)
      .eq("app_id", APP_ID)
      .eq("run_type", "extract")
      .gte("created_at", startOfToday);

    if (countErr) {
        console.error(`[SCREENSHOT API] Failed to count daily usage for user ${userId}:`, countErr);
        return NextResponse.json({ ok: false, error: "Failed to check usage limits" }, { status: 500 });
    }

    const extractCount = todayRuns?.length || 0;
    
    // Set a very loose limit (e.g., 50 per day) for extract to allow learning
    if (extractCount >= 50) {
      return NextResponse.json({ ok: false, error: "daily_limit_reached", limit: 50, current: extractCount }, { status: 403 });
    }

    // Record usage
    const { error: runError } = await supabaseAdmin.from("ai_runs").insert({
      app_id: APP_ID,
      user_id: userId,
      run_type: 'extract',
    });

    if (runError) {
        console.error(`[SCREENSHOT API] Failed to record usage (extract) for user ${userId}:`, runError);
        return NextResponse.json({ ok: false, error: "Failed to record usage" }, { status: 500 });
    }

    const isProPlan = entitlement.plan === 'professional' || entitlement.plan === 'pro' || entitlement.plan === 'standard';
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
      { ok: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
