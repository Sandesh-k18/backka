import { z } from "zod";

export const signInSchema = z.object({
    identifier: z
        .string()
        .trim()
        .toLowerCase(), // 👈 Normalizes both username and email to lowercase
    password: z
        .string()
        .min(1, "Password is required"), // Added a basic check
});