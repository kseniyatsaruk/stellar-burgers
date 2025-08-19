import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TLoginData, TRegisterData } from '../utils/burger-api';

type TUserState = {
  user: TUser;
  isAuthenticated: boolean;
  isInit: boolean;
  loading: boolean;
  errorText: string;
};

export const initialState: TUserState = {
  user: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  isInit: false,
  loading: false,
  errorText: ''
};

export const fetchLoginUser = createAsyncThunk('user/login', loginUserApi);
export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);
export const getUserThunk = createAsyncThunk('user/get', getUserApi);
export const fetchLogout = createAsyncThunk('user/logout', logoutApi);
export const fetchUpdateUser = createAsyncThunk('user/update', updateUserApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initializeApp: (state) => {
      state.isInit = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.errorText = action.payload;
    },
    clearError: (state) => {
      state.errorText = '';
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: TUserState) => {
      state.loading = true;
      state.errorText = '';
    };

    const handleRejected = (state: TUserState, action: any) => {
      state.loading = false;
      state.errorText = action.error.message;
    };

    builder
      .addCase(fetchLoginUser.pending, handlePending)
      .addCase(fetchLoginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchLoginUser.rejected, handleRejected)

      .addCase(fetchRegisterUser.pending, handlePending)
      .addCase(fetchRegisterUser.fulfilled, (state) => {
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
      .addCase(getUserThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
        state.loading = false;
      })

      .addCase(fetchLogout.pending, handlePending)
      .addCase(fetchLogout.fulfilled, (state) => {
        state.user = { name: '', email: '' };
        state.isAuthenticated = false;
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
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectLoading: (state) => state.loading,
    selectErrorText: (state) => state.errorText
  }
});

export const { initializeApp, setError, clearError } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthenticated,
  selectIsInit,
  selectLoading,
  selectErrorText
} = userSlice.selectors;
export default userSlice.reducer;
