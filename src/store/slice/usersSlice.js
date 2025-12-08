import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: "/user",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message || "Something went wrong");
    }
  }
);

const usersSlice = createSlice({
  name: "users",

  initialState: {
    users: [],
    loading: false,
    errorMessage: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action?.payload?.user || [];
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action?.payload;
      });
  },
});

export default usersSlice.reducer;
