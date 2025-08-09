import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredientsSlice';
import constructorReducer from './constructorSlice';
import ordersReducer from './orderSlice';
import feedReducer from './feedSlice';
import userReducer from './userSlice';
import modalReducer from './modalSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: ordersReducer,
  feed: feedReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  modal: modalReducer
});
