import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(4, "Username must be atleast 4 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+$/, "Username must not contain special characters ") // if there is only one variable that need to be validated

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string(). min(6, {message: "Password must be atleast 6 characters"})
}) // if there is more than one variable that need to be validated