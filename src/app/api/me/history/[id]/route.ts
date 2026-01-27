import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { env } from "@/lib/env";

const APP_ID = env.APP_ID;

type HistoryParams = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, context: HistoryParams) {
  const { params } = context;
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { error: deleteErr } = await supabaseAdmin
    .from("ai_runs")
    .delete()
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .eq("id", id);

  if (deleteErr) {
    return NextResponse.json({ ok: false, error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, context: HistoryParams) {
  const { params } = context;
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { isPinned: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const { error: updateErr } = await supabaseAdmin
    .from("ai_runs")
    .update({ is_pinned: body.isPinned })
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ ok: false, error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
