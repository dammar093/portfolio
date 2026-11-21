import { createSlice } from "@reduxjs/toolkit";

import type { DashboardStats } from "../_types/dashboard";
import { fetchDashboardStats } from "./dashboard-thunk";

interface DashboardState {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard statistics";
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
