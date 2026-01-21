import { resend } from "../lib/resend";

import VerificationEmail from "@/emails/verificationEmail";

import { ApiResponse } from "../types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: "<onboarding@resend.dev>",
            to: email, //['delivered@resend.dev']
            subject: "Backka | Verification code",
            react: VerificationEmail({ username: username, otp: verifyCode }),
        });
        return {
            success: true, message: "Verification email sent successfully"
        }
    } catch (emailError) {
        console.error("Email resend error", emailError)
        return {
            success: false, message: "Failed to send verification email"
        }
    }

}