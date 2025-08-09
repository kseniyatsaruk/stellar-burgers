import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchUserOrderHistory,
  clearUserOrders,
  selectUserOrders
} from '../../slices/orderSlice';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    Promise.all([
      dispatch(fetchIngredients()),
      dispatch(fetchUserOrderHistory())
    ]);
    return () => {
      dispatch(clearUserOrders());
    };
  }, [dispatch]);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
