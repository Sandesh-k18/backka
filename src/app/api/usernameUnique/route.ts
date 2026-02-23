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
        }

        const validatedUsernameResult = UsernameQuerySchema.safeParse(queryParam);

        if (!validatedUsernameResult.success) {
            const errorMessages = validatedUsernameResult.error.format().username?._errors || ["Invalid username"];
            return Response.json({
                success: false,
                message: errorMessages.join(", ")
            }, { status: 400 });
        }

        const {username} = validatedUsernameResult.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already exists"
            }, { status: 409 });
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 });
    } catch (error) {
        console.log("Error checking username")
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, { status: 500 });
    }
}