import { createSlice } from "@reduxjs/toolkit";

import {
  createProject,
  deleteProject,
  fetchProject,
  fetchProjects,
  updateProject,
} from "./project-thunk";

import type {
  ProjectItem,
  ProjectPaginationMeta,
} from "../_types/project";

interface ProjectsState {
  data: ProjectItem[];
  usedSlugs: string[];
  currentProject: ProjectItem | null;
  meta: ProjectPaginationMeta | null;

  loading: boolean;
  error: string | null;

  listLoading: boolean;
  listError: string | null;

  deleting: boolean;
}

const initialState: ProjectsState = {
  data: [],
  usedSlugs: [],
  currentProject: null,
  meta: null,

  loading: false,
  error: null,

  listLoading: false,
  listError: null,

  deleting: false,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.error = null;
    },

    clearProjectErrors: (state) => {
      state.error = null;
      state.listError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =====================================
      // FETCH PROJECTS
      // =====================================
      .addCase(fetchProjects.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.usedSlugs = action.payload.usedSlugs;
        state.meta = action.payload.meta;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload ?? "Failed to fetch projects";
      })

      // =====================================
      // FETCH SINGLE PROJECT
      // =====================================
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch project";
      })

      // =====================================
      // CREATE PROJECT
      // =====================================
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;

        state.data.unshift(action.payload);

        if (!state.usedSlugs.includes(action.payload.slug)) {
          state.usedSlugs.push(action.payload.slug);
        }

        if (state.meta) {
          state.meta.total += 1;
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit,
          );
        }

        state.currentProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create project";
      })

      // =====================================
      // UPDATE PROJECT
      // =====================================
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProject = action.payload;

        const index = state.data.findIndex(
          (item) => item.id === updatedProject.id,
        );

        if (index !== -1) {
          state.data[index] = updatedProject;
        }

        state.usedSlugs = state.usedSlugs.filter(
          (slug) => slug !== state.currentProject?.slug,
        );

        if (!state.usedSlugs.includes(updatedProject.slug)) {
          state.usedSlugs.push(updatedProject.slug);
        }

        state.currentProject = updatedProject;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to update project";
      })

      // =====================================
      // DELETE PROJECT
      // =====================================
      .addCase(deleteProject.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.deleting = false;

        const deletedProject = state.data.find(
          (item) => item.id === action.payload,
        );

        state.data = state.data.filter(
          (item) => item.id !== action.payload,
        );

        if (deletedProject) {
          state.usedSlugs = state.usedSlugs.filter(
            (slug) => slug !== deletedProject.slug,
          );
        }

        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit,
          );
        }
      })
      .addCase(deleteProject.rejected, (state) => {
        state.deleting = false;
      });
  },
});

export const {
  clearCurrentProject,
  clearProjectErrors,
} = projectSlice.actions;

export default projectSlice.reducer;