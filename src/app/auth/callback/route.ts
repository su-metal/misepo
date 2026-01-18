// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const intent = searchParams.get("intent") ?? "login";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const next = searchParams.get("next") ?? (intent === "trial" ? "/start" : "/generate");
  const redirectUrl = new URL(next, origin);
  redirectUrl.searchParams.set("intent", intent);

  return NextResponse.redirect(redirectUrl.toString());
}
