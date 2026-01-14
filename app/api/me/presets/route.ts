import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface Preset {
  id?: string;
  name: string;
  purpose: string;
  tone: string;
  length: string;
  emoji_mode: boolean;
  symbol_mode: boolean;
  x_140_limit: boolean;
  input_template?: string;
  custom_prompt?: string;
  writer_persona?: string;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { data, error: fetchErr } = await supabase
    .from("user_presets")
    .select("*")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message });
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

  const { data, error: insertErr } = await supabase
    .from("user_presets")
    .insert({
      app_id: APP_ID,
      user_id: user.id,
      ...body,
    })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ ok: false, error: insertErr.message });
  }

  return NextResponse.json({ ok: true, preset: data });
}
