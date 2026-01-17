// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // NextResponse を先に作る（ここにCookieを書き戻す）
  const baseResponse = NextResponse.next({
    request: { headers: req.headers },
  });

  const pendingCookies: Array<{ name: string; value: string; options?: any }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // req側も更新（後続処理で整合性を取るため）
            req.cookies.set(name, value);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const applyPendingCookies = (response: NextResponse) => {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  };

  const pathname = req.nextUrl.pathname;
  // ルートパス（/）は LandingPage を表示するためリダイレクトしない

  if (user) {
    const protectedPaths = ['/login', '/signup'];
    if (protectedPaths.includes(pathname)) {
      const redirectUrl = new URL('/generate', req.url);
      return applyPendingCookies(NextResponse.redirect(redirectUrl, 307));
    }
  }

  return applyPendingCookies(baseResponse);
}

// 静的ファイル等は除外（無駄な呼び出しを避ける）
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
