import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface PresetUpdate {
  name?: string;
  purpose?: string;
  tone?: string;
  length?: string;
  emoji_mode?: boolean;
  symbol_mode?: boolean;
  x_140_limit?: boolean;
  input_template?: string | null;
  custom_prompt?: string | null;
  writer_persona?: string | null;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const presetId = params.id;

  let body: PresetUpdate;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" });
  }

  const { error: updateErr } = await supabase
    .from("user_presets")
    .update(body)
    .eq("id", presetId)
    .eq("app_id", APP_ID)
    .eq("user_id", user.id);

  if (updateErr) {
    return NextResponse.json({ ok: false, error: updateErr.message });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const presetId = params.id;

  const { error: deleteErr } = await supabase
    .from("user_presets")
    .delete()
    .eq("id", presetId)
    .eq("app_id", APP_ID)
    .eq("user_id", user.id);

  if (deleteErr) {
    return NextResponse.json({ ok: false, error: deleteErr.message });
  }

  return NextResponse.json({ ok: true });
}
