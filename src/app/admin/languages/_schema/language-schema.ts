
import { z } from "zod";

// Convert FormData string values into actual booleans
const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean()
);

export const languageCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Language name is required")
    .max(100, "Language name is too long"),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .default(1),

  isActive: formBoolean.default(true),
});

export const languageUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Language name is required")
    .max(100, "Language name is too long")
    .optional(),

  order: z.coerce
    .number()
    .int("Order must be an integer")
    .min(1, "Order must be at least 1")
    .optional(),

  isActive: formBoolean.optional(),
});

export type LanguageCreateInput = z.infer<
  typeof languageCreateSchema
>;

export type LanguageUpdateInput = z.infer<
  typeof languageUpdateSchema
>;
