import * as z from "zod";

export const signUpSchema = z.object({
    email: z
        .email({ message: "Invalid email address" })
        .min(1, { message: "Email is required" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" }),

    passwordConfirmation: z.string()
        .min(8, { message: "Confirm Password must be at least 8 characters long" })
})
    .refine(
        (data) => data.password === data.passwordConfirmation,
        {
            message: "Passwords do not match",
            path: ["passwordConfirmation"]
        }
    )