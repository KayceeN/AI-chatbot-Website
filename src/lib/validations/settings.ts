import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or fewer"),
  avatarUrl: z
    .string()
    .url("Invalid URL")
    .refine((url) => url.startsWith("https://"), "URL must use HTTPS")
    .or(z.literal(""))
    .default(""),
});

export type ProfileValues = z.infer<typeof profileSchema>;
