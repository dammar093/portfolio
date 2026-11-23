import { createSlice } from "@reduxjs/toolkit";
import type { PasswordResetState } from "../_types/forgot-password";
import { requestPasswordResetCode, verifyPasswordResetCode } from "./forgot-password-thunk";

const initialState: PasswordResetState = { submitting: false, activeAction: "idle", error: null };

const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    clearPasswordResetError: (state) => { state.error = null; },
    resetPasswordResetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordResetCode.pending, (state) => { state.submitting = true; state.activeAction = "requestCode"; state.error = null; })
      .addCase(requestPasswordResetCode.fulfilled, (state) => { state.submitting = false; state.activeAction = "idle"; })
      .addCase(requestPasswordResetCode.rejected, (state, action) => { state.submitting = false; state.activeAction = "idle"; state.error = action.payload || action.error.message || "Request failed"; })
      .addCase(verifyPasswordResetCode.pending, (state) => { state.submitting = true; state.activeAction = "verifyCode"; state.error = null; })
      .addCase(verifyPasswordResetCode.fulfilled, (state) => { state.submitting = false; state.activeAction = "idle"; })
      .addCase(verifyPasswordResetCode.rejected, (state, action) => { state.submitting = false; state.activeAction = "idle"; state.error = action.payload || action.error.message || "Request failed"; });
  },
});

export const { clearPasswordResetError, resetPasswordResetState } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
