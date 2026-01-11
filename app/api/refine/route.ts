// app/api/refine/route.ts
import { NextResponse } from "next/server";
import { refineContent } from "@/services/geminiService";
import type { StoreProfile, GenerationConfig } from "@/types";

export async function POST(req: Request) {
  try {
    const { profile, config, currentContent, instruction } = (await req.json()) as {
      profile: StoreProfile;
      config: GenerationConfig;
      currentContent: string;
      instruction: string;
    };

    const result = await refineContent(profile, config, currentContent, instruction);
    return NextResponse.json({ ok: true, result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
