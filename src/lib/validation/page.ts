import * as z from "zod";

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
  status: z
    .enum(
      ["draft", "published", "archived"],
      "Status must be one of: draft, published, archived",
    )
    .optional(),
});
