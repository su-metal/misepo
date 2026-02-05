import { NextRequest, NextResponse } from "next/server";
import { analyzePersona } from "@/services/geminiService";
import { validateAiAccess } from "@/lib/api/aiHelper";

export async function POST(req: NextRequest) {
  const { entitlement, errorResponse } = await validateAiAccess('analysis');
  if (errorResponse) return errorResponse;

  try {
    const { samples } = await req.json();

    if (!samples || !Array.isArray(samples)) {
      return NextResponse.json({ error: "Invalid samples" }, { status: 400 });
    }

    // Use Pro model based on plan
    const isProPlan = entitlement.plan === 'professional' || entitlement.plan === 'pro' || entitlement.plan === 'standard';
    const instruction = await analyzePersona(samples as { content: string, platform: string }[], isProPlan);

    return NextResponse.json({ instruction });
  } catch (error) {
    console.error("Persona analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze persona" },
      { status: 500 }
    );
  }
}
