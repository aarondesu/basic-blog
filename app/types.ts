import { z } from "zod";

import { loginSchema } from "./schemas";

export type LoginData = z.infer<typeof loginSchema>;
