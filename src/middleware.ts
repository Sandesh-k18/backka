import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";



export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const url = request.nextUrl;

    if (token && (url.pathname.startsWith("/sign-in") || url.pathname === "/sign-up") || url.pathname.startsWith("/verify")) {
        //can use startsWith and === to check for the paths
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!token && (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/profile"))) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
}

export const config = {
    matcher: ["/", "/sign-in ", "/sign-up", "/verify/:path*", "/dashboard/:path*", "/profile/:path*"]
};