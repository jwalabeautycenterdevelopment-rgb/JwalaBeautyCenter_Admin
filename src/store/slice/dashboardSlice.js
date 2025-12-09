import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (payload = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.login?.accessToken;
    const query = Object.keys(payload).length
      ? `?${new URLSearchParams(payload).toString()}`
      : "";

    try {
      const response = await FetchApi({
        endpoint: `/admin/dashboard${query}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    dashboardData: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard";
      });
  },
});

export const { clearDashboardError } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
