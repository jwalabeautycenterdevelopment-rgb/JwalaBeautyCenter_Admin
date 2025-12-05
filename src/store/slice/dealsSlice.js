import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createDeal = createAsyncThunk(
  "admin/deal/create",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: "/admin/deals/create",
        method: "POST",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getDeals = createAsyncThunk(
  "admin/deal/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: "/admin/deals",
        method: "GET",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateDeal = createAsyncThunk(
  "admin/deal/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      return await FetchApi({
        endpoint: `/admin/deals/update/${id}`,
        method: "PATCH",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const deleteDeal = createAsyncThunk(
  "admin/deal/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: `/admin/deals/delete/${id}`,
        method: "DELETE",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const dealSlice = createSlice({
  name: "deal",
  initialState: {
    loadingCreate: false,
    createDealSuccessMsg: null,
    createDealErrorMsg: null,

    loadingGet: false,
    allDeals: [],

    loadingUpdate: false,
    updateDealSuccessMsg: null,
    updateDealErrorMsg: null,

    loadingDelete: false,
    deleteDealSuccessMsg: null,
    deleteDealErrorMsg: null,
  },

  reducers: {
    clearCreateMsg(state) {
      state.createDealSuccessMsg = null;
      state.createDealErrorMsg = null;
    },
    clearUpdateMsg(state) {
      state.updateDealSuccessMsg = null;
      state.updateDealErrorMsg = null;
    },
    clearDeleteMsg(state) {
      state.deleteDealSuccessMsg = null;
      state.deleteDealErrorMsg = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createDeal.pending, (state) => {
        state.loadingCreate = true;
        state.createDealSuccessMsg = null;
        state.createDealErrorMsg = null;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createDealSuccessMsg =
          action?.payload?.message || "Deal created successfully!";
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createDealErrorMsg = action?.payload || "Failed to create deal";
      })

      .addCase(getDeals.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allDeals = action?.payload?.data?.deals || [];
      })
      .addCase(getDeals.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateDeal.pending, (state) => {
        state.loadingUpdate = true;
        state.updateDealSuccessMsg = null;
        state.updateDealErrorMsg = null;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.updateDealSuccessMsg =
          action?.payload?.message || "Deal updated successfully!";
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.updateDealErrorMsg = action?.payload || "Failed to update deal";
      })

      .addCase(deleteDeal.pending, (state) => {
        state.loadingDelete = true;
        state.deleteDealSuccessMsg = null;
        state.deleteDealErrorMsg = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deleteDealSuccessMsg =
          action?.payload?.message || "Deal deleted successfully!";
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteDealErrorMsg = action?.payload || "Failed to delete deal";
      });
  },
});

export const { clearCreateMsg, clearUpdateMsg, clearDeleteMsg } =
  dealSlice.actions;

export default dealSlice.reducer;
