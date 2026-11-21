import { createSlice } from "@reduxjs/toolkit";

import type {
  ServiceItem,
  ServicePaginationMeta,
} from "../_types/service";

import {
  fetchServices,
  fetchService,
  createService,
  updateService,
  deleteService,
} from "./service-thunk";

interface ServicesState {
  data: ServiceItem[];
  currentService: ServiceItem | null;
  meta: ServicePaginationMeta | null;
  loading: boolean;
  error: string | null;
  listLoading: boolean;
  listError: string | null;
}

const initialState: ServicesState = {
  data: [],
  currentService: null,
  meta: null,
  loading: false,
  error: null,
  listLoading: false,
  listError: null,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.listLoading = false;
        state.data = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload as string;
      })

      // Fetch single service
      .addCase(fetchService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;

        state.data = state.data.map((service) =>
          service.id === action.payload.id ? action.payload : service
        );
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete service
      .addCase(deleteService.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (service) => service.id !== action.payload
        );

        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }

        if (state.meta) {
          state.meta.total = Math.max(0, state.meta.total - 1);
          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit
          );
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentService } = serviceSlice.actions;
export default serviceSlice.reducer;