import { ILoginUserPayload } from "@/types/auth-type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk for login user
export const loginUserThunk = createAsyncThunk<
  void,              // ✅ success return type
  ILoginUserPayload,          // ✅ payload type
  { rejectValue: string }     // ✅ error type
>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      await axios.post("/api/v1/auth/login", payload)
    } catch (error) {
      if(axios.isAxiosError(error)){
        return rejectWithValue(error?.response?.data.message || "Invalid credentials")
      }
      return rejectWithValue("Network error");
    }
  }
)


//async thunk for logout user
export const logoutUserThunk = createAsyncThunk<
  void,              // ✅ success return type
  void,          // ✅ payload type
  { rejectValue: string }     // ✅ error type
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get("/api/v1/auth/logout")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error?.response?.data.message || "Logot fail")
      }
      return rejectWithValue("Network error");
    }
  }
)