import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        const user = await UserModel.findById(session.user._id);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                { success: false, message: "Current password incorrect." },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        // --- THE FIX: MANUALLY DELETE COOKIES IN THE RESPONSE ---
        const response = NextResponse.json(
            { success: true, message: "Password updated!" },
            { status: 200 }
        );

        // Delete the session cookies for both development (http) and production (https)
        const cookieOptions = { path: "/", maxAge: 0 };
        response.cookies.set("next-auth.session-token", "", cookieOptions);
        response.cookies.set("__Secure-next-auth.session-token", "", cookieOptions);
        response.cookies.set("next-auth.callback-url", "", cookieOptions);
        response.cookies.set("next-auth.csrf-token", "", cookieOptions);

        return response;

    } catch (error: any) {
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}