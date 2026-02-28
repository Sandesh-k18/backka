import { resend } from "@/src/lib/resend";
import ResetPasswordEmail from "@/emails/resetPasswordEmail";
import { ApiResponse } from "@/src/types/apiResponse";

export async function sendResetPasswordEmail(
  email: string,
  username: string,
  resetToken: string
): Promise<ApiResponse> {
  try {
    // 1. Fallback to localhost if NEXTAUTH_URL is missing in .env
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    console.log(`>>> Attempting to send email to: ${email}`);
    console.log(`>>> Generated Link: ${resetLink}`);

    // 2. Capture the actual response from Resend
    const { data, error } = await resend.emails.send({
      from: 'backKA <noreply@backka.sandeshkharel.com.np>', 
      to: email,
      subject: 'backKA | Reset Your Password',
      react: ResetPasswordEmail({ username, resetLink }),
    });

    if (error) {
      console.error(">>> RESEND API ERROR:", error);
      return { success: false, message: error.message };
    }

    console.log(">>> RESEND SUCCESS DATA:", data);
    return { success: true, message: "Reset email sent successfully." };
    
  } catch (emailError: any) {
    console.error(">>> CRITICAL HELPER ERROR:", emailError.message);
    return { success: false, message: "Internal mailer error." };
  }
}