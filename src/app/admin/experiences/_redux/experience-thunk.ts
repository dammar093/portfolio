import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  ExperienceCreateInput,
  ExperienceItem,
  ExperienceQueryParams,
  ExperienceUpdateInput,
  ExperienceListResponse,
  ExperienceResponse,
} from "../_types/experience";

const API_URL = "/api/v1/experiences";

// ==============================
// CREATE FORM DATA
// ==============================
const createFormData = (
  data: ExperienceCreateInput | ExperienceUpdateInput
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    } else if (key === "leaveDate" && value === null) {
      // Explicitly send null to clear an existing leave date
      formData.append(key, "");
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
    return (
      err.response?.data?.message ||
      err.message ||
      fallback
    );
  }

  return err instanceof Error ? err.message : fallback;
};

// ==============================
// FETCH ALL EXPERIENCES
// ==============================
export const fetchExperiences = createAsyncThunk<
  ExperienceListResponse,
  ExperienceQueryParams | undefined,
  { rejectValue: string }
>(
  "experiences/fetchExperiences",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<ExperienceListResponse>(
        API_URL,
        { params }
      );

      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch experiences")
      );
    }
  }
);

// ==============================
// FETCH SINGLE EXPERIENCE
// ==============================
export const fetchExperience = createAsyncThunk<
  ExperienceItem,
  string,
  { rejectValue: string }
>(
  "experiences/fetchExperience",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<ExperienceResponse>(
        `${API_URL}/${id}`
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to fetch experience"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// CREATE EXPERIENCE
// ==============================
export const createExperience = createAsyncThunk<
  ExperienceItem,
  ExperienceCreateInput,
  { rejectValue: string }
>(
  "experiences/createExperience",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<ExperienceResponse>(
        API_URL,
        createFormData(data)
      );

      toast.success(
        response.data.message ||
          "Experience created successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to create experience"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// UPDATE EXPERIENCE
// ==============================
export const updateExperience = createAsyncThunk<
  ExperienceItem,
  { id: string; data: ExperienceUpdateInput },
  { rejectValue: string }
>(
  "experiences/updateExperience",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<ExperienceResponse>(
        `${API_URL}/${id}`,
        createFormData(data)
      );

      toast.success(
        response.data.message ||
          "Experience updated successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to update experience"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// DELETE EXPERIENCE
// ==============================
export const deleteExperience = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "experiences/deleteExperience",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`
      );

      toast.success(
        response.data.message ||
          "Experience deleted successfully"
      );

      return id;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete experience"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);