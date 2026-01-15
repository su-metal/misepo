import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface ReorderBody {
  orderedIds: string[];
}

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: ReorderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  if (!Array.isArray(body.orderedIds)) {
    return NextResponse.json({ ok: false, error: "invalid payload" }, { status: 400 });
  }

  const uniqueIds = Array.from(new Set(body.orderedIds));

  const { data: existing, error: fetchErr } = await supabase
    .from("user_presets")
    .select("id")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id);

  if (fetchErr) {
    return NextResponse.json({ ok: false, error: fetchErr.message });
  }

  const existingIds = new Set((existing ?? []).map((preset) => preset.id));
  if (
    uniqueIds.length !== body.orderedIds.length ||
    uniqueIds.length !== existingIds.size ||
    uniqueIds.some((id) => !existingIds.has(id))
  ) {
    return NextResponse.json({ ok: false, error: "invalid_order_ids" }, { status: 400 });
  }

  for (let index = 0; index < uniqueIds.length; index += 1) {
    const { error: updateErr } = await supabase
      .from("user_presets")
      .update({ sort_order: index + 1 })
      .eq("id", uniqueIds[index])
      .eq("app_id", APP_ID)
      .eq("user_id", user.id);

    if (updateErr) {
      return NextResponse.json({ ok: false, error: updateErr.message });
    }
  }

  return NextResponse.json({ ok: true });
}
