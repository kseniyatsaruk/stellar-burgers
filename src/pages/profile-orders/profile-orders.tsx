import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  fetchIngredients,
  fetchUserOrderHistory,
  clearUserOrders,
  selectUserOrders
} from '../../slices/burgerConstructorSlice';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    dispatch(clearUserOrders());
    Promise.all([
      dispatch(fetchIngredients()),
      dispatch(fetchUserOrderHistory())
    ]);
  }, [dispatch]);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
