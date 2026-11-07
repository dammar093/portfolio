import { createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardStatsResponse } from "../_types/dashboard";

export const fetchDashboardStats = createAsyncThunk<
  DashboardStatsResponse["data"],
  void,
  { rejectValue: string }
>("dashboard/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/v1/dashboard");

    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }

    const data: DashboardStatsResponse = await res.json();

    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
