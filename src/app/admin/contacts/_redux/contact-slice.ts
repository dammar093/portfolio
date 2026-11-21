
import { createSlice } from "@reduxjs/toolkit";

import type {
  ContactItem,
  ContactPaginationMeta,
} from "../_types/contact";

import {
  fetchContacts,
  fetchContact,
  deleteContact,
} from "./contact-thunk";

interface ContactsState {
  data: ContactItem[];
  currentContact: ContactItem | null;
  meta: ContactPaginationMeta | null;
  unseenCount: number;

  loading: boolean;
  error: string | null;

  listLoading: boolean;
  listError: string | null;
}

const initialState: ContactsState = {
  data: [],
  currentContact: null,
  meta: null,
  unseenCount: 0,

  loading: false,
  error: null,

  listLoading: false,
  listError: null,
};

const contactSlice = createSlice({
  name: "contacts",
  initialState,

  reducers: {
    clearCurrentContact: (state) => {
      state.currentContact = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // =====================================
      // FETCH CONTACTS
      // =====================================
      .addCase(fetchContacts.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })

      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.listLoading = false;

        state.data = action.payload.data;
        state.meta = action.payload.meta;
        state.unseenCount = action.payload.unseenCount;
      })

      .addCase(fetchContacts.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          action.payload || "Failed to fetch contacts";
      })

      // =====================================
      // FETCH SINGLE CONTACT
      // Automatically mark as seen
      // =====================================
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false;

        const contact = action.payload;

        state.currentContact = contact;

        // Update contact in existing list
        const existingIndex = state.data.findIndex(
          (item) => item.id === contact.id,
        );

        if (existingIndex !== -1) {
          const previousContact = state.data[existingIndex];

          // Decrease unseen count only when it was previously unseen
          if (!previousContact.isSeen && contact.isSeen) {
            state.unseenCount = Math.max(
              0,
              state.unseenCount - 1,
            );
          }

          state.data[existingIndex] = contact;
        } else if (!contact.isSeen) {
          // Handles a newly fetched unseen contact not currently
          // present in the list.
          state.unseenCount = Math.max(
            0,
            state.unseenCount,
          );
        }
      })

      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch contact";
      })

      // =====================================
      // DELETE CONTACT
      // =====================================
      .addCase(deleteContact.pending, (state) => {
        state.error = null;
      })

      .addCase(deleteContact.fulfilled, (state, action) => {
        // Capture before removing from array
        const deletedContact = state.data.find(
          (contact) => contact.id === action.payload,
        );

        state.data = state.data.filter(
          (contact) => contact.id !== action.payload,
        );

        if (state.currentContact?.id === action.payload) {
          state.currentContact = null;
        }

        if (state.meta && deletedContact) {
          state.meta.total = Math.max(
            0,
            state.meta.total - 1,
          );

          state.meta.totalPages = Math.ceil(
            state.meta.total / state.meta.limit,
          );
        }

        if (deletedContact && !deletedContact.isSeen) {
          state.unseenCount = Math.max(
            0,
            state.unseenCount - 1,
          );
        }
      })

      .addCase(deleteContact.rejected, (state, action) => {
        state.error =
          action.payload || "Failed to delete contact";
      });
  },
});

export const { clearCurrentContact } = contactSlice.actions;

export default contactSlice.reducer;
