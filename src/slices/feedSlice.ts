// slices/feedSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TFeedState = {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
};

export const initialState: TFeedState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0
};

export const fetchAllOrders = createAsyncThunk('user/feed', getFeedsApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.totalOrders = action.payload.total;
      state.ordersToday = action.payload.totalToday;
    });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday
  }
});

export const { clearOrders } = feedSlice.actions;
export const { selectFeedOrders, selectTotalOrders, selectTodayOrders } =
  feedSlice.selectors;
export default feedSlice.reducer;
