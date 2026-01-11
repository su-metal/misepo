// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { generateContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";

export async function POST(req: Request) {
  try {
    const { profile, config, isPro } = (await req.json()) as {
      profile: StoreProfile;
      config: GenerationConfig;
      isPro: boolean;
    };

    const result = await generateContent(profile, config, isPro);
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
