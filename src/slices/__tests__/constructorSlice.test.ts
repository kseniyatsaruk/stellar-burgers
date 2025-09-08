import constructorReducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectConstructorItems
} from '../constructorSlice';
import { bunIngredient, mainIngredient } from '../fixtures';

describe('тесты constructorSlice', () => {
  it('добавить булочку', () => {
    const state = constructorReducer(initialState, addIngredient(bunIngredient));
    expect(state.constructorItems.bun).toEqual(bunIngredient);
  });

  it('добавить ингредиент', () => {
    const state = constructorReducer(initialState, addIngredient(mainIngredient));
    const added = state.constructorItems.ingredients[0];
    expect(state.constructorItems.ingredients.length).toBe(1);
    expect(added).toMatchObject(mainIngredient);
    expect(added).toHaveProperty('uniqueId');
  });

  it('удалить ингредиент по uniqueId', () => {
    let state = constructorReducer(initialState, addIngredient(mainIngredient));
    const added = state.constructorItems.ingredients[0];
    state = constructorReducer(state, removeIngredient(added));
    expect(state.constructorItems.ingredients.length).toBe(0);
  });

  it('не удалять, если uniqueId не найден', () => {
    let state = constructorReducer(initialState, addIngredient(mainIngredient));
    state = constructorReducer(state, removeIngredient({ ...mainIngredient, uniqueId: 'nothing' }));
    expect(state.constructorItems.ingredients.length).toBe(1);
  });

  it('менять порядок ингредиентов вверх (up)', () => {
    let state = constructorReducer(initialState, addIngredient({ ...mainIngredient, _id: 'ing_1' }));
    state = constructorReducer(state, addIngredient({ ...mainIngredient, _id: 'ing_2', name: 'Биокотлета' }));

    const first = state.constructorItems.ingredients[0];
    const second = state.constructorItems.ingredients[1];

    state = constructorReducer(state, moveIngredient({ ingredient: second, direction: 'up' }));

    expect(state.constructorItems.ingredients[0]).toEqual(second);
    expect(state.constructorItems.ingredients[1]).toEqual(first);
  });

  it('менять порядок ингредиентов вниз (down)', () => {
    let state = constructorReducer(initialState, addIngredient({ ...mainIngredient, _id: 'ing_1' }));
    state = constructorReducer(state, addIngredient({ ...mainIngredient, _id: 'ing_2', name: 'Биокотлета' }));

    const first = state.constructorItems.ingredients[0];
    const second = state.constructorItems.ingredients[1];

    state = constructorReducer(state, moveIngredient({ ingredient: first, direction: 'down' }));

    expect(state.constructorItems.ingredients[0]).toEqual(second);
    expect(state.constructorItems.ingredients[1]).toEqual(first);
  });

  it('очищать конструктор', () => {
    let state = constructorReducer(initialState, addIngredient(bunIngredient));
    state = constructorReducer(state, addIngredient(mainIngredient));
    state = constructorReducer(state, clearConstructor());
    expect(state).toEqual(initialState);
  });

  it('selectConstructorItems возвращает конструктор', () => {
    const state = {
      burgerConstructor: {
        constructorItems: {
          bun: { price: 0 },
          ingredients: [{ ...mainIngredient, uniqueId: 'unique-1' }]
        }
      }
    };

    expect(selectConstructorItems(state)).toEqual(state.burgerConstructor.constructorItems);
  });
});
