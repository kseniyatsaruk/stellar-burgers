import userReducer, {
  initialState,
  initializeApp,
  setError,
  clearError,
  fetchLoginUser,
  fetchRegisterUser,
  getUserThunk,
  fetchLogout,
  fetchUpdateUser,
  selectUser,
  selectIsAuthenticated,
  selectIsInit,
  selectLoading,
  selectErrorText
} from '../userSlice';
import { mockUser } from '../fixtures';

describe('тесты userSlice', () => {
  it('устанавливать isInit при initializeApp', () => {
    const state = userReducer(initialState, initializeApp());
    expect(state.isInit).toBe(true);
  });

  it('устанавливать и очищать error через setError/clearError', () => {
    let state = userReducer(initialState, setError('Ошибка'));
    expect(state.errorText).toBe('Ошибка');

    state = userReducer(state, clearError());
    expect(state.errorText).toBe('');
  });

  it('устанавливать loading при request', () => {
    const state = userReducer(initialState, { type: fetchLoginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.errorText).toBe('');
  });

  it('аутентифицировать пользователя при success', () => {
    const state = userReducer(initialState, { type: fetchLoginUser.fulfilled.type });
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('записывать ошибку при failed', () => {
    const state = userReducer(initialState, {
      type: fetchLoginUser.rejected.type,
      error: { message: 'Ошибка входа' }
    });
    expect(state.loading).toBe(false);
    expect(state.errorText).toBe('Ошибка входа');
  });

  it('аутентифицировать пользователя при success', () => {
    const state = userReducer(initialState, { type: fetchRegisterUser.fulfilled.type });
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('записывать данные пользователя при success', () => {
    const payload = { user: mockUser };
    const state = userReducer(initialState, { type: getUserThunk.fulfilled.type, payload });

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('сбрасывать пользователя при failed', () => {
    const startState = { ...initialState, user: mockUser, isAuthenticated: true };
    const state = userReducer(startState, { type: getUserThunk.rejected.type });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.loading).toBe(false);
  });

  it('сбрасывать пользователя при success (Logout)', () => {
    const startState = { ...initialState, user: mockUser, isAuthenticated: true };
    const state = userReducer(startState, { type: fetchLogout.fulfilled.type });
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
  });

  it('обновлять пользователя при success = true', () => {
    const payload = { success: true, user: { name: 'Новый', email: 'new@test.com' } };
    const state = userReducer(initialState, { type: fetchUpdateUser.fulfilled.type, payload });
    expect(state.user).toEqual(payload.user);
    expect(state.loading).toBe(false);
  });

  it('не менять пользователя при success = false', () => {
    const startState = { ...initialState, user: { name: 'Старый', email: 'old@test.com' } };
    const payload = { success: false, user: { name: 'Новый', email: 'new@test.com' } };
    const state = userReducer(startState, { type: fetchUpdateUser.fulfilled.type, payload });
    expect(state.user).toEqual(startState.user);
    expect(state.loading).toBe(false);
  });

  it('selectUser возвращает user', () => {
    const state = { user: { ...initialState, user: mockUser } };
    expect(selectUser(state)).toEqual(mockUser);
  });

  it('selectIsAuthenticated возвращает isAuthenticated', () => {
    const state = { user: { ...initialState, isAuthenticated: true } };
    expect(selectIsAuthenticated(state)).toBe(true);
  });

  it('selectIsInit возвращает isInit', () => {
    const state = { user: { ...initialState, isInit: true } };
    expect(selectIsInit(state)).toBe(true);
  });

  it('selectLoading возвращает loading', () => {
    const state = { user: { ...initialState, loading: true } };
    expect(selectLoading(state)).toBe(true);
  });

  it('selectErrorText возвращает errorText', () => {
    const state = { user: { ...initialState, errorText: 'Ошибка' } };
    expect(selectErrorText(state)).toBe('Ошибка');
  });
});
