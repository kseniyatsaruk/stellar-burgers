import { TIngredient, TOrder, TUser } from '@utils-types';

export const bunIngredient: TIngredient = {
  _id: 'bun_1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_large: '',
  image_mobile: '',
};

export const mainIngredient: TIngredient = {
  _id: 'ing_1',
  name: 'Котлета',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '',
  image_large: '',
  image_mobile: '',
};

export const mockIngredients: TIngredient[] = [bunIngredient, mainIngredient];

export const mockOrder: TOrder = {
  _id: '1',
  status: 'ready',
  name: 'Бургер',
  createdAt: '',
  updatedAt: '',
  number: 2,
  ingredients: ['Булка', 'Начинка']
};

export  const mockUser: TUser = {
    name: 'Test User',
    email: 'testUser@mail.ru'
  };