import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                /* username: { label: "Username", type: "text", placeholder: "Enter your username" },
                 email: { label: "Email", type: "email", placeholder: "Enter your email" },
                 */
                identifier: { label: "Email or Username", type: "text", placeholder: "Enter your email or username" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }

            },
            async authorize(credentials): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.identifier }, {
                                username: credentials?.identifier
                            }
                        ]
                    });
                    if (!user) {
                        return null; // or throw new Error("No user found with the provided email or username");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your email before signing in.");
                    }
                    const isPasswordValid = await bcrypt.compare(
                        credentials?.password || "",
                        user.password
                    );
                    if (isPasswordValid) {
                        return {
                            id: user._id.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessages: user.isAcceptingMessage
                        }; // or return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Mapping the ID from authorize() to token._id
                token._id = user.id;
                token.username = user.username;
                // Note: If you want these in the token, 
                // the authorize() function must return them!
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                // CRITICAL: Ensure this matches what your API route is calling.
                // If API uses user._id, use session.user._id here.
                session.user._id = token._id as string;
                session.user.username = token.username as string;
                // Adding other fields if needed
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
            }
            return session;
        }

    },
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
};