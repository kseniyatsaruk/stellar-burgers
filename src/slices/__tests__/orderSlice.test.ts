import orderReducer, {
  initialState,
  fetchNewOrder,
  fetchUserOrderHistory,
  clearUserOrders,
  closeOrderRequest,
  selectOrderModalData,
  selectOrderRequest,
  selectUserOrders
} from '../orderSlice';
import { mockOrder } from '../fixtures';

describe('тесты orderSlice', () => {
  it('выставить orderRequest = true при request', () => {
    const action = { type: fetchNewOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
  });

  it('сохранить orderModalData и выключить orderRequest при success', () => {
    const action = { type: fetchNewOrder.fulfilled.type, payload: { order: mockOrder } };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('выключать orderRequest при failed', () => {
    const action = { type: fetchNewOrder.rejected.type, error: { message: 'Ошибка' } };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
  });

  it('сохранять userOrders при success', () => {
    const mockOrders = [mockOrder];
    const action = { type: fetchUserOrderHistory.fulfilled.type, payload: mockOrders };
    const state = orderReducer(initialState, action);
    expect(state.userOrders).toEqual(mockOrders);
  });

  it('очищать userOrders при clearUserOrders', () => {
    const stateWithOrders = { ...initialState, userOrders: [mockOrder] };
    const state = orderReducer(stateWithOrders, clearUserOrders());
    expect(state.userOrders).toBeNull();
  });

  it('сбрасывать orderRequest и orderModalData при closeOrderRequest', () => {
    const stateWithOrder = { ...initialState, orderRequest: true, orderModalData: mockOrder };
    const state = orderReducer(stateWithOrder, closeOrderRequest());
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toBeNull();
  });

  it('selectOrderModalData возвращает orderModalData', () => {
    const state = { order: { ...initialState, orderModalData: mockOrder } };
    expect(selectOrderModalData(state)).toEqual(mockOrder);
  });

  it('selectOrderRequest возвращает orderRequest', () => {
    const state = { order: { ...initialState, orderRequest: true } };
    expect(selectOrderRequest(state)).toBe(true);
  });

  it('selectUserOrders возвращает userOrders', () => {
    const state = { order: { ...initialState, userOrders: [mockOrder] } };
    expect(selectUserOrders(state)).toEqual([mockOrder]);
  });
});
