import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedOrders,
  fetchAllOrders,
  clearOrders,
  fetchIngredients
} from '../../slices/burgerConstructorSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchAllOrders())]);
  }, []);

  const handleRefreshOrders = useCallback(() => {
    dispatch(clearOrders()), dispatch(fetchAllOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefreshOrders} />;
};
