import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createSubCategory = createAsyncThunk(
  "subcategory/create",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/subcategory/create",
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

export const getSubCategory = createAsyncThunk(
  "subcategory/getAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");
      const response = await FetchApi({
        endpoint: "/admin/subcategory",
        method: "GET",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  "subcategory/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      const response = await FetchApi({
        endpoint: `/admin/subcategory/update/${id}`,
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

export const deleteSubCategory = createAsyncThunk(
  "subcategory/delete",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/subcategory/delete/${id}`,
        method: "DELETE",
        token,
      });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const subCategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    createSuccessMsg: null,
    createErrorMsg: null,
    deleteSuccessMsg: null,
    deleteErrorMsg: null,
    allSubCategories: [],
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
      .addCase(createSubCategory.pending, (state) => {
        state.loadingCreate = true;
        state.createSuccessMsg = null;
        state.createErrorMsg = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createSuccessMsg =
          action?.payload?.message || "Subcategory created successfully!";
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createErrorMsg =
          action?.payload || "Failed to create subcategory";
      })

      .addCase(getSubCategory.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getSubCategory.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allSubCategories = action?.payload?.data?.subcategories || [];
      })
      .addCase(getSubCategory.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateSubCategory.pending, (state) => {
        state.loadingCreate = true;
        state.createSuccessMsg = null;
        state.createErrorMsg = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createSuccessMsg =
          action?.payload?.message || "Subcategory updated successfully!";
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createErrorMsg =
          action?.payload || "Failed to update subcategory";
      })

      .addCase(deleteSubCategory.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.deleteSuccessMsg =
          action?.payload?.message || "Subcategory Delated successfully";
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loadingGet = false;
        state.deleteErrorMsg =
          action?.payload || "Failed to delete subcategory";
      });
  },
});

export const { clearCreateMsg, clearDeleteMsg } = subCategorySlice.actions;
export default subCategorySlice.reducer;
