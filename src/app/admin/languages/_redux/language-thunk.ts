
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  LanguageItem,
  LanguageListResponse,
  LanguageQueryParams,
  LanguageResponse,
} from "../_types/language";

import type {
  LanguageCreateInput,
  LanguageUpdateInput,
} from "../_schema/language-schema";

// ==============================
// FETCH ALL LANGUAGES
// ==============================
export const fetchLanguages = createAsyncThunk<
  LanguageListResponse,
  LanguageQueryParams | undefined,
  { rejectValue: string }
>("languages/fetchLanguages", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);

    const res = await axios.get<LanguageListResponse>(
      `/api/v1/languages?${query.toString()}`
    );

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch languages"
      );
    }

    return rejectWithValue("Network error");
  }
});

// ==============================
// CREATE LANGUAGE
// ==============================
export const createLanguage = createAsyncThunk<
  LanguageItem,
  LanguageCreateInput & { image?: File | null },
  { rejectValue: string }
>("languages/createLanguage", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const res = await axios.post<LanguageResponse>(
      "/api/v1/languages",
      formData
    );

    toast.success(res.data.message);

    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message || "Failed to create language";

      toast.error(message);
      return rejectWithValue(message);
    }

    toast.error("Network error");
    return rejectWithValue("Network error");
  }
});

// ==============================
// FETCH SINGLE LANGUAGE
// ==============================
export const fetchLanguage = createAsyncThunk<
  LanguageItem,
  string,
  { rejectValue: string }
>("languages/fetchLanguage", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get<LanguageResponse>(
      `/api/v1/languages/${id}`
    );

    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch language"
      );
    }

    return rejectWithValue("Network error");
  }
});

// ==============================
// UPDATE LANGUAGE
// ==============================
export const updateLanguage = createAsyncThunk<
  LanguageItem,
  { id: string; data: LanguageUpdateInput & { image?: File | null } },
  { rejectValue: string }
>("languages/updateLanguage", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const res = await axios.patch<LanguageResponse>(
      `/api/v1/languages/${id}`,
      formData
    );

    toast.success(res.data.message);

    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message || "Failed to update language";

      toast.error(message);
      return rejectWithValue(message);
    }

    toast.error("Network error");
    return rejectWithValue("Network error");
  }
});

// ==============================
// DELETE LANGUAGE
// ==============================
export const deleteLanguage = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("languages/deleteLanguage", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete<{
      success: boolean;
      message: string;
    }>(`/api/v1/languages/${id}`);

    toast.success(res.data.message);

    return id;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message =
        err.response?.data?.message || "Failed to delete language";

      toast.error(message);
      return rejectWithValue(message);
    }

    toast.error("Network error");
    return rejectWithValue("Network error");
  }
});
