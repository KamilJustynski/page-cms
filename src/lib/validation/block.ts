import * as z from "zod";

export const heroDataSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title must be at most 100 characters"),
    text: z
      .string()
      .trim()
      .min(1, "Text is required")
      .max(300, "Text must be at most 300 characters"),
    image: z.union([z.url(), z.string().startsWith("/")]).optional(),
  })
  .meta({ id: "HeroData" });

export const richTextDataSchema = z
  .object({
    html: z.string().min(1, "Rich text content is required"),
  })
  .meta({ id: "RichTextData" });

export const createBlockSchema = z
  .discriminatedUnion("type", [
    z.object({ type: z.literal("hero"), data: heroDataSchema }),
    z.object({ type: z.literal("richText"), data: richTextDataSchema }),
  ])
  .meta({ id: "CreateBlockInput" });

export const updateBlockSchema = z
  .discriminatedUnion("type", [
    z.object({
      type: z.literal("hero"),
      data: heroDataSchema
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
          message: "At least one field must be provided for update",
        }),
    }),
    z.object({
      type: z.literal("richText"),
      data: richTextDataSchema
        .partial()
        .refine((data) => Object.keys(data).length > 0, {
          message: "At least one field must be provided for update",
        }),
    }),
  ])
  .meta({ id: "UpdateBlockInput" });

export type HeroData = z.infer<typeof heroDataSchema>;
export type RichTextData = z.infer<typeof richTextDataSchema>;
export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
