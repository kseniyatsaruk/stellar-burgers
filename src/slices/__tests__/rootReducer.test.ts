import { rootReducer } from '../rootReducer';

import { initialState as ingredientsInitial } from '../ingredientsSlice';
import { initialState as constructorInitial } from '../constructorSlice';
import { initialState as orderInitial } from '../orderSlice';
import { initialState as feedInitial } from '../feedSlice';
import { initialState as userInitial } from '../userSlice';
import { initialState as modalInitial } from '../modalSlice';

describe('тесты rootReducer', () => {
  it('начальное состояние при UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({
      ingredients: ingredientsInitial,
      order: orderInitial,
      feed: feedInitial,
      user: userInitial,
      burgerConstructor: constructorInitial,
      modal: modalInitial,
    });
  });
});