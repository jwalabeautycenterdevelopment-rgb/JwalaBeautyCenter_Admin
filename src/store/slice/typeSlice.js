import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createType = createAsyncThunk(
  "types/createType",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: "/admin/types",
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

export const getTypes = createAsyncThunk(
  "types/getTypes",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: "/admin/types",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getTypeById = createAsyncThunk(
  "types/getTypeById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: `/admin/types/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const createTypeName = createAsyncThunk(
  "typeNames/createTypeName",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: "/admin/type-names",
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

export const getTypeNames = createAsyncThunk(
  "typeNames/getTypeNames",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: "/admin/type-names",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const getTypeNamesByTypeId = createAsyncThunk(
  "typeNames/getTypeNamesByTypeId",
  async (typeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.login?.accessToken;

      const response = await FetchApi({
        endpoint: `/admin/type-names/${typeId}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const typeCombinedSlice = createSlice({
  name: "typeCombined",

  initialState: {
    types: [],
    singleType: null,

    typeNames: [],
    typeNamesById: [],

    successMessage: null,
    errorMessage: null,

    loading: false,
  },

  reducers: {
    clearTypeMessage(state) {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createType.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createType.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action?.payload?.message || "Type created!";
      })
      .addCase(createType.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action?.payload;
      })

      .addCase(getTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action?.payload?.types || [];
      })
      .addCase(getTypes.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getTypeById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTypeById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleType = action?.payload || null;
      })
      .addCase(getTypeById.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createTypeName.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(createTypeName.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action?.payload?.message || "Type name created!";
      })
      .addCase(createTypeName.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action?.payload;
      })

      .addCase(getTypeNames.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTypeNames.fulfilled, (state, action) => {
        state.loading = false;
        state.typeNames = action?.payload?.typeNames || [];
      })
      .addCase(getTypeNames.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getTypeNamesByTypeId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTypeNamesByTypeId.fulfilled, (state, action) => {
        state.loading = false;
        state.typeNamesById = action?.payload?.typeName || [];
      })
      .addCase(getTypeNamesByTypeId.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearTypeMessage } = typeCombinedSlice.actions;
export default typeCombinedSlice.reducer;
