import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';
import { createAsyncThunk } from '@reduxjs/toolkit';

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      });
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading
  }
});

export const { selectIngredients, selectLoading } = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
