
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  BlogItem,
  BlogListResponse,
  BlogQueryParams,
  BlogResponse,
} from "../_types/blog";

import type {
  BlogCreateFormData,
  BlogUpdateInput,
} from "../_schema/blog-schema";

const API_URL = "/api/v1/blogs";

// ==============================
// FORM DATA HELPER
// ==============================
const createFormData = (
  data: Record<string, unknown>,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof File !== "undefined" && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// ==============================
// ERROR HELPER
// ==============================
const getErrorMessage = (
  err: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }

  return "Network error";
};

// ==============================
// FETCH BLOGS
// ==============================
export const fetchBlogs = createAsyncThunk<
  BlogListResponse,
  BlogQueryParams | undefined,
  { rejectValue: string }
>(
  "blogs/fetchBlogs",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      if (params?.page) {
        query.append("page", String(params.page));
      }

      if (params?.limit) {
        query.append("limit", String(params.limit));
      }

      if (params?.search) {
        query.append("search", params.search);
      }

      const res = await axios.get<BlogListResponse>(
        `${API_URL}?${query.toString()}`,
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch blogs"),
      );
    }
  },
);

// ==============================
// CREATE BLOG
// ==============================
export const createBlog = createAsyncThunk<
  BlogItem,
  BlogCreateFormData,
  { rejectValue: string }
>(
  "blogs/createBlog",
  async (data, { rejectWithValue }) => {
    try {
      const formData = createFormData(data);

      const res = await axios.post<BlogResponse>(
        API_URL,
        formData,
      );

      toast.success(res.data.message);

      return res.data.data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to create blog",
      );

      toast.error(message);

      return rejectWithValue(message);
    }
  },
);

// ==============================
// FETCH BLOG BY ID OR SLUG
// ==============================
export const fetchBlog = createAsyncThunk<
  BlogItem,
  string,
  { rejectValue: string }
>(
  "blogs/fetchBlog",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get<BlogResponse>(
        `${API_URL}/${id}`,
      );

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch blog"),
      );
    }
  },
);

// ==============================
// UPDATE BLOG
// ==============================
export const updateBlog = createAsyncThunk<
  BlogItem,
  {
    id: string;
    data: BlogUpdateInput & { image?: File | null };
  },
  { rejectValue: string }
>(
  "blogs/updateBlog",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = createFormData(data);

      const res = await axios.patch<BlogResponse>(
        `${API_URL}/${id}`,
        formData,
      );

      toast.success(res.data.message);

      return res.data.data;
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Failed to update blog",
      );

      toast.error(message);

      return rejectWithValue(message);
    }
  },
);
