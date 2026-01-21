import { NextResponse } from "next/server";
import { extractPostFromImage } from "@/services/geminiService";
import { createClient } from "@/lib/supabase/server";
import { Platform } from "@/types";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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

    const extractedText = await extractPostFromImage(
      image,
      mimeType,
      platform as Platform,
      true // Assuming pro for now as per generate/route.ts logic
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
