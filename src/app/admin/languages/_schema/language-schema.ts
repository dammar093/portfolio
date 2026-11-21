
import { z } from "zod";

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
    .int()
    .min(1)
    .optional(),
});

export type LanguageCreateInput = z.infer<
  typeof languageCreateSchema
>;

export type LanguageUpdateInput = z.infer<
  typeof languageUpdateSchema
>;
