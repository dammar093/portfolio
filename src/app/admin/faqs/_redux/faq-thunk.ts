
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  FAQCreateInput,
  FAQItem,
  FAQQueryParams,
  FAQUpdateInput,
  FAQListResponse,
  FAQResponse,
} from "../_types/faq";


// ==============================
// CREATE FORM DATA
// ==============================
const createFormData = (
  data: FAQCreateInput | FAQUpdateInput
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// ==============================
// ERROR MESSAGE HELPER
// ==============================
const getErrorMessage = (
  err: unknown,
  fallback: string
): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallback;
  }

  return err instanceof Error ? err.message : fallback;
};

// ==============================
// FETCH ALL FAQs
// ==============================
export const fetchFAQs = createAsyncThunk<
  FAQListResponse,
  FAQQueryParams | undefined,
  { rejectValue: string }
>(
  "faqs/fetchFAQs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<FAQListResponse>("/api/v1/admin/faqs", {
        params,
      });

      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch FAQs")
      );
    }
  }
);

// ==============================
// FETCH SINGLE FAQ
// ==============================
export const fetchFAQ = createAsyncThunk<
  FAQItem,
  string,
  { rejectValue: string }
>(
  "faqs/fetchFAQ",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<FAQResponse>(`/api/v1/admin/faqs/${id}`);

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to fetch FAQ"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// CREATE FAQ
// ==============================
export const createFAQ = createAsyncThunk<
  FAQItem,
  FAQCreateInput,
  { rejectValue: string }
>(
  "faqs/createFAQ",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<FAQResponse>(
        "/api/v1/admin/faqs",
        createFormData(data),
      );

      toast.success(
        response.data.message || "FAQ created successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to create FAQ"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// UPDATE FAQ
// ==============================
export const updateFAQ = createAsyncThunk<
  FAQItem,
  { id: string; data: FAQUpdateInput },
  { rejectValue: string }
>(
  "faqs/updateFAQ",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<FAQResponse>(
        `/api/v1/admin/faqs/${id}`,
        createFormData(data),
      );

      toast.success(
        response.data.message || "FAQ updated successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to update FAQ"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// DELETE FAQ
// ==============================
export const deleteFAQ = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "faqs/deleteFAQ",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/admin/faqs/${id}`);

      toast.success(
        response.data.message || "FAQ deleted successfully"
      );

      return id;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete FAQ"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
