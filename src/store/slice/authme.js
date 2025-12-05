import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const fetchMe = createAsyncThunk(
  "admin/fetchMe",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.login?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/me",
        method: "GET",
        token,
      });
      return response?.data; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateAdminProfile = createAsyncThunk(
  "admin/updateProfile",
  async (payload, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      const response = await FetchApi({
        endpoint: "/admin/me",
        method: "PATCH",
        token,
        body: payload,
      });

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    adminData: null,
    fetchLoading: false,
    updateLoading: false,
    message: null,
    error: null,
  },

  reducers: {
    clearMessage(state) {
      state.message = null;
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.adminData = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.fetchLoading = false;
        state.error = action.payload || "Failed to fetch profile";
      })

      .addCase(updateAdminProfile.pending, (state) => {
        state.updateLoading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.message =
          action.payload?.message || "Profile updated successfully";
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { clearMessage, clearError } = authSlice.actions;
export default authSlice.reducer;
