import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  clearTokenRefresh,
  setupTokenRefresh,
} from "../../utils/setupTokenRefresh";
import { FetchApi } from "../../api/FetchApi";

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await FetchApi({
        endpoint: "/admin/login",
        method: "POST",
        body: { email, password },
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.login?.refreshToken;
    try {
      const response = await FetchApi({
        endpoint: "/admins/refresh",
        method: "POST",
        token,
      });

      if (response?.data?.success === false)
        return thunkAPI.rejectWithValue(
          response?.data?.data?.errors || response?.data?.errors
        );

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    email: null,
    firstName: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
      state.fetchMeErrorMsg = null;
    },
    logout(state) {
      state.email = null;
      state.firstName = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
      clearTokenRefresh();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action?.payload?.accessToken;
        state.refreshToken = action?.payload?.refreshToken;
        state.email = action?.payload?.email;
        state.firstName = action?.payload?.firstName;
        state.lastName = action?.payload?.lastName;
        state.message = "Login successful";
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        localStorage.setItem("loginTimestamp", Date.now());
        setupTokenRefresh();
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload?.accessToken;
        state.refreshToken = action.payload?.refreshToken || state.refreshToken;
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        setupTokenRefresh();
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshError = action.payload || "Failed to refresh token";
      });
  },
});

export const { clearMessage, clearError, logout } = loginSlice.actions;
export default loginSlice.reducer;
