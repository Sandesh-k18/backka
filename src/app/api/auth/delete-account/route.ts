import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  await dbConnect();
  
  try {
    const session = await getServerSession(authOptions);

    // 1. Session check
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 2. Locate the user in the database
    // Using email from the session to ensure we delete the currently logged-in user
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    /**
     * OPTIONAL SECURITY CHECK:
     * If you want to ensure the user actually typed their username 
     * on the frontend to confirm, you can still expect a 'confirmation' string.
     * const { confirmation } = await request.json();
     * if (confirmation !== user.username) { ... return error ... }
     */

    // 3. The Final Purge
    const deletedUser = await UserModel.deleteOne({ _id: user._id });

    if (deletedUser.deletedCount === 0) {
        return NextResponse.json(
            { success: false, message: "Failed to delete account" },
            { status: 500 }
        );
    }

    return NextResponse.json(
      { success: true, message: "Account and data purged successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Purge Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during account termination" },
      { status: 500 }
    );
  }
}