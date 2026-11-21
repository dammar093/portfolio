import { z } from "zod";

// ==========================================
// FORMDATA BOOLEAN
// ==========================================
const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean(),
);

// ==========================================
// FORMDATA NUMBER
// ==========================================
const formNumber = z.preprocess(
  (value) => {
    if (typeof value === "string" && value.trim() !== "") {
      return Number(value);
    }

    return value;
  },
  z.number().int().min(1, "Order must be at least 1"),
);

// ==========================================
// LANGUAGE IDS
// ==========================================
const languageIdsSchema = z
  .array(z.string().uuid("Invalid language ID"))
  .default([]);

const formLanguageIds = z.preprocess((value) => {
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return parsed;
    } catch {
      return [];
    }
  }

  return value;
}, languageIdsSchema);

// ==========================================
// SLUG
// ==========================================
const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(200, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens",
  );

// ==========================================
// IMAGE
// ==========================================
const imageSchema = z.custom<File | undefined>(
  (value) =>
    value === undefined ||
    (typeof File !== "undefined" && value instanceof File),
  "Invalid image",
);

// ==========================================
// API CREATE SCHEMA
// ==========================================
export const projectCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),

  slug: slugSchema,

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(50000),

  link: z
    .string()
    .trim()
    .min(1, "Project link is required")
    .max(2000),

  order: formNumber,

  isActive: formBoolean,

  languageIds: formLanguageIds,
});

// ==========================================
// API UPDATE SCHEMA
// ==========================================
export const projectUpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),

  slug: slugSchema.optional(),

  description: z.string().trim().min(1).max(50000).optional(),

  link: z.string().trim().min(1).max(2000).optional(),

  order: formNumber.optional(),

  isActive: formBoolean.optional(),

  languageIds: formLanguageIds.optional(),
});

// ==========================================
// CLIENT FORM SCHEMA
// ==========================================
export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),

  slug: slugSchema,

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(50000),

  link: z
    .string()
    .trim()
    .min(1, "Project link is required")
    .max(2000),

  order: z.number().int().min(1, "Order must be at least 1"),

  isActive: z.boolean(),

  image: imageSchema.optional(),

  languageIds: z.array(z.string().uuid("Invalid language ID")).default([]),
});

// ==========================================
// TYPES
// ==========================================

// API input/output
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

// Client form input and validated output
export type ProjectFormInput = z.input<typeof projectFormSchema>;
export type ProjectFormData = z.output<typeof projectFormSchema>;

// Create requires an image
export type ProjectCreateFormData = ProjectFormData & {
  image: File;
};