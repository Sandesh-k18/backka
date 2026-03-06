import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        // Validate with Zod - normalized to lowercase
        const validatedUsernameResult = UsernameQuerySchema.safeParse(queryParam);

        if (!validatedUsernameResult.success) {
            const errorMessages = validatedUsernameResult.error.format().username?._errors || ["Invalid username"];
            return Response.json({
                success: false,
                message: errorMessages.join(", ")
            }, { status: 400 });
        }

        const { username } = validatedUsernameResult.data;

        // -----------------------------------------------------------
        // TAKEOVER LOGIC: 
        // We only return 'success: false' if the username is taken by a VERIFIED user.
        // If it's held by an unverified user, your sign-up logic will delete them,
        // so we tell the new user that the name is available.
        // -----------------------------------------------------------
        const existingVerifiedUser = await UserModel.findOne({ 
            username, 
            isVerified: true 
        });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 200 }); // 200 status is better for a successful check result
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, { status: 500 });
    }
}