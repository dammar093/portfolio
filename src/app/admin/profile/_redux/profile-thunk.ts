import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import type {
  ChangePasswordInput,
  ProfileMutationResponse,
  RequestEmailChangeInput,
  UpdateProfileInput,
  VerifyEmailChangeInput,
} from "../_types/profile";

async function runProfileMutation<R>(
  request: () => Promise<{ data: ProfileMutationResponse }>,
  fallback: string,
  rejectWithValue: (value: string) => R,
): Promise<ProfileMutationResponse | R> {
  try {
    const response = await request();
    toast.success(response.data.message || "Updated successfully");
    return response.data;
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || fallback
      : fallback;
    toast.error(message);
    return rejectWithValue(message);
  }
}

export const updateProfile = createAsyncThunk<ProfileMutationResponse, UpdateProfileInput, { rejectValue: string }>(
  "profile/updateProfile",
  (data, { rejectWithValue }) => runProfileMutation(() => axios.patch("/api/v1/auth/profile", data), "Failed to update account details", rejectWithValue),
);

export const requestEmailChange = createAsyncThunk<ProfileMutationResponse, RequestEmailChangeInput, { rejectValue: string }>(
  "profile/requestEmailChange",
  (data, { rejectWithValue }) => runProfileMutation(() => axios.post("/api/v1/auth/change-email", data), "Could not send a verification code", rejectWithValue),
);

export const verifyEmailChange = createAsyncThunk<ProfileMutationResponse, VerifyEmailChangeInput, { rejectValue: string }>(
  "profile/verifyEmailChange",
  (data, { rejectWithValue }) => runProfileMutation(() => axios.post("/api/v1/auth/change-email/verify", data), "Could not verify the email address", rejectWithValue),
);

export const changePassword = createAsyncThunk<ProfileMutationResponse, ChangePasswordInput, { rejectValue: string }>(
  "profile/changePassword",
  (data, { rejectWithValue }) => runProfileMutation(() => axios.patch("/api/v1/auth/change-password", data), "Failed to change password", rejectWithValue),
);
