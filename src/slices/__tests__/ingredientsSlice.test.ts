import ingredientsReducer, {
  initialState,
  fetchIngredients,
  selectIngredients,
  selectLoading
} from '../ingredientsSlice';
import { mockIngredients } from '../fixtures';

describe('тесты ingredientsSlice', () => {
  it('установить loading = true при request', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('записывать ингредиенты и отключать loading при success', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('отключать loading при failed', () => {
    const action = { type: fetchIngredients.rejected.type, error: { message: 'Ошибка' } };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual([]);
  });

  it('selectIngredients возвращает ingredients', () => {
    const state = { ingredients: { ...initialState, ingredients: mockIngredients } };
    expect(selectIngredients(state)).toEqual(mockIngredients);
  });

  it('selectLoading возвращает loading', () => {
    const state = { ingredients: { ...initialState, loading: true } };
    expect(selectLoading(state)).toBe(true);
  });
});
