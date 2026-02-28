import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must not exceed 20 characters")
    // 1. Normalize input immediately
    .trim()
    .toLowerCase() 
    // 2. Updated Regex: Removed A-Z because .toLowerCase() handles it
    .regex(/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/, "Username can only contain letters, numbers, underscores, and hyphens")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z
        .string()
        .email({ message: "Invalid email address" })
        .trim()
        .toLowerCase(), // Normalize email too!
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
})