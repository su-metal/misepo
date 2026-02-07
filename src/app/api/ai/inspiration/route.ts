import { NextResponse } from "next/server";
import { generateInspirationCards, generateSommelierQuestion } from "@/services/geminiService";
import { validateAiAccess } from "@/lib/api/aiHelper";

export const maxDuration = 30; // 30 seconds timeout for AI generation

export async function POST(req: Request) {
  const { errorResponse } = await validateAiAccess('inspiration');
  if (errorResponse) return errorResponse;

  try {
    const body = await req.json();
    const { date, storeProfile, reviews, trend, seed, templates, mode, topic, context } = body;

    // Layer 3: On-demand question generation
    if (mode === 'question_only') {
      if (!storeProfile || !topic) {
        return NextResponse.json({ error: "Missing required fields for question generation" }, { status: 400 });
      }
      const result = await generateSommelierQuestion(storeProfile, topic, context);
      return NextResponse.json(result);
    }

    if (!date || !storeProfile) {
      return NextResponse.json({ error: "Missing required fields (date, storeProfile)" }, { status: 400 });
    }

    // Call Gemini Service for card list (Legacy/Full mode if used)
    const cards = await generateInspirationCards(date, storeProfile, reviews, trend, seed, templates, mode);

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error("Inspiration API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate inspiration" }, { status: 500 });
  }
}
