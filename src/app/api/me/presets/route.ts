import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Preset {
  id?: string;
  name: string;
  avatar?: string | null;
  custom_prompt?: string;
  post_samples?: { [key: string]: string } | null;
  persona_yaml?: string | null;
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
    .select("id,name,avatar,custom_prompt,post_samples,persona_yaml,sort_order,created_at,updated_at")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  console.log("[presets GET] user.id=", user.id, "fetchErr=", fetchErr?.message ?? null, "rows=", (data ?? []).length);

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message });
  }

  // New users start with an empty presets list (no auto-seeding)
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
    post_samples: body.post_samples ?? null,
    sort_order: (count ?? 0) + 1,
  };

  const { data, error: insertErr } = await supabase
    .from("user_presets")
    .insert(insertPayload)
    .select("id,name,avatar,custom_prompt,post_samples,persona_yaml,sort_order,created_at,updated_at")
    .single();

  if (insertErr) {
    return NextResponse.json({ ok: false, error: insertErr.message });
  }

  return NextResponse.json({ ok: true, preset: data });
}
