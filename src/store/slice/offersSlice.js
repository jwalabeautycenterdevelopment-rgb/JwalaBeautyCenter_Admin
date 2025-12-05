import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createOffer = createAsyncThunk(
  "offer/createOffer",
  async (formData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: "/admin/offer/create",
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

export const getOffers = createAsyncThunk(
  "offer/getOffers",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: "/admin/offer",
        method: "GET",
        token,
      });

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offer/updateOffer",
  async ({ slug, formData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;

      const response = await FetchApi({
        endpoint: `/admin/offer/update/${slug}`,
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

export const deleteOffer = createAsyncThunk(
  "offer/deleteOffer",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state?.login?.accessToken;
      if (!token) throw new Error("No access token found");

      const response = await FetchApi({
        endpoint: `/admin/offer/delete/${id}`,
        method: "DELETE",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.message);
    }
  }
);

const offersSlice = createSlice({
  name: "offers",

  initialState: {
    createOfferSuccessmsg: null,
    createOfferErrorsmsg: null,

    deleteOfferSuccessmsg: null,
    deleteOfferErrormsg: null,

    allOffers: [],
    loadingCreate: false,
    loadingGet: false,
  },

  reducers: {
    clearOfferMessage(state) {
      state.createOfferSuccessmsg = null;
    },
    clearOfferError(state) {
      state.createOfferErrorsmsg = null;
    },
    clearDeleteOfferMessage(state) {
      state.deleteOfferSuccessmsg = null;
    },
    clearDeleteOfferError(state) {
      state.deleteOfferErrormsg = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOffer.pending, (state) => {
        state.loadingCreate = true;
        state.createOfferSuccessmsg = null;
        state.createOfferErrorsmsg = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createOfferSuccessmsg =
          action?.payload?.message || "Offer created successfully!";
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createOfferErrorsmsg =
          action?.payload || "Failed to create offer";
      })

      .addCase(getOffers.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.allOffers = action?.payload?.data?.offers || [];
      })
      .addCase(getOffers.rejected, (state) => {
        state.loadingGet = false;
      })

      .addCase(updateOffer.pending, (state) => {
        state.loadingCreate = true;
        state.createOfferSuccessmsg = null;
        state.createOfferErrorsmsg = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.createOfferSuccessmsg =
          action?.payload?.message || "Offer updated successfully!";
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loadingCreate = false;
        state.createOfferErrorsmsg =
          action?.payload || "Failed to update offer";
      })

      .addCase(deleteOffer.pending, (state) => {
        state.loadingGet = true;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loadingGet = false;
        state.deleteOfferSuccessmsg = action?.payload?.message;
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loadingGet = false;
        state.deleteOfferErrormsg = action?.payload || "Failed to delete offer";
      });
  },
});

export const {
  clearOfferMessage,
  clearOfferError,
  clearDeleteOfferMessage,
  clearDeleteOfferError,
} = offersSlice.actions;

export default offersSlice.reducer;
