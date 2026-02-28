import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { sendResetPasswordEmail } from "@/src/helpers/sendResetPasswordEmail";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email } = await request.json();
        const user = await UserModel.findOne({ email: email.toLowerCase() });

        // Security: Don't confirm user existence, but still run the flow logic
        if (!user) {
            return NextResponse.json(
                { success: true, message: "If an account exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        user.resetToken = resetToken;
        user.resetTokenExpiry = expiry;
        await user.save();

        // Send Email
        const emailResponse = await sendResetPasswordEmail(
            user.email,
            user.username,
            resetToken
        );

        if (!emailResponse.success) {
            console.log(">>> Email failed to trigger:", emailResponse.message);
            // We return 500 so the frontend toast shows an error
            return NextResponse.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Reset link sent to your email." },
            { status: 200 }
        );

    } catch (error: any) {
        console.error(">>> Forgot password API route error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}