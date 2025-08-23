import feedReducer, {
  initialState,
  clearOrders,
  fetchAllOrders,
  selectFeedOrders,
  selectTotalOrders,
  selectTodayOrders
} from '../feedSlice';
import { mockOrder } from '../fixtures';

describe('тесты feedSlice', () => {
  it('очищать заказы', () => {
    const stateWithOrders = { ...initialState, orders: [mockOrder] };
    const state = feedReducer(stateWithOrders, clearOrders());
    expect(state.orders).toEqual([]);
  });

  it('записывать данные при success', () => {
    const payload = { orders: [mockOrder], total: 10, totalToday: 5 };
    const action = { type: fetchAllOrders.fulfilled.type, payload };
    const state = feedReducer(initialState, action);

    expect(state.orders).toEqual(payload.orders);
    expect(state.totalOrders).toBe(payload.total);
    expect(state.ordersToday).toBe(payload.totalToday);
  });

  it('не менять состояние при request', () => {
    const action = { type: fetchAllOrders.pending.type };
    const state = feedReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('не менять состояние при failed', () => {
    const action = { type: fetchAllOrders.rejected.type };
    const state = feedReducer(initialState, action);
    expect(state).toEqual(initialState);
  });

  it('селекторы возвращают корректные данные', () => {
  const state = {
    feed: { orders: [mockOrder], totalOrders: 20, ordersToday: 7 }
  };

  expect(selectFeedOrders(state)).toEqual([mockOrder]);
  expect(selectTotalOrders(state)).toBe(20);
  expect(selectTodayOrders(state)).toBe(7);
  });
});
