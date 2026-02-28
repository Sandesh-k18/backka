import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";

export async function POST(request: Request) {
    await dbConnect();
    
    try {
        const { username, content } = await request.json();

        // Normalize the username to lowercase to match our Schema/Sitemap logic
        const normalizedUsername = username.toLowerCase();

        const user = await UserModel.findOne({ username: normalizedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check if the user is currently accepting messages
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, { status: 403 });
        }

        const newMessage = {
            content,
            createdAt: new Date()
        };

        // Push the new message into the user's messages array
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error sending message:", error);
        return Response.json({
            success: false,
            message: "Error sending message"
        }, { status: 500 });
    }
}