import * as z from "zod";
import { PageStatus } from "@/generated/prisma/enums";

export const statusEnum = z.enum(PageStatus);

export const createPageSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(100, "Slug must be at most 100 characters")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug must be lowercase, alphanumeric, and can include hyphens between words",
    ),
  status: statusEnum.optional(),
});

export const updatePageSchema = createPageSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type Status = z.infer<typeof statusEnum>;
