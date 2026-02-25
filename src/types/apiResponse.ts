import { Message } from "../model/User"

export interface ApiResponse {
    success: boolean,
    message: string, //email msg
    isAcceptingMessage?: boolean //optional
    messages?: Array<Message>//optional
}