import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

export async function DELETE(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        // We simply set the messages array to an empty list []
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $set: { messages: [] } }
        );

        return Response.json({
            success: true,
            message: "All messages cleared successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Delete All Error:", error);
        return Response.json({
            success: false,
            message: "Error clearing messages"
        }, { status: 500 });
    }
}