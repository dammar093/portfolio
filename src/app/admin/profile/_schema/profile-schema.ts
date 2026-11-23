import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name must not exceed 80 characters"),
});

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const verifyEmailChangeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the six digit code"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newPassword: z.string().min(8, "New password must be at least 8 characters").max(128),
  confirmPassword: z.string().min(1, "Confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;
export type VerifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
