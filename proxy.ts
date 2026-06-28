import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protects /admin/* routes.
 * - /admin/login is always accessible.
 * - All other /admin paths require a valid Supabase session whose email
 *   is in the ADMIN_EMAILS env var (comma-separated allowlist).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Login page is always accessible
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Supabase not configured — redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Role check — only emails in ADMIN_EMAILS can access /admin
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length > 0 && !adminEmails.includes(user.email?.toLowerCase() ?? "")) {
    // Authenticated but not an admin — boot to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
