import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;

interface Preset {
  id?: string;
  name: string;
  avatar?: string | null;
  custom_prompt?: string;
  sort_order?: number;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("[presets GET] auth result user_id=", user?.id ?? null, "error=", error?.message ?? null);

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { data, error: fetchErr } = await supabase
    .from("user_presets")
    .select("id,name,avatar,custom_prompt,sort_order,created_at,updated_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  console.log("[presets GET] user.id=", user.id, "fetchErr=", fetchErr?.message ?? null, "rows=", (data ?? []).length);

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message });
  }

  if ((data ?? []).length === 0) {
    console.log("[presets GET] seed branch entering");
    const now = new Date().toISOString();
    const seedPresets: Preset[] = [
      {
        name: "店長（丁寧・公式）",
        avatar: "👔",
        custom_prompt:
          "あなたはこの店舗の店長です。\n落ち着いた丁寧な敬語で、信頼感と安心感を重視して発信してください。\n公式アカウントとして、不快感を与えない表現を優先し、事実ベースで簡潔にまとめてください。",
        sort_order: 1,
      },
      {
        name: "スタッフ（親しみ）",
        avatar: "👟",
        custom_prompt:
          "あなたはこの店舗で働く20代のスタッフです。\n親しみやすく、やわらかい口調で日常の様子を伝えてください。\n少しくだけた表現や感情を含めても構いませんが、下品にならないよう注意してください。",
        sort_order: 2,
      },
      {
        name: "広報・マーケ担当（整理）",
        avatar: "💻",
        custom_prompt:
          "あなたはこの店舗の広報・マーケティング担当です。\n情報が一目で伝わるよう、要点を整理して分かりやすく発信してください。\nキャンペーン内容や特徴、メリットを端的にまとめ、読み手が行動しやすい文章を意識してください。",
        sort_order: 3,
      },
    ];

    const { data: seeded, error: seedErr } = await supabase
      .from("user_presets")
      .insert(
        seedPresets.map((preset) => ({
          app_id: APP_ID,
          user_id: user.id,
          ...preset,
        }))
      )
      .select();

    console.log(
      "[presets GET] seed insert result",
      "seeded:", seeded?.length ?? 0,
      "seedErr:", seedErr?.message ?? null
    );

    if (seedErr) {
      return NextResponse.json({ ok: false, error: seedErr.message });
    }

    if (Array.isArray(seeded)) {
      return NextResponse.json({ ok: true, presets: seeded });
    }
  }

  return NextResponse.json({ ok: true, presets: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  let body: Preset;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" });
  }

  const { count, error: countErr } = await supabase
    .from("user_presets")
    .select("*", { count: "exact", head: true })
    .eq("app_id", APP_ID)
    .eq("user_id", user.id);

  if (countErr) {
    return NextResponse.json({ ok: false, error: countErr.message });
  }

  if ((count ?? 0) >= 10) {
    return NextResponse.json(
      { ok: false, error: "preset_limit_reached" },
      { status: 409 }
    );
  }

  const insertPayload = {
    app_id: APP_ID,
    user_id: user.id,
    name: body.name,
    avatar: body.avatar ?? "👤",
    custom_prompt: body.custom_prompt ?? null,
    sort_order: (count ?? 0) + 1,
  };

  const { data, error: insertErr } = await supabase
    .from("user_presets")
    .insert(insertPayload)
    .select("id,name,avatar,custom_prompt,sort_order,created_at,updated_at")
    .single();

  if (insertErr) {
    return NextResponse.json({ ok: false, error: insertErr.message });
  }

  return NextResponse.json({ ok: true, preset: data });
}
