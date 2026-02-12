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
    username: z.string(),
    email: z.email().min(1, "Email address is required"),
    password: z.string().min(1, "Password is required"),
    confirm_password: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
