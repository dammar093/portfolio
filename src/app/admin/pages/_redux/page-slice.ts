import { createSlice } from "@reduxjs/toolkit";
import { createPage, deletePage, fetchPage, fetchPages, toggleStatusPage, updatePage } from "../_redux/page-thunk";
import type { PageItem, PaginationMeta } from "../_types/page";

interface PagesState {
  data: PageItem[];
  currentPage: PageItem | null;
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: PagesState = {
  data: [],
  currentPage: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: true,
  listError: null,
};

const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder for fetch page
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.listError = action.payload ?? "Something went wrong";
      })
    // builder for create page 
    builder
      .addCase(createPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // ✅ Add new page at top
        state.data.unshift(action.payload);
        // ✅ Update pagination meta safely
        if (state.meta) {
          state.meta.total += 1;
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(createPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      //  builder for get page by id
      .addCase(fetchPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentPage = action.payload
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      //  builder for update page by id
      .addCase(updatePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.data?.findIndex(d => d.id === action?.payload?.id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      //  builder for delete page by id
      .addCase(deletePage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = state.data?.filter(d => d.id !== action.payload.id)
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // builder for toggle status of page
      .addCase(toggleStatusPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStatusPage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.data?.findIndex(d => d.id === action?.payload?.id)
        if (index !== -1) {
          state.data[index] = action.payload
        }
      })
      .addCase(toggleStatusPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default pagesSlice.reducer;
