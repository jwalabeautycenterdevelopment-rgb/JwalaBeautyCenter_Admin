import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createAdBanner = createAsyncThunk(
  "admin/adbanner/create",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: "/admin/ad-banner/create",
        method: "POST",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getAdBanner = createAsyncThunk(
  "admin/adbanner/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: "/admin/ad-banner",
        method: "GET",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateAdBanner = createAsyncThunk(
  "admin/adbanner/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      return await FetchApi({
        endpoint: `/admin/ad-banner/update/${id}`,
        method: "PATCH",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const deleteAdBanner = createAsyncThunk(
  "admin/adbanner/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: `/admin/ad-banner/delete/${id}`,
        method: "DELETE",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const adBannerSlice = createSlice({
  name: "adBanner",
  initialState: {
    loadingCreate: false,
    createAdSuccessMsg: null,
    createAdErrorMsg: null,

    loadingGet: false,
    allBanners: [],

    loadingUpdate: false,
    updateAdSuccessMsg: null,
    updateAdErrorMsg: null,

    loadingDelete: false,
    deleteAdSuccessMsg: null,
    deleteAdErrorMsg: null,
  },

  reducers: {
    clearCreateMsg(state) {
      state.createAdSuccessMsg = null;
      state.createAdErrorMsg = null;
    },
    clearUpdateMsg(state) {
      state.updateAdSuccessMsg = null;
      state.updateAdErrorMsg = null;
    },
    clearDeleteMsg(state) {
      state.deleteAdSuccessMsg = null;
      state.deleteAdErrorMsg = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(createAdBanner.pending, (state) => {
        state.loadingCreate = true;
        state.createAdSuccessMsg = null;
        state.createAdErrorMsg = null;
      })
      .addCase(createAdBanner.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createAdSuccessMsg =
          action?.payload?.message || "Ad banner created successfully!";
      })
      .addCase(createAdBanner.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createAdErrorMsg =
          action?.payload || "Failed to create ad banner";
      })

      .addCase(getAdBanner.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getAdBanner.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allBanners = action?.payload?.data?.adBanners || [];
      })
      .addCase(getAdBanner.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateAdBanner.pending, (state) => {
        state.loadingUpdate = true;
        state.updateAdSuccessMsg = null;
        state.updateAdErrorMsg = null;
      })
      .addCase(updateAdBanner.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.updateAdSuccessMsg =
          action?.payload?.message || "Ad banner updated successfully!";
      })
      .addCase(updateAdBanner.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.updateAdErrorMsg =
          action?.payload || "Failed to update ad banner";
      })

      .addCase(deleteAdBanner.pending, (state) => {
        state.loadingDelete = true;
        state.deleteAdSuccessMsg = null;
        state.deleteAdErrorMsg = null;
      })
      .addCase(deleteAdBanner.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deleteAdSuccessMsg =
          action?.payload?.message || "Ad banner deleted successfully!";
      })
      .addCase(deleteAdBanner.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteAdErrorMsg =
          action?.payload || "Failed to delete ad banner";
      });
  },
});

export const { clearCreateMsg, clearUpdateMsg, clearDeleteMsg } =
  adBannerSlice.actions;

export default adBannerSlice.reducer;
