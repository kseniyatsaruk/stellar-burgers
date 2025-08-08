import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { addIngredient } from '../../slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count, index }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = useCallback(() => {
      dispatch(addIngredient(ingredient));
    }, [dispatch, ingredient]);

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        index={index}
      />
    );
  }
);
