
import { z } from "zod";

// ==============================
// EMPLOYMENT TYPE
// ==============================

export const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CONTRACT",
  "FREELANCE",
  "SELF_EMPLOYED",
] as const;

export type EmploymentType = (typeof employmentTypes)[number];

// ==============================
// IMAGE VALIDATION
// ==============================

const imageSchema = z
  .custom<File>(
    (value) =>
      typeof File !== "undefined" && value instanceof File,
    "Please select a valid image"
  )
  .nullable()
  .optional();

// ==============================
// CREATE SCHEMA
// ==============================

export const experienceCreateSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(150, "Company name must not exceed 150 characters"),

    position: z
      .string()
      .trim()
      .min(1, "Job position is required")
      .max(150, "Position must not exceed 150 characters"),

    employmentType: z.enum(employmentTypes),

    location: z
      .string()
      .trim()
      .max(150, "Location must not exceed 150 characters")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .min(1, "Experience description is required"),

    joinDate: z.coerce.date({
      error: "Joining date is required",
    }),

    leaveDate: z.coerce.date().nullable().optional(),

    isCurrent: z.boolean().default(false),

    order: z.coerce
      .number()
      .int("Order must be an integer")
      .min(1, "Order must be at least 1")
      .default(1),

    isActive: z.boolean().default(true),

    image: imageSchema,
  })
  .superRefine((data, ctx) => {
    if (Number.isNaN(data.joinDate.getTime())) {
      ctx.addIssue({
        code: "custom",
        path: ["joinDate"],
        message: "Please enter a valid joining date",
      });
    }

    if (
      data.leaveDate &&
      Number.isNaN(data.leaveDate.getTime())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Please enter a valid leaving date",
      });
    }

    if (data.isCurrent && data.leaveDate) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Current experience cannot have a leaving date",
      });
    }

    if (
      !data.isCurrent &&
      data.leaveDate &&
      data.leaveDate < data.joinDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Leaving date cannot be before joining date",
      });
    }

    if (!data.isCurrent && !data.leaveDate) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Leaving date is required for past experience",
      });
    }
  });

// ==============================
// UPDATE SCHEMA
// ==============================

export const experienceUpdateSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(150)
      .optional(),

    position: z
      .string()
      .trim()
      .min(1, "Job position is required")
      .max(150)
      .optional(),

    employmentType: z.enum(employmentTypes).optional(),

    location: z
      .string()
      .trim()
      .max(150)
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .trim()
      .min(1, "Experience description is required")
      .optional(),

    joinDate: z.coerce.date().optional(),

    leaveDate: z.coerce.date().nullable().optional(),

    isCurrent: z.boolean().optional(),

    order: z.coerce
      .number()
      .int("Order must be an integer")
      .min(1)
      .optional(),

    isActive: z.boolean().optional(),

    image: imageSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.joinDate &&
      Number.isNaN(data.joinDate.getTime())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["joinDate"],
        message: "Please enter a valid joining date",
      });
    }

    if (
      data.leaveDate &&
      Number.isNaN(data.leaveDate.getTime())
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Please enter a valid leaving date",
      });
    }

    if (data.isCurrent === true && data.leaveDate) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Current experience cannot have a leaving date",
      });
    }

    if (
      data.joinDate &&
      data.leaveDate &&
      data.leaveDate < data.joinDate
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["leaveDate"],
        message: "Leaving date cannot be before joining date",
      });
    }
  });

// ==============================
// FORM SCHEMA AND TYPES
// ==============================

export const experienceFormSchema = experienceCreateSchema;

export type ExperienceCreateInput = z.infer<
  typeof experienceCreateSchema
>;

export type ExperienceUpdateInput = z.infer<
  typeof experienceUpdateSchema
>;

export type ExperienceFormValues = z.infer<
  typeof experienceFormSchema
>;
