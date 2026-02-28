import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        
        // 1. Decode and normalize to lowercase to match our new implementation
        const decodedUsername = decodeURIComponent(username).toLowerCase();

        // 2. Query with the normalized username
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // 3. Validation logic
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            // user.save() will respect your Schema middleware
            await user.save(); 
            
            return Response.json({
                success: true,
                message: "Verification successful"
            }, { status: 200 });

        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired. Please sign up again to get a new code."
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Invalid verification code"
            }, { status: 400 });
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, { status: 500 });
    }
}