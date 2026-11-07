import { createSlice } from "@reduxjs/toolkit";
import { SeoItem } from "@/types/seo-type";
import { fetchSeo, updateSeo } from "../thunk/seo-thunk";

/* ---------------------------------- */
/* State */
/* ---------------------------------- */

interface SeoState {
  item: SeoItem | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: SeoState = {
  item: null,
  loading: false,
  saving: false,
  error: null,
};

/* ---------------------------------- */
/* Slice */
/* ---------------------------------- */

const seoSlice = createSlice({
  name: "seo",
  initialState,

  reducers: {
    clearSeoError: (state) => {
      state.error = null;
    },

    resetSeoState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      /* ---------------- Fetch SEO ---------------- */

      .addCase(fetchSeo.pending, (state) => {
        state.loading = true;
        state.error = null;

        // Prevent the previous SEO record from hydrating the form.
        state.item = null;
      })
      .addCase(fetchSeo.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
        state.error = null;
      })
      .addCase(fetchSeo.rejected, (state, action) => {
        state.loading = false;
        state.item = null;
        state.error = action.payload ?? "Failed to fetch SEO";
      })

      /* ---------------- Update SEO ---------------- */

      .addCase(updateSeo.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateSeo.fulfilled, (state, action) => {
        state.saving = false;
        state.item = action.payload;
        state.error = null;
      })
      .addCase(updateSeo.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload ?? "Failed to update SEO";
      });
  },
});

export const { clearSeoError, resetSeoState } = seoSlice.actions;

export default seoSlice.reducer;
