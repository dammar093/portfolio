
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  TestimonialCreateInput,
  TestimonialItem,
  TestimonialQueryParams,
  TestimonialUpdateInput,
  TestimonialListResponse,
  TestimonialResponse,
} from "../_types/testimonial";

const API_URL = "/api/v1/testimonials";

// ==============================
// CREATE FORM DATA
// ==============================
const createFormData = (
  data: TestimonialCreateInput | TestimonialUpdateInput
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
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
// FETCH ALL TESTIMONIALS
// ==============================
export const fetchTestimonials = createAsyncThunk<
  TestimonialListResponse,
  TestimonialQueryParams | undefined,
  { rejectValue: string }
>(
  "testimonials/fetchTestimonials",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<TestimonialListResponse>(
        API_URL,
        { params }
      );

      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch testimonials")
      );
    }
  }
);

// ==============================
// FETCH SINGLE TESTIMONIAL
// ==============================
export const fetchTestimonial = createAsyncThunk<
  TestimonialItem,
  string,
  { rejectValue: string }
>(
  "testimonials/fetchTestimonial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<TestimonialResponse>(
        `${API_URL}/${id}`
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to fetch testimonial"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// CREATE TESTIMONIAL
// ==============================
export const createTestimonial = createAsyncThunk<
  TestimonialItem,
  TestimonialCreateInput,
  { rejectValue: string }
>(
  "testimonials/createTestimonial",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<TestimonialResponse>(
        API_URL,
        createFormData(data)
      );

      toast.success(
        response.data.message || "Testimonial created successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to create testimonial"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// UPDATE TESTIMONIAL
// ==============================
export const updateTestimonial = createAsyncThunk<
  TestimonialItem,
  { id: string; data: TestimonialUpdateInput },
  { rejectValue: string }
>(
  "testimonials/updateTestimonial",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<TestimonialResponse>(
        `${API_URL}/${id}`,
        createFormData(data)
      );

      toast.success(
        response.data.message || "Testimonial updated successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to update testimonial"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// DELETE TESTIMONIAL
// ==============================
export const deleteTestimonial = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "testimonials/deleteTestimonial",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);

      toast.success(
        response.data.message || "Testimonial deleted successfully"
      );

      return id;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete testimonial"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
