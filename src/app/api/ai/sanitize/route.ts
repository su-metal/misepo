import { NextRequest, NextResponse } from "next/server";
import { sanitizePostSamples } from "@/services/geminiService";
import { validateAiAccess } from "@/lib/api/aiHelper";

export async function POST(req: NextRequest) {
  const { entitlement, errorResponse } = await validateAiAccess('sanitization');
  if (errorResponse) return errorResponse;

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    const isProPlan = entitlement.plan === 'professional' || entitlement.plan === 'pro' || entitlement.plan === 'standard';
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
