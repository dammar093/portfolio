import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import type { PasswordResetResponse, RequestPasswordResetInput, VerifyPasswordResetInput } from "../_types/forgot-password";

export const requestPasswordResetCode = createAsyncThunk<PasswordResetResponse, RequestPasswordResetInput, { rejectValue: string }>(
  "passwordReset/requestCode",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/auth/forgot-password", data);
      const result = response.data as PasswordResetResponse;
      toast.success(result.message || "If an account exists, a verification code has been sent.");
      return result;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not send a verification code"
        : "Could not send a verification code";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const verifyPasswordResetCode = createAsyncThunk<PasswordResetResponse, VerifyPasswordResetInput, { rejectValue: string }>(
  "passwordReset/verifyCode",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/auth/forgot-password/verify", data);
      const result = response.data as PasswordResetResponse;
      toast.success(result.message || "Password reset successfully");
      return result;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Could not reset your password"
        : "Could not reset your password";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);
