import { z } from "zod";

import {
  blogSchema,
  commentInputSchema,
  loginSchema,
  registerUserSchema,
  userSchema,
} from "./schemas";

export type User = z.infer<typeof userSchema>;

export type LoginData = z.infer<typeof loginSchema>;
export type ReigsterData = z.infer<typeof registerUserSchema>;
export type BlogData = z.infer<typeof blogSchema>;
export type CommentInput = z.infer<typeof commentInputSchema>;
