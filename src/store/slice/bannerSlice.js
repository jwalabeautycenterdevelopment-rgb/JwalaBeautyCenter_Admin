import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createBanner = createAsyncThunk(
  "banner/create",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: "/admin/banner/create",
        method: "POST",
        token,
        body: formData,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getBanner = createAsyncThunk(
  "banner/getAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: "/admin/banner",
        method: "GET",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banner/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;

      const response = await FetchApi({
        endpoint: `/admin/banner/update/${id}`,
        method: "PATCH",
        token,
        body: formData,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/delete",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/banner/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    createSuccessMsg: null,
    createErrorMsg: null,
    deleteSuccessMsg: null,
    deleteErrorMsg: null,
    allBanners: [],
    loadingCreate: false,
    loadingGet: false,
  },
  reducers: {
    clearCreateMsg(state) {
      state.createSuccessMsg = null;
      state.createErrorMsg = null;
    },
    clearDeleteMsg(state) {
      state.deleteSuccessMsg = null;
      state.deleteErrorMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBanner.pending, (state) => {
        state.loadingCreate = true;
        state.createSuccessMsg = null;
        state.createErrorMsg = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createSuccessMsg =
          action?.payload?.message || "Banner created successfully!";
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createErrorMsg = action?.payload || "Failed to create banner";
      })

      .addCase(getBanner.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getBanner.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allBanners = action?.payload?.data?.banners || [];
      })
      .addCase(getBanner.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateBanner.pending, (state) => {
        state.loadingCreate = true;
        state.createSuccessMsg = null;
        state.createErrorMsg = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createSuccessMsg =
          action?.payload?.message || "Banner updated successfully!";
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createErrorMsg = action?.payload || "Failed to update banner";
      })

      .addCase(deleteBanner.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.deleteSuccessMsg =
          action?.payload?.message || "Banner deleted successfully";
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loadingGet = false;
        state.deleteErrorMsg = action?.payload || "Failed to delete banner";
      });
  },
});

export const { clearCreateMsg, clearDeleteMsg } = bannerSlice.actions;
export default bannerSlice.reducer;
