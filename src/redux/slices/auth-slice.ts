import { createSlice } from "@reduxjs/toolkit";
import { loginUserThunk, logoutUserThunk } from "../thunk/auth-thunk";

// initial state type
interface IAuthState {
  error: string | null;
  isLoading: boolean;
}

// initial state of auth
const initialState: IAuthState = {
  error: null,
  isLoading: false
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: ((builder) => {
    // login user builder
    builder.addCase(loginUserThunk.pending, (state: IAuthState) => {
      state.error = null;
      state.isLoading = true;
    })
      .addCase(loginUserThunk.fulfilled, (state: IAuthState) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(loginUserThunk.rejected, (state: IAuthState, action) => {
        state.error = action.payload ?? "Invalid credentials";
        state.isLoading = false;
      })
    // user logout builder
    builder.addCase(logoutUserThunk.pending, (state: IAuthState) => {
      state.error = null;
      state.isLoading = true;
    })
      .addCase(logoutUserThunk.fulfilled, (state: IAuthState) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(logoutUserThunk.rejected, (state: IAuthState, action) => {
        state.error = action.payload ?? "Something went wrong";
        state.isLoading = false;
      })
  })
})

export default authSlice.reducer