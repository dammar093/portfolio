
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  ContactItem,
  ContactQueryParams,
  ContactListResponse,
  ContactResponse,
} from "../_types/contact";

// ==============================
// ERROR MESSAGE HELPER
// ==============================
const getErrorMessage = (
  err: unknown,
  fallback: string,
): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || fallback;
  }

  return err instanceof Error ? err.message : fallback;
};

// ==============================
// FETCH ALL CONTACTS
// ==============================
export const fetchContacts = createAsyncThunk<
  ContactListResponse,
  ContactQueryParams | undefined,
  { rejectValue: string }
>(
  "contacts/fetchContacts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get<ContactListResponse>(
        "/api/v1/admin/contacts",
        { params },
      );

      return response.data;
    } catch (err: unknown) {
      return rejectWithValue(
        getErrorMessage(err, "Failed to fetch contacts"),
      );
    }
  },
);

// ==============================
// FETCH SINGLE CONTACT
// ==============================
export const fetchContact = createAsyncThunk<
  ContactItem,
  string,
  { rejectValue: string }
>(
  "contacts/fetchContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<ContactResponse>(
        `/api/v1/admin/contacts/${id}`,
      );

      return response.data.data;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to fetch contact",
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// ==============================
// DELETE CONTACT
// ==============================
export const deleteContact = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "contacts/deleteContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete<ContactResponse>(
        `/api/v1/admin/contacts/${id}`,
      );

      toast.success(
        response.data.message || "Contact deleted successfully",
      );

      return id;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete contact",
      );

      toast.error(message);
      return rejectWithValue(message);
    }
  },
);
