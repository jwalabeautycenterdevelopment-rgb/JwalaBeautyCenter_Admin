import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/brands/create",
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

export const getBrands = createAsyncThunk(
  "brand/getBrands",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/brands",
        method: "GET",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async ({ slug, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      const response = await FetchApi({
        endpoint: `/admin/brands/update/${slug}`,
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

export const deleteBrand = createAsyncThunk(
  "brand/deleteBrand",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/brands/delete/${id}`,
        method: "DELETE",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    createBrandSuccessmsg: null,
    createBrandErrorsmsg: null,
    deleteBrandSuccessmsg: null,
    deleteBrandErrormsg: null,
    allBrands: [],
    loadingCreate: false,
    loadingGet: false,
  },

  reducers: {
    clearBrandMessage(state) {
      state.createBrandSuccessmsg = null;
    },
    clearBrandError(state) {
      state.createBrandErrorsmsg = null;
    },
    clearDeleteBrandMessage(state) {
      state.deleteBrandSuccessmsg = null;
    },
    clearDeleteBrandError(state) {
      state.deleteBrandErrormsg = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createBrand.pending, (state) => {
        state.loadingCreate = true;
        state.createBrandSuccessmsg = null;
        state.createBrandErrorsmsg = null;
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createBrandSuccessmsg =
          action?.payload?.message || "Brand created successfully!";
      })
      .addCase(createBrand.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createBrandErrorsmsg =
          action?.payload || "Failed to create brand";
      })

      .addCase(getBrands.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allBrands = action?.payload?.data || [];
      })
      .addCase(getBrands.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateBrand.pending, (state) => {
        state.loadingCreate = true;
        state.createBrandSuccessmsg = null;
        state.createBrandErrorsmsg = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createBrandSuccessmsg =
          action?.payload?.message || "Brand updated successfully!";
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createBrandErrorsmsg =
          action?.payload || "Failed to update brand";
      })

      .addCase(deleteBrand.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.deleteBrandSuccessmsg = action?.payload?.message;
      })
      .addCase(deleteBrand.rejected, (state, action) => {
        state.loadingGet = false;
        state.deleteBrandErrormsg = action?.payload || "Failed to delete brand";
      });
  },
});

export const {
  clearBrandMessage,
  clearBrandError,
  clearDeleteBrandMessage,
  clearDeleteBrandError,
} = brandsSlice.actions;

export default brandsSlice.reducer;
