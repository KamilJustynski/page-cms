import * as z from "zod";
import { PageStatus } from "@/generated/prisma/enums";

export const statusEnum = z.enum(PageStatus);

export const createPageSchema = z
  .object({
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
  })
  .meta({ id: "CreatePageInput" });

export const updatePageSchema = createPageSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  })
  .meta({ id: "UpdatePageInput" });

export const pageSchema = z
  .object({
    id: z.uuid(),
    slug: z.string(),
    title: z.string(),
    status: statusEnum,
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .meta({ id: "Page" });

export const problemSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number(),
    detail: z.string().optional(),
    code: z.enum([
      "SERVER_ERROR",
      "INVALID_JSON",
      "SLUG_CONFLICT",
      "NOT_FOUND",
      "INVALID_DATA",
    ]),
    invalidFields: z
      .array(z.object({ name: z.string(), reason: z.string() }))
      .optional(),
  })
  .meta({ id: "Problem" });

export const pageParamsSchema = z.object({
  id: z.uuid("Page id must be a valid UUID"),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type Status = z.infer<typeof statusEnum>;
export type ProblemSchema = z.infer<typeof problemSchema>;
