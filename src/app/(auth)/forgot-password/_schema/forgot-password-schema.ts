import { z } from "zod";

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const verifyPasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  code: z.string().regex(/^\d{6}$/, "Enter the six digit code"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirmPassword: z.string().min(1, "Confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type VerifyPasswordResetInput = z.infer<typeof verifyPasswordResetSchema>;
