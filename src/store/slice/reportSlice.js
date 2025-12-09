import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const fetchReport = createAsyncThunk(
  "report/fetchReport",
  async (payload = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.login?.accessToken;
    const query = Object.keys(payload).length
      ? `?${new URLSearchParams(payload).toString()}`
      : "";

    try {
      const response = await FetchApi({
        endpoint: `/admin/report${query}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    reportData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reportData = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load report";
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
