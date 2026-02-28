import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

// The usernameValidation already contains .toLowerCase() 
// so the 'username' result from safeParse will be normalized.
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

        // Validate with Zod - this converts input to lowercase automatically
        const validatedUsernameResult = UsernameQuerySchema.safeParse(queryParam);

        if (!validatedUsernameResult.success) {
            const errorMessages = validatedUsernameResult.error.format().username?._errors || ["Invalid username"];
            return Response.json({
                success: false,
                message: errorMessages.join(", ")
            }, { status: 400 });
        }

        const { username } = validatedUsernameResult.data;

        // We check for ANY user with this username (verified or not) 
        // to prevent duplicate key errors in MongoDB since the field is unique.
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: "Username is unique"
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, { status: 500 });
    }
}