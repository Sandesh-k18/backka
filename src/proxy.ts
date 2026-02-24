import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    // 1. If user IS logged in, don't let them access auth pages
    // Wrap all guest-only paths in the parenthesis
    if (token && 
        (url.pathname.startsWith("/sign-in") || 
         url.pathname.startsWith("/sign-up") || 
         url.pathname.startsWith("/verify") ||
         url.pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. If user is NOT logged in, don't let them access private pages
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = { //spaces matters
    matcher: ["/", "/sign-in", "/sign-up", "/verify/:path*", "/dashboard/:path*"]
};