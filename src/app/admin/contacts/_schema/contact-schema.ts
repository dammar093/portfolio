
import { z } from "zod";

export const contactSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),

  forWhat: z
    .string()
    .trim()
    .min(1, "Inquiry type is required"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required"),
});

export const contactQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().default(""),

  isSeen: z.enum(["true", "false"]).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactQueryInput = z.infer<
  typeof contactQuerySchema
>;
