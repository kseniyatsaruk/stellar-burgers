import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { LoginUI } from '@ui-pages';
import {
  fetchLoginUser,
  selectLoading
} from '../../slices/burgerConstructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectErrorText,
  clearError
} from '../../slices/burgerConstructorSlice';
import { Preloader } from '@ui';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectErrorText);
  const isLoading = useSelector(selectLoading);

  useEffect(() => {
    dispatch(clearError());
  }, []);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(clearError());
      dispatch(fetchLoginUser({ email, password }))
        .unwrap()
        .then((payload) => {
          setCookie('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
        })
        .catch((err) => console.error('Ошибка входа:', err?.message));
    },
    [dispatch]
  );

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
