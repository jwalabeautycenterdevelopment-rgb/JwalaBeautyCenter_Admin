import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getAdminOrders = createAsyncThunk(
  "adminOrders/getAdminOrders",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: "/admin/orders",
        method: "GET",
        token,
      });

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateOrdersStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ orderId, newStatus }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/orders/${orderId}/status`,
        method: "PATCH",
        token,
        body: { status: newStatus },
      });

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",

  initialState: {
    allOrders: [],
    loadingGet: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearAdminOrderError(state) {
      state.error = null;
    },
    clearAdminOrderMessage(state) {
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAdminOrders.pending, (state) => {
        state.loadingGet = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allOrders = action?.payload?.data || [];
      })
      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action?.payload || "Failed to fetch admin orders";
      })
      .addCase(updateOrdersStatus.pending, (state) => {
        state.loadingGet = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrdersStatus.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allOrders = action?.payload?.data || [];
        state.successMessage =
          action?.payload?.data?.message || "Orders fetched successfully!";
      })
      .addCase(updateOrdersStatus.rejected, (state, action) => {
        state.loadingGet = false;
        state.error = action?.payload || "Failed to fetch admin orders";
      });
  },
});

export const { clearAdminOrderError, clearAdminOrderMessage } =
  adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
