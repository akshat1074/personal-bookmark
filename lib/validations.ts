import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    handle: z
        .string()
        .min(3, "Handle must be at least 3 characters")
        .max(30, "Handle must be at most 30 characters")
        .regex(
            /^[a-z0-9_-]+$/,
            "Handle can only contain lowercase letters, numbers, hyphens, and underscores"
        ),
    name: z.string().min(1, "Name is required").max(100),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const bookmarkSchema = z.object({
    url: z.string().url("Must be a valid URL"),
    title: z.string().min(1, "Title is required").max(500),
    description: z.string().max(2000).optional(),
    isPublic: z.boolean().default(false),
});

export const updateBookmarkSchema = bookmarkSchema.partial();

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookmarkInput = z.infer<typeof bookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
