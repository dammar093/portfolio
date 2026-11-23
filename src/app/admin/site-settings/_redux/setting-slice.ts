
import { createSlice } from "@reduxjs/toolkit";

import type { SettingState } from "../_types/setting";

import { fetchPublicSetting, fetchSetting, saveSetting } from "./setting-thunk";

const initialState: SettingState = {
  data: null,
  loading: false,
  submitting: false,
  error: null,
  publicData: null,
  publicLoading: false,
  publicError: null,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,

  reducers: {
    clearSettingError: (state) => {
      state.error = null;
    },

    resetSetting: (state) => {
      state.data = null;
      state.loading = false;
      state.submitting = false;
      state.error = null;
      state.publicData = null;
      state.publicLoading = false;
      state.publicError = null;
    },
  },

  extraReducers: (builder) => {
    // =====================================
    // FETCH SETTING
    // =====================================
    builder
      .addCase(fetchSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch setting";
      });

    // =====================================
    // SAVE SETTING
    // =====================================
    builder
      .addCase(saveSetting.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(saveSetting.fulfilled, (state, action) => {
        state.submitting = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(saveSetting.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || "Failed to save setting";
      });
    // =====================================
    // FETCH PUBLIC SETTING
    // =====================================
    builder
      .addCase(fetchPublicSetting.pending, (state) => {
        state.publicLoading = true;
        state.publicError = null;
      })
      .addCase(fetchPublicSetting.fulfilled, (state, action) => {
        state.publicLoading = false;
        state.publicData = action.payload;
        state.publicError = null;
      })
      .addCase(fetchPublicSetting.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError = action.payload || "Failed to fetch setting";
      });
  }
});

export const {
  clearSettingError,
  resetSetting,
} = settingSlice.actions;

export default settingSlice.reducer;
