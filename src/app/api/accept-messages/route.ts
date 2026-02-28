import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            // Match your Schema field name: 'isAcceptingMessage'
            { isAcceptingMessage: acceptMessages }, 
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user"
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            isAcceptingMessage: updatedUser.isAcceptingMessage,
            message: "Accept messages status updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error toggling message acceptance:", error);
        return Response.json({
            success: false,
            message: "Error toggling message acceptance"
        }, { status: 500 });
    }
}

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

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            // Ensure this key is consistent for your dashboard state
            isAcceptingMessage: foundUser.isAcceptingMessage 
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching message acceptance status:", error);
        return Response.json({
            success: false,
            message: "Error fetching message acceptance status"
        }, { status: 500 });
    }
}