
import { z } from "zod";

// ==============================
// IMAGE VALIDATION
// ==============================
const imageSchema = z
  .instanceof(File)
  .nullable()
  .optional();

// ==============================
// CREATE SERVICE SCHEMA
// ==============================
export const serviceCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Service title is required")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Service description is required"),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .default(1),

  image: imageSchema,
});

// ==============================
// UPDATE SERVICE SCHEMA
// ==============================
export const serviceUpdateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Service title is required")
    .max(150, "Title must not exceed 150 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Service description is required")
    .optional(),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .optional(),

  image: imageSchema,
});

// ==============================
// FORM SCHEMA
// ==============================
export const serviceFormSchema = serviceCreateSchema.extend({
  image: imageSchema,
});

// ==============================
// TYPES
// ==============================
export type ServiceCreateInput = z.infer<
  typeof serviceCreateSchema
>;

export type ServiceUpdateInput = z.infer<
  typeof serviceUpdateSchema
>;

export type ServiceFormValues = z.infer<
  typeof serviceFormSchema
>;
