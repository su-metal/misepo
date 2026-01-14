// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // NextResponse を先に作る（ここにCookieを書き戻す）
  let res = NextResponse.next({
    request: { headers: req.headers },
  });

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
            // resに書き戻し
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // これを呼ぶことで、期限切れ/更新が必要なセッションCookieが res に反映される
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const protectedPaths = ['/start', '/login', '/signup'];
    if (protectedPaths.includes(req.nextUrl.pathname)) {
      const redirectUrl = new URL('/', req.url);
      res.headers.set('location', redirectUrl.toString());
      res.status = 307;
      return res;
    }
  }

  return res;
}

// 静的ファイル等は除外（無駄な呼び出しを避ける）
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
