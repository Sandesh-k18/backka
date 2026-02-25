import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { User } from "next-auth";

// Notice the type change for params: it is now a Promise
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ messageid: string }> }
) {
    // 1. You MUST await params in Next.js 15/16
    const { messageid } = await params;

    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            {
                // messageid is now string, MongoDB handles the conversion to ObjectId
                $pull: { messages: { _id: messageid } }
            }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Delete Error:", error);
        return Response.json({
            success: false,
            message: "Error deleting message"
        }, { status: 500 });
    }
}