import { z } from "zod";

export const createKBEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
});

export const updateKBEntrySchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long")
    .optional(),
  content: z.string().min(1, "Content is required").optional(),
});

export const deleteKBEntrySchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type CreateKBEntry = z.infer<typeof createKBEntrySchema>;
export type UpdateKBEntry = z.infer<typeof updateKBEntrySchema>;
export type DeleteKBEntry = z.infer<typeof deleteKBEntrySchema>;
