// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const intent = searchParams.get("intent") ?? "login";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("Auth error in callback:", error, errorDescription);
    const redirectUrl = new URL("/start", origin);
    redirectUrl.searchParams.set("error", errorDescription ?? "Authentication failed");
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (code) {
    const supabase = await createClient();
    
    // Check if we already have a session. 
    // This happens if the user hits the back button to this callback URL.
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log("User already authenticated in callback, skipping exchange.");
    } else {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        console.error("Exchange code error:", exchangeError);
        const redirectUrl = new URL("/start", origin);
        redirectUrl.searchParams.set("error", "Session exchange failed");
        return NextResponse.redirect(redirectUrl.toString());
      }
    }
  }

  const next = searchParams.get("next") ?? (intent === "trial" ? "/start" : "/generate");
  const redirectUrl = new URL(next, origin);
  redirectUrl.searchParams.set("intent", intent);

  return NextResponse.redirect(redirectUrl.toString());
}
