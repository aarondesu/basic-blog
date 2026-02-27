import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const userSchema = z.object({
  uid: z.string().optional(),
  email: z.email().min(1, "Email is required"),
  username: z.string(),
  created_at: z.date().optional(),
});

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username is too short — use at least 4 characters."),
    email: z.email().min(1, "Email address is required"),
    password: z
      .string()
      .min(4, "Password is too short — use at least 4 characters."),
    confirm_password: z
      .string()
      .min(1, "Confirm Password is too short — use at least 4 characters."),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const blogSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  title: z.string().min(12, "Title is too short — use at least 4 characters."),
  image_url: z.string().optional(),
  body: z
    .string()
    .min(
      300,
      "Add more details to your post. The body needs at least 300 characters",
    ),
  createdAt: z.date().optional(),
});

export const commentInputSchema = z.object({
  user_id: z.string(),
  blog_id: z.number(),
  body: z.string().min(1, "Body is required"),
  image_url: z.string().optional(),
});
