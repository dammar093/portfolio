
import { z } from "zod";

// Convert FormData boolean strings into actual booleans
const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean(),
);

// ==============================
// CREATE TESTIMONIAL SCHEMA
// ==============================
export const testimonialCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),

  position: z
    .string()
    .trim()
    .min(1, "Position is required")
    .max(150, "Position must not exceed 150 characters"),

  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(150, "Company must not exceed 150 characters"),

  testimonial: z
    .string()
    .trim()
    .min(1, "Testimonial is required")
    .max(3000, "Testimonial must not exceed 3000 characters"),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .default(1),

  isActive: formBoolean.default(true),
});

// ==============================
// UPDATE TESTIMONIAL SCHEMA
// ==============================
export const testimonialUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .optional(),

  position: z
    .string()
    .trim()
    .min(1, "Position is required")
    .max(150, "Position must not exceed 150 characters")
    .optional(),

  company: z
    .string()
    .trim()
    .min(1, "Company is required")
    .max(150, "Company must not exceed 150 characters")
    .optional(),

  testimonial: z
    .string()
    .trim()
    .min(1, "Testimonial is required")
    .max(3000, "Testimonial must not exceed 3000 characters")
    .optional(),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .optional(),

  isActive: formBoolean.optional(),
});

// ==============================
// TYPES
// ==============================
export type TestimonialCreateInput = z.infer<
  typeof testimonialCreateSchema
>;

export type TestimonialUpdateInput = z.infer<
  typeof testimonialUpdateSchema
>;
