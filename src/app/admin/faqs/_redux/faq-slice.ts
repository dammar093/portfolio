
import { createSlice } from "@reduxjs/toolkit";

import type {
  FAQItem,
  FAQPaginationMeta,
} from "../_types/faq";

import {
  fetchFAQs,
  fetchFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "./faq-thunk";

interface FAQsState {
  data: FAQItem[];
  currentFAQ: FAQItem | null;
  meta: FAQPaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: FAQsState = {
  data: [],
  currentFAQ: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: false,
  listError: null,
};

const faqSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    clearCurrentFAQ: (state) => {
      state.currentFAQ = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==============================
      // FETCH FAQs
      // ==============================
      .addCase(fetchFAQs.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload || "Failed to fetch FAQs";
      })

      // ==============================
      // FETCH SINGLE FAQ
      // ==============================
      .addCase(fetchFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFAQ = action.payload;
      })
      .addCase(fetchFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch FAQ";
      })

      // ==============================
      // CREATE FAQ
      // ==============================
      .addCase(createFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFAQ = action.payload;
      })
      .addCase(createFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to create FAQ";
      })

      // ==============================
      // UPDATE FAQ
      // ==============================
      .addCase(updateFAQ.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFAQ.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFAQ = action.payload;

        state.data = state.data.map((faq) =>
          faq.id === action.payload.id ? action.payload : faq
        );
      })
      .addCase(updateFAQ.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update FAQ";
      })

      // ==============================
      // DELETE FAQ
      // ==============================
      .addCase(deleteFAQ.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteFAQ.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (faq) => faq.id !== action.payload
        );

        if (state.currentFAQ?.id === action.payload) {
          state.currentFAQ = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(deleteFAQ.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to delete FAQ";
      });
  },
});

export const { clearCurrentFAQ } = faqSlice.actions;

export default faqSlice.reducer;
