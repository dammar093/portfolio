
import { createSlice } from "@reduxjs/toolkit";

import {
  createLanguage,
  fetchLanguage,
  fetchLanguages,
  updateLanguage,
  deleteLanguage,
} from "./language-thunk";

import type {
  LanguageItem,
  LanguagePaginationMeta,
} from "../_types/language";

interface LanguagesState {
  data: LanguageItem[];
  currentLanguage: LanguageItem | null;
  meta: LanguagePaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: LanguagesState = {
  data: [],
  currentLanguage: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: true,
  listError: null,
};

const languagesSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // ==============================
    // FETCH ALL LANGUAGES
    // ==============================
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.listError = action.payload ?? "Something went wrong";
      })

      // ==============================
      // CREATE LANGUAGE
      // ==============================
      .addCase(createLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data.unshift(action.payload);

        if (state.meta) {
          state.meta.total += 1;
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(createLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // ==============================
      // FETCH SINGLE LANGUAGE
      // ==============================
      .addCase(fetchLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentLanguage = null;
      })
      .addCase(fetchLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentLanguage = action.payload;
      })
      .addCase(fetchLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // ==============================
      // UPDATE LANGUAGE
      // ==============================
      .addCase(updateLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const index = state.data.findIndex(
          (language) => language.id === action.payload.id
        );

        if (index !== -1) {
          state.data[index] = action.payload;
        }

        if (state.currentLanguage?.id === action.payload.id) {
          state.currentLanguage = action.payload;
        }
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })

      // ==============================
      // DELETE LANGUAGE
      // ==============================
      .addCase(deleteLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.data = state.data.filter(
          (language) => language.id !== action.payload
        );

        if (state.currentLanguage?.id === action.payload) {
          state.currentLanguage = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(deleteLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default languagesSlice.reducer;
