
import { z } from "zod";

const formBoolean = z.preprocess(
  (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  z.boolean(),
);

export const faqCreateSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(500, "Question must be less than 500 characters"),

  answer: z
    .string()
    .trim()
    .min(1, "Answer is required")
    .max(10000, "Answer must be less than 10000 characters"),

  order: z.coerce.number().int().min(1).default(1),

  isActive: formBoolean.default(true),
});

export const faqUpdateSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .optional(),

  answer: z
    .string()
    .trim()
    .min(1)
    .max(10000)
    .optional(),

  order: z.coerce.number().int().min(1).optional(),

  isActive: formBoolean.optional(),
});

export type FAQCreateInput = z.infer<typeof faqCreateSchema>;
export type FAQUpdateInput = z.infer<typeof faqUpdateSchema>;
