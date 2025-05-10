import { z } from "zod";

// Schema for validation in runtime for login
export const loginSchema = z.object({
    input: z.union([z.string(), z.string().email()]),
    password: z.string().min(8),
});
// Schema for user creation validation in runtime
export const userCreationSchema = z.object({
    username: z.string(),
    email: z.string().email(), // To check for a valid email
    password: z.string().min(8), // To check password is at least 8 characters lenght
});