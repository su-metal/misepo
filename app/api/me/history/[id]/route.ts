import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
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

  const { error: deleteErr } = await supabase
    .from("ai_runs")
    .delete()
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .eq("id", params.id);

  if (deleteErr) {
    return NextResponse.json({ ok: false, error: deleteErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
