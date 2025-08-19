import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders, fetchAllOrders } from '../../slices/feedSlice';
import { fetchIngredients } from '../../slices/ingredientsSlice';
export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleRefreshOrders = useCallback(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleRefreshOrders} />;
};
