import { ILoginUserPayload } from "@/types/auth-type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getCsrfToken } from "next-auth/react";

export const loginUserThunk = createAsyncThunk<
  void,
  ILoginUserPayload,
  { rejectValue: string }
>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        return rejectWithValue("Unable to start a secure login request.");
      }

      const { data } = await axios.post<{ redirectTo?: string }>(
        "/api/v1/auth/login",
        {
          ...payload,
          csrfToken,
          callbackUrl: "/admin/dashboard",
          json: "true",
        }
      );

      const redirectUrl = data.redirectTo
        ? new URL(data.redirectTo, window.location.origin)
        : null;
      if (!redirectUrl || redirectUrl.origin !== window.location.origin) {
        return rejectWithValue("The login request could not be completed.");
      }

      return;
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(
          error.response?.data.message ?? "Unable to sign in. Please try again."
        );
      }
      return rejectWithValue("Unable to sign in. Please try again.");
    }
  }
);

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        return rejectWithValue("Unable to start a secure logout request.");
      }

      const { data } = await axios.post<{ url?: string }>(
        "/api/v1/auth/logout",
        {
          csrfToken,
          callbackUrl: "/login",
          json: "true",
        }
      );

      if (!data.url || new URL(data.url, window.location.origin).origin !== window.location.origin) {
        return rejectWithValue("The logout request could not be completed.");
      }

      return;
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(
          error.response?.data.message ?? "Unable to sign out. Please try again."
        );
      }
      return rejectWithValue("Unable to sign out. Please try again.");
    }
  }
);