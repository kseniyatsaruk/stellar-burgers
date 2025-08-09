import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { fetchAllOrders, selectFeedOrders } from '../../slices/feedSlice';
import {
  fetchUserOrderHistory,
  selectUserOrders
} from '../../slices/orderSlice';

type OrderInfoProps = {
  isTitle?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({ isTitle }) => {
  const dispatch = useDispatch();
  const params = useParams<{ number: string }>();
  const orders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const navigate = useNavigate();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const isProfileOrder = location.pathname.includes('/profile/orders');
  const ordersSource = isProfileOrder ? userOrders ?? [] : orders ?? [];
  const title = `#${params.number}`;

  useEffect(() => {
    if (isProfileOrder) {
      if (!userOrders?.length) {
        dispatch(fetchUserOrderHistory());
      }
    } else {
      if (!orders?.length) {
        dispatch(fetchAllOrders());
      }
    }
  }, [dispatch, isProfileOrder]);

  const orderNumber = useMemo(() => {
    if (!params.number) {
      navigate(isProfileOrder ? '/profile/orders' : '/feed', { replace: true });
      return null;
    }
    return parseInt(params.number);
  }, [params.number, navigate]);

  const orderData = useMemo(() => {
    if (!orderNumber) return null;
    return ordersSource.find((item) => item.number === orderNumber);
  }, [orderNumber, ordersSource]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} title={isTitle ? title : ''} />;
};
