import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    // Cast the user session safely
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    // Convert string ID to Mongoose ObjectId
    // This is safe because _id never changes, unlike usernames.
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        // 1. Check if the user exists
        const userExists = await UserModel.findById(userId);
        
        if (!userExists) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // 2. Perform aggregation to get sorted messages
        // Since we match by _id, case-sensitivity of the username doesn't matter here.
        const userWithMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, 
            { $sort: { "messages.createdAt": -1 } }, 
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        // 3. Extract and filter messages
        // Aggregation returns an array, so we take the first element [0]
        const rawMessages = userWithMessages[0]?.messages || [];
        
        // Remove nulls (which can happen from preserveNullAndEmptyArrays if messages array was empty)
        const cleanMessages = rawMessages.filter((msg: any) => msg && msg._id);

        return Response.json({
            success: true,
            messages: cleanMessages
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching messages via aggregation:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}