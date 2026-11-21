
import { createSlice } from "@reduxjs/toolkit";

import {
  createBlog,
  deleteBlog,
  fetchBlog,
  fetchBlogs,
  updateBlog,
} from "./blog-thunk";

import type {
  BlogItem,
  BlogPaginationMeta,
} from "../_types/blog";

interface BlogsState {
  data: BlogItem[];
  usedSlugs: string[];
  currentBlog: BlogItem | null;
  meta: BlogPaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
  deleting: boolean;
}

const initialState: BlogsState = {
  data: [],
  usedSlugs: [],
  currentBlog: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: true,
  listError: null,
  deleting: false,
};

const blogsSlice = createSlice({
  name: "blogs",
  initialState,

  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },

  extraReducers: (builder) => {
    // ==============================
    // FETCH BLOGS
    // ==============================
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;

        state.data = action.payload.data;
        state.usedSlugs = action.payload.usedSlugs;
        state.meta = action.payload.meta;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.listError = action.payload ?? "Something went wrong";
      });

    // ==============================
    // CREATE BLOG
    // ==============================
    builder
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

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

        state.currentBlog = action.payload;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });

    // ==============================
    // FETCH BLOG BY ID
    // ==============================
    builder
      .addCase(fetchBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBlog = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });

    // ==============================
    // UPDATE BLOG
    // ==============================
    builder
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const index = state.data.findIndex(
          (blog) => blog.id === action.payload.id,
        );

        if (index !== -1) {
          const previousSlug = state.data[index].slug;

          state.data[index] = action.payload;

          if (previousSlug !== action.payload.slug) {
            state.usedSlugs = state.usedSlugs.filter(
              (slug) => slug !== previousSlug,
            );

            if (!state.usedSlugs.includes(action.payload.slug)) {
              state.usedSlugs.push(action.payload.slug);
            }
          }
        }

        if (state.currentBlog?.id === action.payload.id) {
          state.currentBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });

    // ==============================
    // DELETE BLOG
    // ==============================
    builder
      .addCase(deleteBlog.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.deleting = false;

        const deletedBlog = state.data.find(
          (blog) => blog.id === action.payload,
        );

        state.data = state.data.filter((blog) => blog.id !== action.payload);

        if (deletedBlog) {
          state.usedSlugs = state.usedSlugs.filter(
            (slug) => slug !== deletedBlog.slug,
          );
        }

        if (state.currentBlog?.id === action.payload) {
          state.currentBlog = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit,
          );
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload ?? "Failed to delete blog";
      });
  }
});

export const { clearCurrentBlog } = blogsSlice.actions;

export default blogsSlice.reducer;
