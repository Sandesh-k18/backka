import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id); //mongoose object id from string _id, since user._id is string but we need to query with mongoose object id for better performance during searching of messages array.

    try {
        // 1. First, check if the user actually exists in the DB to rule out ID mismatches
        const userExists = await UserModel.findById(userId);
        
        if (!userExists) {
            return Response.json({
                success: false,
                message: "User not found in database"
            }, { status: 404 });
        }

        // 2. Perform aggregation to get sorted messages
        const userWithMessages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } }, 
            { $sort: { "messages.createdAt": -1 } }, 
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        // 3. Extract messages safely
        // If messages array is empty or contains a null element (from unwind), return []
        const rawMessages = userWithMessages[0]?.messages || [];
        const cleanMessages = rawMessages.filter((msg: any) => msg && msg.content);

        return Response.json({
            success: true,
            messages: cleanMessages
        }, { status: 200 });

    } catch (error) {
        console.error("Error getting messages:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}