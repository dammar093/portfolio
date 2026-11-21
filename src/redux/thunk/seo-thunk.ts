import { SeoType } from "@/generated/prisma/enums";
import { SeoUpdateFormData } from "@/schema/seo-schema";
import { SeoItem, SeoResponse } from "@/types/seo-type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

interface SeoThunkPayload {
  relatedId: string;
  seoType: SeoType;
}

interface UpdateSeoThunkPayload extends SeoThunkPayload {
  data: SeoUpdateFormData;
}

interface ApiErrorResponse {
  message?: string | string[];
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || error.message || fallback;
};

/* ---------------- Update SEO ---------------- */

export const updateSeo = createAsyncThunk<
  SeoItem,
  UpdateSeoThunkPayload,
  { rejectValue: string }
>("seo/update", async ({ relatedId, seoType, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("og_ttile", data.og_ttile.trim());
    formData.append("og_description", data.og_description.trim());

    // Always append optional strings so existing values can be cleared.
    formData.append("keywords", data.keywords?.trim() ?? "");
    formData.append("schema_markup", data.schema_markup?.trim() ?? "");

    if (data.og_image instanceof File) {
      formData.append("og_image", data.og_image);
    }

    const response = await axios.patch<SeoResponse>(
      `/api/v1/admin/seo/${relatedId}/${seoType}`,
      formData,
    );

    toast.success(response.data.message || "SEO updated successfully");

    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update SEO");

    toast.error(message);

    return rejectWithValue(message);
  }
});

/* ---------------- Fetch SEO ---------------- */

export const fetchSeo = createAsyncThunk<
  SeoItem,
  SeoThunkPayload,
  { rejectValue: string }
>("seo/get", async ({ relatedId, seoType }, { rejectWithValue }) => {
  try {
    const response = await axios.get<SeoResponse>(
      `/api/v1/admin/seo/${relatedId}/${seoType}`,
    );

    return response.data.data;
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to fetch SEO");

    toast.error(message);

    return rejectWithValue(message);
  }
});
