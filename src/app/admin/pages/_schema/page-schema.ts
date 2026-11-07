import * as z from "zod";

export const pages = [
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
  description: z.string().min(1, "Description is required"),
});

export const pageFormSchema = pageFieldsSchema.extend({
  slug: z.union([z.enum(pages), z.literal("")]).optional(),
});

export const pageCreateSchema = pageFieldsSchema.extend({
  slug: z.enum(pages, { error: "Choose a page slug" }),
});

export const pageUpdateSchema = pageFieldsSchema.partial();

export type PageCreateFormData = z.infer<typeof pageCreateSchema>;
export type PageUpdateFormData = z.infer<typeof pageUpdateSchema>;
export type PageFormData = z.infer<typeof pageFormSchema>;
