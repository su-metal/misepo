import { NextResponse } from "next/server";
import { generateInspirationCards } from "@/services/geminiService";

export const maxDuration = 30; // 30 seconds timeout for AI generation

export async function POST(req: Request) {
  try {
    const { date, storeProfile, reviews, trend, seed } = await req.json();

    console.log('[Inspiration API] Received data:', {
      date,
      storeProfileName: storeProfile?.name,
      storeProfileIndustry: storeProfile?.industry,
      reviewCount: reviews?.length || 0,
      reviewSample: reviews?.[0]?.text?.substring(0, 50) || 'No reviews',
      trend: trend || 'No trend',
      seed: seed || 'No seed'
    });

    if (!date || !storeProfile) {
      return NextResponse.json({ error: "Missing required fields (date, storeProfile)" }, { status: 400 });
    }

    // Call Gemini Service
    const cards = await generateInspirationCards(date, storeProfile, reviews, trend, seed);

    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error("Inspiration API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate inspiration" }, { status: 500 });
  }
}
