
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { SettingItem } from "../_types/setting";

const API_URL = "/api/v1/admin/settings";

// =====================================
// FETCH SETTING
// =====================================
export const fetchSetting = createAsyncThunk<
  SettingItem | null,
  void,
  { rejectValue: string }
>("setting/fetchSetting", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);

    return response.data.data as SettingItem | null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch setting",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});

// =====================================
// CREATE / UPDATE SETTING
// =====================================
export const saveSetting = createAsyncThunk<
  SettingItem,
  FormData,
  { rejectValue: string }
>("setting/saveSetting", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, formData);

    return response.data.data as SettingItem;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save setting",
      );
    }

    return rejectWithValue("Something went wrong");
  }
});
