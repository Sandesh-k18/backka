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
    const pathname = url.pathname;

    // 1. HARD BYPASS: Static assets, Auth APIs, and Legal/Public pages
    if (
        pathname.startsWith('/_next') ||
        pathname.includes('/api/auth') ||
        pathname.endsWith('.xml') ||
        pathname.endsWith('.txt') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.ico') ||
        pathname === '/apis' ||           // Allow public API docs
        pathname === '/terms' ||          // Allow public Terms
        pathname === '/privacy-policy' || // Allow public Privacy
        pathname === '/faq' ||            // Allow public FAQ
        pathname === '/about'             // Allow public About
    ) {
        return NextResponse.next();
    }

    // 2. Ratelimiting Logic
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    try {
        const { success, limit, reset, remaining } = await ratelimit.limit(ip);

        if (!success) {
            return new NextResponse("Too Many Requests. Please wait.", {
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

        const isAuthPage =
            pathname.startsWith("/sign-in") ||
            pathname.startsWith("/sign-up") ||
            pathname.startsWith("/verify") ||
            pathname.startsWith("/forgot-password") ||
            pathname.startsWith("/reset-password");

        const isForceLogout = pathname === "/sign-in" && url.searchParams.get("force") === "true";

        // A. If Authenticated: Block them from Auth pages
        if (token && isAuthPage && !isForceLogout) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // B. If Unauthenticated: Block them from Dashboard/Settings
        if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/settings"))) {
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
        '/((?!api/auth|_next/static|_next/image|.*\\.webp$|sitemap\\.xml$|robots\\.txt$).*)',
    ],
};