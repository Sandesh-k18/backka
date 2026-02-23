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
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" }, { $sort: { "messages.createdAt": -1 } }, //sort messages by createdAt in descending order, so that latest messages come first
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 });
    } catch (error) {
        console.error("Error getting messages:", error);
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, { status: 500 });
    }
}