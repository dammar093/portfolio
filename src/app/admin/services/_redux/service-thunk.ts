
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  ServiceCreateInput,
  ServiceItem,
  ServiceQueryParams,
  ServiceUpdateInput,
  ServiceListResponse,
  ServiceResponse,
} from "../_types/service";

const API_URL = "/api/v1/services";

// ==============================
// CREATE FORM DATA
// ==============================
const createFormData = (
  data: ServiceCreateInput | ServiceUpdateInput
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
    return (
      err.response?.data?.message ||
      err.message ||
      fallback
    );
  }

  return err instanceof Error ? err.message : fallback;
};

// ==============================
// FETCH ALL SERVICES
// ==============================
export const fetchServices = createAsyncThunk<
  ServiceListResponse,
  ServiceQueryParams | undefined,
  { rejectValue: string }
>(
  "services/fetchServices",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<ServiceListResponse>(
        API_URL,
        { params }
      );

      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch services")
      );
    }
  }
);

// ==============================
// FETCH SINGLE SERVICE
// ==============================
export const fetchService = createAsyncThunk<
  ServiceItem,
  string,
  { rejectValue: string }
>(
  "services/fetchService",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<ServiceResponse>(
        `${API_URL}/${id}`
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to fetch service"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// CREATE SERVICE
// ==============================
export const createService = createAsyncThunk<
  ServiceItem,
  ServiceCreateInput,
  { rejectValue: string }
>(
  "services/createService",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<ServiceResponse>(
        API_URL,
        createFormData(data)
      );

      toast.success(
        response.data.message || "Service created successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to create service"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// UPDATE SERVICE
// ==============================
export const updateService = createAsyncThunk<
  ServiceItem,
  { id: string; data: ServiceUpdateInput },
  { rejectValue: string }
>(
  "services/updateService",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<ServiceResponse>(
        `${API_URL}/${id}`,
        createFormData(data)
      );

      toast.success(
        response.data.message || "Service updated successfully"
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to update service"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ==============================
// DELETE SERVICE
// ==============================
export const deleteService = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "services/deleteService",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${id}`
      );

      toast.success(
        response.data.message || "Service deleted successfully"
      );

      return id;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete service"
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
