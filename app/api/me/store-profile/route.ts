import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_ID = "misepo";

interface StoreProfile {
  industry: string;
  store_name: string;
  area?: string;
  highlights?: string;
  instagram_signature?: string;
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

  const { data, error: profileErr } = await supabase
    .from("app_user_profiles")
    .select("profile_data")
    .eq("app_id", APP_ID)
    .eq("user_id", user.id)
    .eq("profile_key", "store_profile")
    .maybeSingle();

  if (profileErr) {
    return NextResponse.json({ ok: false, error: profileErr.message });
  }

  const profile = (data?.profile_data ?? null) as StoreProfile | null;
  return NextResponse.json({ ok: true, profile });
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

  let payload: StoreProfile;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid payload" });
  }

  if (typeof payload.industry !== "string" || !payload.industry.trim()) {
    return NextResponse.json({ ok: false, error: "missing industry" });
  }
  if (typeof payload.store_name !== "string" || !payload.store_name.trim()) {
    return NextResponse.json({ ok: false, error: "missing store_name" });
  }

  const { error: upsertErr } = await supabase
    .from("app_user_profiles")
    .upsert(
      {
        app_id: APP_ID,
        user_id: user.id,
        profile_key: "store_profile",
        profile_data: payload,
      },
      { onConflict: "app_id,user_id,profile_key" }
    );

  if (upsertErr) {
    return NextResponse.json({ ok: false, error: upsertErr.message });
  }

  return NextResponse.json({ ok: true });
}
