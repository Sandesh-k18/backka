import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { identifier, token, password } = await request.json();

        // 1. Find user by email/username AND valid token
        const user = await UserModel.findOne({
            $or: [
                { email: identifier.toLowerCase() },
                { username: identifier.toLowerCase() }
            ],
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() } // Token must not be expired
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid token or identifier. Link may be expired." },
                { status: 400 }
            );
        }

        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Update user and CLEAN UP tokens
        user.password = hashedPassword;
        user.resetToken = undefined; // Use undefined to remove field (works with sparse index)
        user.resetTokenExpiry = undefined;

        await user.save();

        return NextResponse.json(
            { success: true, message: "Password updated successfully. You can now sign in." },
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}