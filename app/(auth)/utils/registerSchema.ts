import z from "zod";

export const registerSchema = z.object({
    username: z.string().min(2, "username is required"),
    email: z.email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    agree: z.literal(true, { message: "You must agree to the terms" }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
