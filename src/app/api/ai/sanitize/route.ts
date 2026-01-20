import { NextRequest, NextResponse } from "next/server";
import { sanitizePostSamples } from "@/services/geminiService";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    // Default to true for better sanitization model
    const sanitized = await sanitizePostSamples(text, true);

    return NextResponse.json({ sanitized });
  } catch (error) {
    console.error("Sanitization API error:", error);
    return NextResponse.json(
      { error: "Failed to sanitize text" },
      { status: 500 }
    );
  }
}
