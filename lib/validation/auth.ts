import * as z from "zod";

export const signInSchema = z.object({
  username: z
    .string({ error: "username is required" })
    .min(2, { error: "username should be at least 2 characters" })
    .max(50, { error: "username must be less than 50 characters" })
    .trim(),
  password: z
    .string({ error: "password is required" })
    .min(2, { error: "password should be at least 2 characters" })
    .max(50, { error: "password must be less than 50 characters" })
    .trim(),
});