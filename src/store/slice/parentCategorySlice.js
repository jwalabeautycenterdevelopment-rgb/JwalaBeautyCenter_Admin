import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createParentCategory = createAsyncThunk(
  "category/createParentCategory",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/category",
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

export const getParentCategory = createAsyncThunk(
  "category/getCategory",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/category",
        method: "GET",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateParentCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      const response = await FetchApi({
        endpoint: `/admin/category/${id}`,
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

export const getParentCategoryDetails = createAsyncThunk(
  "category/getCategoryDetails",
  async ({ id, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      const response = await FetchApi({
        endpoint: `/admin/subcategory/category/${id}`,
        method: "GET",
        token,
        body: formData,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const deleteParentCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/category/${id}`,
        method: "DELETE",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const parentCategorySlice = createSlice({
  name: "parentcategory",
  initialState: {
    createCategorySuccessmsg: null,
    createCategoryErrorsmsg: null,
    deleteCategorySuccessmsg: null,
    deleteCategoryErrormsg: null,
    getAllCatogoryDetailsSucessmgs: null,
    getAllCatogory: [],
    getAllCatogoryDetails: [],
    loadingCreate: false,
    loadingGet: false,
  },
  reducers: {
    clearMessage(state) {
      state.createCategorySuccessmsg = null;
    },
    clearError(state) {
      state.createCategoryErrorsmsg = null;
    },
    clearDeleteMessage(state) {
      state.deleteCategorySuccessmsg = null;
    },
    clearDeleteError(state) {
      state.deleteCategoryErrormsg = null;
    },
    clearDetailsMsg(state) {
      state.getAllCatogoryDetailsSucessmgs = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createParentCategory.pending, (state) => {
        state.loadingCreate = true;
        state.createCategorySuccessmsg = null;
        state.createCategoryErrorsmsg = null;
      })
      .addCase(createParentCategory.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createCategorySuccessmsg =
          action?.payload?.message || "Category created successfully!";
      })
      .addCase(createParentCategory.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createCategoryErrorsmsg =
          action?.payload || "Failed to create category";
      })

      .addCase(getParentCategory.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getParentCategory.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.getAllCatogory = action?.payload?.data?.categories || [];
      })
      .addCase(getParentCategory.rejected, (state, action) => {
        state.loadingGet = false;
      })

      .addCase(getParentCategoryDetails.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getParentCategoryDetails.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.getAllCatogoryDetails =
          action?.payload?.data?.subcategories || [];
        state.getAllCatogoryDetailsSucessmgs = action?.payload?.message;
      })
      .addCase(getParentCategoryDetails.rejected, (state, action) => {
        state.loadingGet = false;
      })

      .addCase(deleteParentCategory.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(deleteParentCategory.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.deleteCategorySuccessmsg = action?.payload?.message;
      })
      .addCase(deleteParentCategory.rejected, (state, action) => {
        state.loadingGet = false;
        state.deleteCategoryErrormsg =
          action?.payload?.message || "Failed to fetch categories";
      })

      .addCase(updateParentCategory.pending, (state) => {
        state.loadingCreate = true;
        state.createCategorySuccessmsg = null;
        state.createCategoryErrorsmsg = null;
      })
      .addCase(updateParentCategory.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createCategorySuccessmsg =
          action?.payload?.message || "Category updated successfully!";
      })
      .addCase(updateParentCategory.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createCategoryErrorsmsg =
          action?.payload || "Failed to update category";
      });
  },
});

export const {
  clearMessage,
  clearError,
  clearDeleteMessage,
  clearDetailsMsg,
  clearDeleteError,
} = parentCategorySlice.actions;
export default parentCategorySlice.reducer;
