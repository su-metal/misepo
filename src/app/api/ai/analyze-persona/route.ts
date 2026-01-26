import { NextRequest, NextResponse } from "next/server";
import { analyzePersona } from "@/services/geminiService";

export async function POST(req: NextRequest) {
  try {
    const { samples } = await req.json();

    if (!samples || !Array.isArray(samples)) {
      return NextResponse.json({ error: "Invalid samples" }, { status: 400 });
    }

    // Default to true (Pro model) for persona analysis to get better results
    const yaml = await analyzePersona(samples as { content: string, platform: string }[], true);

    return NextResponse.json({ yaml });
  } catch (error) {
    console.error("Persona analysis API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze persona" },
      { status: 500 }
    );
  }
}
