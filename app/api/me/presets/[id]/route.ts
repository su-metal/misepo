import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface PresetUpdate {
  name?: string;
  custom_prompt?: string | null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { id: presetId } = await params;

  let body: PresetUpdate;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" });
  }

  const updateFields: Record<string, unknown> = {};
  if (body.name !== undefined) updateFields.name = body.name;
  if (body.custom_prompt !== undefined) updateFields.custom_prompt = body.custom_prompt;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error: updateErr } = await supabase
    .from("user_presets")
    .update(updateFields)
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
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" });
  }

  const { id: presetId } = await params;

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
