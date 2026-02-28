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
                identifier: { label: "Identifier", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<any> {
                await dbConnect();
                const identifier = credentials?.identifier?.toLowerCase();
                const user = await UserModel.findOne({
                    $or: [{ email: identifier }, { username: identifier }]
                });

                if (!user) throw new Error("User not found");

                const isValid = await bcrypt.compare(credentials?.password || "", user.password);
                if (!isValid) throw new Error("Incorrect password");

                return {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    isVerified: user.isVerified,
                    isAcceptingMessage: user.isAcceptingMessage
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user.id;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
            }
            return session;
        }
    },
    pages: { signIn: "/sign-in" },
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET
};