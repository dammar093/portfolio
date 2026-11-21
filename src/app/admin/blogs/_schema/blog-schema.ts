
import { z } from "zod";

// ==============================
// FORM BOOLEAN
// ==============================
const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean(),
);

// ==============================
// SLUG VALIDATION
// ==============================
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain lowercase letters, numbers, and hyphens only",
  );

// ==============================
// SERVER CREATE SCHEMA
// ==============================
export const blogCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(50000),
  isActive: formBoolean.default(true),
});

// ==============================
// SERVER UPDATE SCHEMA
// ==============================
export const blogUpdateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200).optional(),
  slug: slugSchema.optional(),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(50000)
    .optional(),
  isActive: formBoolean.optional(),
});

// ==============================
// CLIENT FORM SCHEMA
// ==============================
export const blogFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),

  slug: slugSchema,

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(50000),

  isActive: z.boolean(),

  image: z
    .custom<File | undefined>(
      (value) =>
        value === undefined ||
        (typeof File !== "undefined" && value instanceof File),
      "Invalid image file",
    )
    .optional(),
});

// ==============================
// TYPES
// ==============================
export type BlogCreateInput = z.infer<typeof blogCreateSchema>;
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>;

export type BlogFormData = z.infer<typeof blogFormSchema>;

export type BlogCreateFormData = BlogFormData & {
  image: File;
};

// ==============================
// OPTIONAL STATIC SLUGS
// ==============================
export const blogs: string[] = [];
