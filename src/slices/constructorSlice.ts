import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TIngredient,
  TIngredientUnique,
  TConstructorItems
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  constructorItems: TConstructorItems;
};

export const initialState: TConstructorState = {
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
      }
    },
    removeIngredient: (state, action: PayloadAction<TIngredientUnique>) => {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
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
    },
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export const { selectConstructorItems } = constructorSlice.selectors;
export default constructorSlice.reducer;
