import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { DashboardStats } from "../_types/dashboard";

export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>("dashboard/fetchDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/v1/admin/dashboard");

    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard statistics",
      );
    }

    return rejectWithValue("Failed to fetch dashboard statistics");
  }
});
