import modalReducer, {
  initialState,
  openModal,
  closeModal,
  selectIsModalOpened
} from '../modalSlice';

describe('тесты modalSlice', () => {
  it('открыть модальное окно при openModal', () => {
    const state = modalReducer(initialState, openModal());
    expect(state.isModalOpened).toBe(true);
  });

  it('закрыть модальное окно при closeModal', () => {
    const openedState = { isModalOpened: true };
    const state = modalReducer(openedState, closeModal());
    expect(state.isModalOpened).toBe(false);
  });

  it('selectIsModalOpened возвращает текущее состояние модального окна', () => {
    const stateOpen = { modal: { isModalOpened: true } };
    expect(selectIsModalOpened(stateOpen)).toBe(true);

    const stateClosed = { modal: { isModalOpened: false } };
    expect(selectIsModalOpened(stateClosed)).toBe(false);
  });
});
