import { z } from "zod";

import { loginSchema, registerUserSchema, userSchema } from "./schemas";

export type User = z.infer<typeof userSchema>;

export type LoginData = z.infer<typeof loginSchema>;
export type ReigsterData = z.infer<typeof registerUserSchema>;
