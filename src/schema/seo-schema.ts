import { z } from "zod";

const optionalImageSchema = z
  .custom<File>(
    (value) => typeof File !== "undefined" && value instanceof File,
    {
      message: "Image must be a valid file",
    },
  )
  .optional();

const schemaMarkupSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;

      try {
        const parsed: unknown = JSON.parse(value);

        return (
          typeof parsed === "object" &&
          parsed !== null &&
          !Array.isArray(parsed)
        );
      } catch {
        return false;
      }
    },
    {
      message: "Schema markup must be valid JSON",
    },
  );

export const seoUpdateSchema = z.object({
  og_ttile: z
    .string()
    .trim()
    .min(1, "SEO title is required")
    .max(70, "SEO title must be under 70 characters"),

  og_description: z
    .string()
    .trim()
    .min(1, "SEO description is required")
    .max(160, "SEO description must be under 160 characters"),

  keywords: z
    .string()
    .trim()
    .optional(),

  og_image: optionalImageSchema,

  schema_markup: schemaMarkupSchema,
});

export type SeoUpdateFormData = z.infer<typeof seoUpdateSchema>;
