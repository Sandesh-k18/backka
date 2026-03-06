import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(25, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // 1. HARD BYPASS
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/auth') ||
    pathname.match(/\.(xml|txt|webp|ico)$/) ||
    ['/apis', '/terms', '/privacy-policy', '/faq', '/about'].includes(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Ratelimiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) return new NextResponse("Too Many Requests", { status: 429 });
  } catch (e) {
    console.error("Ratelimit error", e);
  }

  // 3. AUTHENTICATION LOGIC
  // IMPORTANT: Use secureCookie: true if you are on Vercel
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    raw: false // Ensures we get the decoded object
  });

  const isAuthPage = [
    "/sign-in", "/sign-up", "/verify", "/forgot-password", "/reset-password"
  ].some(path => pathname.startsWith(path));

  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/settings");
  const isForceLogout = pathname === "/sign-in" && url.searchParams.get("force") === "true";

  // A. Redirect Authenticated users away from Auth pages
  if (token && isAuthPage && !isForceLogout) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // B. Redirect Unauthenticated users away from Protected routes
  if (!token && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    // Optional: add callbackUrl so users return to dashboard after login
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.webp$|sitemap\\.xml$|robots\\.txt$).*)',
  ],
};