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

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;

    // 1. HARD BYPASS: Static assets and Auth APIs
    if (
        url.pathname.startsWith('/_next') ||
        url.pathname.includes('/api/auth') ||
        url.pathname.endsWith('.xml') ||
        url.pathname.endsWith('.txt') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.ico')
    ) {
        return NextResponse.next();
    }

    // 2. Identify user by IP for Ratelimiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    try {
        const { success, limit, reset, remaining } = await ratelimit.limit(ip);

        if (!success) {
            return new NextResponse("Too Many Requests. Please wait a moment.", {
                status: 429,
                headers: {
                    "X-Ratelimit-Limit": limit.toString(),
                    "X-Ratelimit-Remaining": remaining.toString(),
                    "X-Ratelimit-Reset": reset.toString(),
                },
            });
        }

        // 3. AUTHENTICATION LOGIC
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // A. THE BYPASS KEY: Check if we are forcing a logout
        const isForceLogout = url.pathname === "/sign-in" && url.searchParams.get("force") === "true";

        // B. Redirect logic for AUTHENTICATED users
        if (token) {
            // If they are logged in, keep them away from auth pages
            // UNLESS it's our specific force-logout bypass
            if (!isForceLogout) {
                if (
                    url.pathname.startsWith("/sign-in") ||
                    url.pathname.startsWith("/sign-up") ||
                    url.pathname.startsWith("/verify") ||
                    url.pathname.startsWith("/forgot-password") ||
                    url.pathname.startsWith("/reset-password")
                ) {
                    return NextResponse.redirect(new URL("/dashboard", request.url));
                }
            }
        }

        // C. Redirect logic for UNAUTHENTICATED users
        // This protects ALL dashboard routes (including /dashboard/settings)
        if (!token && url.pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware Error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|backka.webp|og-image.webp|sitemap.xml|robots.txt).*)',
    ],
};