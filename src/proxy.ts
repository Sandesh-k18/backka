import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Initialize Redis and Ratelimit (matches your API route style)
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

    // 2. Identify user by IP safely (Solving the .ip problem)
    // We check headers first (common in production), then fallback to local
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    try {
        // 3. APPLY RATE LIMITING
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

        // 4. AUTHENTICATION LOGIC
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        // If user IS logged in, keep them away from auth pages
        if (token) {
            if (
                url.pathname.startsWith("/sign-in") || 
                url.pathname.startsWith("/sign-up") || 
                url.pathname.startsWith("/verify")
            ) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        // If user is NOT logged in, keep them away from private pages
        if (!token && url.pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }

        return NextResponse.next();

    } catch (error) {
        // If Redis/Ratelimit fails, we let the request through to avoid locking out users
        console.error("Middleware Ratelimit Error:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/sign-in", 
        "/sign-up", 
        "/verify/:path*", 
        "/dashboard/:path*",
        "/api/:path*" 
    ]
};