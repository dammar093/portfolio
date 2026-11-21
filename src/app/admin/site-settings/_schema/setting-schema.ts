
import { z } from "zod";

export const settingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .max(20, "Phone number must not exceed 20 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  address: z
    .string()
    .trim()
    .min(3, "Address is required"),

  g_tag: z.string().trim().default(""),

  linkedin_link: z.string().trim().url().or(z.literal("")).default(""),
  github_link: z.string().trim().url().or(z.literal("")).default(""),
  youtube_link: z.string().trim().url().or(z.literal("")).default(""),
  facebook_link: z.string().trim().url().or(z.literal("")).default(""),
  instagram_link: z.string().trim().url().or(z.literal("")).default(""),
});

export type SettingFormInput = z.input<typeof settingSchema>;
export type SettingFormData = z.output<typeof settingSchema>;

// =====================================
// DEFAULT FORM VALUES
// =====================================
export const settingDefaultValues: SettingFormInput = {
  name: "",
  email: "",
  phone: "",
  description: "",
  address: "",
  g_tag: "",
  linkedin_link: "",
  github_link: "",
  youtube_link: "",
  facebook_link: "",
  instagram_link: "",
};
