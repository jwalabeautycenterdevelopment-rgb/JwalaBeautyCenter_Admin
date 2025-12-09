import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createProduct = createAsyncThunk(
  "admin/product/create",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      return await FetchApi({
        endpoint: "/admin/product/create",
        method: "POST",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getProducts = createAsyncThunk(
  "admin/product/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: "/admin/product",
        method: "GET",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "products/getSingleProduct",
  async (slug, thunkAPI) => {
    try {
      const response = await FetchApi({
        endpoint: `/admin/product/${slug}`,
        method: "GET",
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/product/update",
  async ({ slug, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      return await FetchApi({
        endpoint: `/admin/product/update/${slug}`,
        method: "PATCH",
        token,
        body: formData,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/product/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      return await FetchApi({
        endpoint: `/admin/product/delete/${id}`,
        method: "DELETE",
        token,
      });
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loadingCreate: false,
    createSuccessMsg: null,
    createErrorMsg: null,
    singleProduct: [],
    loadingGet: false,
    allProducts: [],

    loadingUpdate: false,
    updateSuccessMsg: null,
    updateErrorMsg: null,

    loadingDelete: false,
    deleteSuccessMsg: null,
    deleteErrorMsg: null,
  },
  reducers: {
    clearCreateMsg(state) {
      state.createSuccessMsg = null;
      state.createErrorMsg = null;
    },
    clearUpdateMsg(state) {
      state.updateSuccessMsg = null;
      state.updateErrorMsg = null;
    },
    clearDeleteMsg(state) {
      state.deleteSuccessMsg = null;
      state.deleteErrorMsg = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loadingCreate = true;
        state.createSuccessMsg = null;
        state.createErrorMsg = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createSuccessMsg =
          action?.payload?.message || "Product created successfully!";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createErrorMsg = action?.payload || "Failed to create product";
      })

      .addCase(getProducts.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allProducts = action?.payload?.data?.products || [];
      })
      .addCase(getProducts.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(getSingleProduct.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.singleProduct = action?.payload?.data?.product || [];
      })
      .addCase(getSingleProduct.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loadingUpdate = true;
        state.updateSuccessMsg = null;
        state.updateErrorMsg = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.updateSuccessMsg =
          action?.payload?.message || "Product updated successfully!";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.updateErrorMsg = action?.payload || "Failed to update product";
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loadingDelete = true;
        state.deleteSuccessMsg = null;
        state.deleteErrorMsg = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.deleteSuccessMsg =
          action?.payload?.message || "Product deleted successfully!";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loadingDelete = false;
        state.deleteErrorMsg = action?.payload || "Failed to delete product";
      });
  },
});

export const { clearCreateMsg, clearUpdateMsg, clearDeleteMsg } =
  productSlice.actions;

export default productSlice.reducer;
