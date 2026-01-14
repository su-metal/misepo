import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface PresetUpdate {
  name?: string;
  custom_prompt?: string | null;
  is_pinned?: boolean;
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

  const wantsPin = body.is_pinned === true;
  const wantsUnpin = body.is_pinned === false;

  const updateFields: Record<string, unknown> = {};
  if (body.name !== undefined) updateFields.name = body.name;
  if (body.custom_prompt !== undefined) updateFields.custom_prompt = body.custom_prompt;

  if (wantsPin) {
    const { data: pinned, error: pinnedErr } = await supabase
      .from("user_presets")
      .select("id, pinned_at")
      .eq("app_id", APP_ID)
      .eq("user_id", user.id)
      .eq("is_pinned", true)
      .neq("id", presetId)
      .order("pinned_at", { ascending: true });

    if (pinnedErr) {
      return NextResponse.json({ ok: false, error: pinnedErr.message });
    }

    if ((pinned ?? []).length >= 3) {
      const oldest = pinned[0];
      if (oldest?.id) {
        const { error: unpinErr } = await supabase
          .from("user_presets")
          .update({ is_pinned: false, pinned_at: null })
          .eq("id", oldest.id)
          .eq("app_id", APP_ID)
          .eq("user_id", user.id);

        if (unpinErr) {
          return NextResponse.json({ ok: false, error: unpinErr.message });
        }
      }
    }

    const pinPayload = {
      ...updateFields,
      is_pinned: true,
      pinned_at: new Date().toISOString(),
    };

    const { error: pinErr } = await supabase
      .from("user_presets")
      .update(pinPayload)
      .eq("id", presetId)
      .eq("app_id", APP_ID)
      .eq("user_id", user.id);

    if (pinErr) {
      return NextResponse.json({ ok: false, error: pinErr.message });
    }

    return NextResponse.json({ ok: true });
  }

  if (wantsUnpin) {
    const unpinPayload = {
      ...updateFields,
      is_pinned: false,
      pinned_at: null,
    };

    const { error: unpinErr } = await supabase
      .from("user_presets")
      .update(unpinPayload)
      .eq("id", presetId)
      .eq("app_id", APP_ID)
      .eq("user_id", user.id);

    if (unpinErr) {
      return NextResponse.json({ ok: false, error: unpinErr.message });
    }

    return NextResponse.json({ ok: true });
  }

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
