import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { PageItem, PageListResponse, PageQueryParams, PageResponse } from "../_types/page";
import { toast } from "sonner";
import type {
  PageCreateFormData,
  PageUpdateFormData,
} from "../_schema/page-schema";

export const fetchPages = createAsyncThunk<
  PageListResponse,
  PageQueryParams | undefined,
  { rejectValue: string }
>("pages/fetchPages", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();

    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);

    const res = await axios.get<PageListResponse>(
      `/api/v1/admin/pages?${query.toString()}`
    );

    return res.data;
  } catch (err) {
    // Axios error handling
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch pages"
      );
    }

    return rejectWithValue("Network error");
  }
});



export const createPage = createAsyncThunk<
  PageItem,
  PageCreateFormData,
  { rejectValue: string }
>("pages/createPage", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const res = await axios.post<PageResponse>(
      "/api/v1/admin/pages",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success(res.data.message);

    // ✅ ALWAYS PageItem
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to create page";
      toast.error(message);
      return rejectWithValue(message);
    }
    toast.error("Network error");
    return rejectWithValue("Network error");
  }
});

export const fetchPage = createAsyncThunk<
  PageItem,
  string,
  { rejectValue: string }
>("pages/fetchPage", async (id, { rejectWithValue }) => {
  try {

    const res = await axios.get<PageResponse>(`/api/v1/admin/pages/${id}`);
    // ✅ ALWAYS PageItem
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch page"
      );
    }
    return rejectWithValue("Network error");
  }
});


export const updatePage = createAsyncThunk<
  PageItem,
  { id: string; data: PageUpdateFormData },
  { rejectValue: string }
>("pages/updatePage", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    const res = await axios.patch<PageResponse>(
      `/api/v1/admin/pages/${id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    toast.success(res.data.message);

    // ✅ ALWAYS PageItem
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to update page";
      toast.error(message);
      return rejectWithValue(message);
    }
    toast.error("Network error");
    return rejectWithValue("Network error");
  }
});


export const toggleStatusPage = createAsyncThunk<
  PageItem,
  string,
  { rejectValue: string }
>("pages/togglePage", async (id, { rejectWithValue }) => {
  try {

    const res = await axios.patch<PageResponse>(`/api/v1/admin/pages/${id}/toggle`);
    toast.success(res.data.message);
    // ✅ ALWAYS PageItem
    return res.data.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      toast.error(err.response?.data?.message || "Failed to toggle status page");
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status page"
      );
    }
    return rejectWithValue("Network error");
  }
});