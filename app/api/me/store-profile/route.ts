// app/api/me/store-profile/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";
const PROFILE_KEY = "store_profile";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const profile = body?.profile ?? null;
  if (!profile) return NextResponse.json({ ok: false, error: "missing_profile" }, { status: 400 });

  const { data, error: upsertErr } = await supabase
    .from("app_user_profiles")
    .upsert(
      {
        app_id: APP_ID,
        user_id: user.id,
        profile_key: PROFILE_KEY,
        profile_data: profile,
      },
      { onConflict: "app_id,user_id,profile_key" }
    )
    .select("profile_data")
    .single();

  if (upsertErr) return NextResponse.json({ ok: false, error: upsertErr.message }, { status: 500 });
  return NextResponse.json({ ok: true, profile: data.profile_data });
}
