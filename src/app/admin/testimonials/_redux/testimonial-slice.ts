
import { createSlice } from "@reduxjs/toolkit";

import type {
  TestimonialItem,
  TestimonialPaginationMeta,
} from "../_types/testimonial";

import {
  fetchTestimonials,
  fetchTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "./testimonial-thunk";

interface TestimonialsState {
  data: TestimonialItem[];
  currentTestimonial: TestimonialItem | null;
  meta: TestimonialPaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: TestimonialsState = {
  data: [],
  currentTestimonial: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: false,
  listError: null,
};

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {
    clearCurrentTestimonial: (state) => {
      state.currentTestimonial = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==============================
      // FETCH TESTIMONIALS
      // ==============================
      .addCase(fetchTestimonials.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload || "Failed to fetch testimonials";
      })

      // ==============================
      // FETCH SINGLE TESTIMONIAL
      // ==============================
      .addCase(fetchTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload;
      })
      .addCase(fetchTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch testimonial";
      })

      // ==============================
      // CREATE TESTIMONIAL
      // ==============================
      .addCase(createTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload;
      })
      .addCase(createTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to create testimonial";
      })

      // ==============================
      // UPDATE TESTIMONIAL
      // ==============================
      .addCase(updateTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestimonial = action.payload;

        state.data = state.data.map((testimonial) =>
          testimonial.id === action.payload.id
            ? action.payload
            : testimonial
        );
      })
      .addCase(updateTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update testimonial";
      })

      // ==============================
      // DELETE TESTIMONIAL
      // ==============================
      .addCase(deleteTestimonial.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (testimonial) => testimonial.id !== action.payload
        );

        if (state.currentTestimonial?.id === action.payload) {
          state.currentTestimonial = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to delete testimonial";
      });
  },
});

export const { clearCurrentTestimonial } = testimonialSlice.actions;

export default testimonialSlice.reducer;
