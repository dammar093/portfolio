import * as z from "zod";

export const pageSlug = [
  "projects",
  "blogs",
  "services",
  "about",
  "contact",
] as const;

const pageFieldsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_title: z.string().min(1, "Short title is required"),
  image: z.instanceof(File).optional().nullable(),
  order: z.number().int().min(1, "Order must be a positive integer"),
  description: z.string().min(1, "Description is required"),
});

export const pageFormSchema = pageFieldsSchema.extend({
  slug: z.union([z.enum(pageSlug), z.literal("")]).optional(),
});

export const pageCreateSchema = pageFieldsSchema.extend({
  slug: z.enum(pageSlug, { error: "Choose a page slug" }),
});

export const pageUpdateSchema = pageFieldsSchema.partial();

export type PageCreateFormData = z.infer<typeof pageCreateSchema>;
export type PageUpdateFormData = z.infer<typeof pageUpdateSchema>;
export type PageFormData = z.infer<typeof pageFormSchema>;
