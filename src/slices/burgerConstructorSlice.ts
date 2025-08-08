import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorItems,
  TIngredient,
  TIngredientUnique,
  TOrder,
  TUser
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialState = {
  ingredients: TIngredient[];
  loading: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  user: TUser;
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  userOrders: TOrder[] | null;
  isAuthenticated: boolean;
  isInit: boolean;
  isModalOpened: boolean;
  errorText: string;
};

export const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  orderModalData: null,
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  },
  orderRequest: false,
  user: {
    name: '',
    email: ''
  },
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  isAuthenticated: false,
  isInit: false,
  isModalOpened: false,
  errorText: ''
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
      }
    },
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    },
    clearOrders(state) {
      state.orders.length = 0;
    },
    clearUserOrders(state) {
      state.userOrders = null;
    },
    initializeApp(state) {
      state.isInit = true;
    },
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    },
    removeIngredient(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    setError(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    clearError(state) {
      state.errorText = '';
    },
    moveIngredient(
      state,
      action: PayloadAction<{
        ingredient: TIngredientUnique;
        direction: 'up' | 'down';
      }>
    ) {
      const { ingredients } = state.constructorItems;
      const index = ingredients.findIndex(
        (item) => item.uniqueId === action.payload.ingredient.uniqueId
      );

      if (action.payload.direction === 'up' && index > 0) {
        [ingredients[index - 1], ingredients[index]] = [
          ingredients[index],
          ingredients[index - 1]
        ];
      } else if (
        action.payload.direction === 'down' &&
        index < ingredients.length - 1
      ) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading,
    selectOrderModalData: (state) => state.orderModalData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectUser: (state) => state.user,
    selectFeedOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectUserOrders: (state) => state.userOrders,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    const handlePending = (state: TInitialState) => {
      state.loading = true;
      state.errorText = '';
    };

    const handleRejected = (state: TInitialState, action: any) => {
      state.loading = false;
      state.errorText = action.error.message;
    };

    builder
      .addCase(fetchIngredients.pending, handlePending)
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, handleRejected)

      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.orderRequest = false;
      })

      .addCase(fetchLoginUser.pending, handlePending)
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchLoginUser.rejected, handleRejected)

      .addCase(fetchRegisterUser.pending, handlePending)
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.rejected, handleRejected)

      .addCase(getUserThunk.pending, handlePending)
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
        state.loading = false;
      })

      .addCase(fetchAllOrders.pending, handlePending)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
        state.loading = false;
      })
      .addCase(fetchAllOrders.rejected, handleRejected)

      .addCase(fetchUserOrderHistory.pending, handlePending)
      .addCase(fetchUserOrderHistory.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrderHistory.rejected, handleRejected)

      .addCase(fetchLogout.pending, handlePending)
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchLogout.rejected, handleRejected)

      .addCase(fetchUpdateUser.pending, handlePending)
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      })
      .addCase(fetchUpdateUser.rejected, handleRejected);
  }
});

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);
export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);
export const fetchLoginUser = createAsyncThunk('user/login', loginUserApi);
export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);
export const getUserThunk = createAsyncThunk('user/get', getUserApi);
export const fetchAllOrders = createAsyncThunk('user/feed', getFeedsApi);
export const fetchUserOrderHistory = createAsyncThunk(
  'user/orders',
  getOrdersApi
);
export const fetchLogout = createAsyncThunk('user/logout', logoutApi);
export const fetchUpdateUser = createAsyncThunk('user/update', updateUserApi);

export const {
  selectLoading,
  selectIngredients,
  selectOrderModalData,
  selectConstructorItems,
  selectOrderRequest,
  selectUser,
  selectFeedOrders,
  selectTotalOrders,
  selectTodayOrders,
  selectUserOrders,
  selectIsAuthenticated,
  selectIsInit,
  selectIsModalOpened,
  selectErrorText
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  closeOrderRequest,
  clearOrders,
  clearUserOrders,
  initializeApp,
  openModal,
  closeModal,
  removeIngredient,
  setError,
  clearError,
  moveIngredient
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
