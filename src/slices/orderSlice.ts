import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrdersApi } from '../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  userOrders: TOrder[] | null;
};

export const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  userOrders: null
};

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);

export const fetchUserOrderHistory = createAsyncThunk(
  'user/orders',
  getOrdersApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.userOrders = null;
    },
    closeOrderRequest: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.userOrders
  }
});

export const { closeOrderRequest, clearUserOrders } = orderSlice.actions;
export const { selectOrderModalData, selectOrderRequest, selectUserOrders } =
  orderSlice.selectors;

export default orderSlice.reducer;
