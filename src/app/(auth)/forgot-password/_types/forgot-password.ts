import type { RequestPasswordResetInput, VerifyPasswordResetInput } from "../_schema/forgot-password-schema";

export type { RequestPasswordResetInput, VerifyPasswordResetInput };

export interface PasswordResetResponse {
  message: string;
}

export type PasswordResetAction = "idle" | "requestCode" | "verifyCode";

export interface PasswordResetState {
  submitting: boolean;
  activeAction: PasswordResetAction;
  error: string | null;
}
