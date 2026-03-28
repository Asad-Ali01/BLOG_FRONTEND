import { z } from "zod";

export const loginSchema = z
.object({
  username: z.string().min(5, "Username must be at least 5 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
