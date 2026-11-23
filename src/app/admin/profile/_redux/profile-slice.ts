import { createSlice, type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import type { ProfileState } from "../_types/profile";
import { changePassword, requestEmailChange, updateProfile, verifyEmailChange } from "./profile-thunk";

const initialState: ProfileState = { submitting: false, activeAction: "idle", error: null };

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => { state.error = null; },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProfileState>) => {
    const actions = [
      [updateProfile, "updateProfile"],
      [requestEmailChange, "requestEmailChange"],
      [verifyEmailChange, "verifyEmailChange"],
      [changePassword, "changePassword"],
    ] as const;

    actions.forEach(([thunk, actionName]) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true;
          state.activeAction = actionName;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.submitting = false;
          state.activeAction = "idle";
        })
        .addCase(thunk.rejected, (state, action) => {
          state.submitting = false;
          state.activeAction = "idle";
          state.error = action.payload || action.error.message || "Request failed";
        });
    });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
