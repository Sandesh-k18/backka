import mongoose, { Schema, Document } from "mongoose";

// 1. Message Interface
export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now }
});

// 2. User Interface
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
    resetToken?: string;
    resetTokenExpiry?: Date;
}

// 3. User Schema
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"], // Fixed typo in your error message
        unique: true,
        match: [/.+\@.+\..+/, "Email invalid"]
    },
    password: {
        type: String,
        required: [true, "Password required"],
        trim: true,
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],

    // RESET FIELDS
    resetToken: {
        type: String,
        required: false,
        // IMPORTANT: 'sparse' allows multiple null/undefined values 
        // while still keeping the unique constraint for actual tokens
        unique: true,
        sparse: true, 
        index: true 
    },
    resetTokenExpiry: {
        type: Date,
        required: false
    }
});

// 4. Model Export (Fixed typo in UserSchema name)
const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;