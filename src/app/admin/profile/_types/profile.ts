import type {
  ChangePasswordInput,
  RequestEmailChangeInput,
  UpdateProfileInput,
  VerifyEmailChangeInput,
} from "../_schema/profile-schema";

export type { ChangePasswordInput, RequestEmailChangeInput, UpdateProfileInput, VerifyEmailChangeInput };

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
}

export interface ProfileMutationResponse {
  message: string;
  user?: ProfileUser;
}

export type ProfileAction = "idle" | "updateProfile" | "requestEmailChange" | "verifyEmailChange" | "changePassword";

export interface ProfileState {
  submitting: boolean;
  activeAction: ProfileAction;
  error: string | null;
}
