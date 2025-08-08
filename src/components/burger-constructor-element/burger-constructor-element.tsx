import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  removeIngredient,
  moveIngredient
} from '../../slices/burgerConstructorSlice';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMove = useCallback(
      (direction: 'up' | 'down') => {
        dispatch(moveIngredient({ ingredient, direction }));
      },
      [dispatch]
    );

    const handleClose = useCallback(() => {
      dispatch(removeIngredient(ingredient));
    }, [dispatch]);

    const moveUp = useCallback(() => handleMove('up'), [handleMove]);
    const moveDown = useCallback(() => handleMove('down'), [handleMove]);

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={moveUp}
        handleMoveDown={moveDown}
        handleClose={handleClose}
      />
    );
  }
);
