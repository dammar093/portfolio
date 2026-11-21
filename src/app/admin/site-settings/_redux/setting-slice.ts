
import { createSlice } from "@reduxjs/toolkit";

import type { SettingState } from "../_types/setting";

import {
  fetchSetting,
  saveSetting,
} from "./setting-thunk";

const initialState: SettingState = {
  data: null,
  loading: false,
  submitting: false,
  error: null,
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
      })
      .addCase(fetchSetting.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch setting";
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
      })
      .addCase(saveSetting.rejected, (state, action) => {
        state.submitting = false;
        state.error =
          action.payload || "Failed to save setting";
      });
  },
});

export const {
  clearSettingError,
  resetSetting,
} = settingSlice.actions;

export default settingSlice.reducer;
