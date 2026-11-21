import { createSlice } from "@reduxjs/toolkit";

import type {
  ExperienceItem,
  ExperiencePaginationMeta,
} from "../_types/experience";

import {
  fetchExperiences,
  fetchExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "./experience-thunk";

interface ExperiencesState {
  data: ExperienceItem[];
  currentExperience: ExperienceItem | null;
  meta: ExperiencePaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: ExperiencesState = {
  data: [],
  currentExperience: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: false,
  listError: null,
};

const experienceSlice = createSlice({
  name: "experiences",
  initialState,
  reducers: {
    clearCurrentExperience: (state) => {
      state.currentExperience = null;
      state.error = null;
    },

    clearExperienceErrors: (state) => {
      state.error = null;
      state.listError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ==============================
      // FETCH EXPERIENCES
      // ==============================
      .addCase(fetchExperiences.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload ?? "Failed to fetch experiences";
      })

      // ==============================
      // FETCH SINGLE EXPERIENCE
      // ==============================
      .addCase(fetchExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentExperience = null;
      })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExperience = action.payload;
      })
      .addCase(fetchExperience.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch experience";
      })

      // ==============================
      // CREATE EXPERIENCE
      // ==============================
      .addCase(createExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExperience = action.payload;
      })
      .addCase(createExperience.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create experience";
      })

      // ==============================
      // UPDATE EXPERIENCE
      // ==============================
      .addCase(updateExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.currentExperience = action.payload;

        state.data = state.data.map((experience) =>
          experience.id === action.payload.id
            ? action.payload
            : experience
        );
      })
      .addCase(updateExperience.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to update experience";
      })

      // ==============================
      // DELETE EXPERIENCE
      // ==============================
      .addCase(deleteExperience.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (experience) => experience.id !== action.payload
        );

        if (state.currentExperience?.id === action.payload) {
          state.currentExperience = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);

          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(deleteExperience.rejected, (state, action) => {
        state.error =
          action.payload ?? "Failed to delete experience";
      });
  },
});

export const {
  clearCurrentExperience,
  clearExperienceErrors,
} = experienceSlice.actions;

export default experienceSlice.reducer;