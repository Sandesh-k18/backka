import mongoose, { Schema, Document } from "mongoose"; //Schema instead of repeated mongoose.Schema, Document = records in db

export interface Message extends Document { //interface datatype which is a record in db
    content: string, //string in ts in small leter, but capital in mongoose
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({ // schema is of type <Message>
    content: {
        type: String, //capital in mongoose
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[] //message is stored along with user credentials
}
const UserSchmea: Schema<User> = new Schema({
    username: {
        type: String,
        requird: [true, "Username required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Username required"],
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
    messages: [MessageSchema]

})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchmea))

//is Schema already present || if not create Schema

export default UserModel;
