import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  fetchRegisterUser,
  getUserThunk,
  clearError,
  selectErrorText,
  selectLoading
} from '../../slices/userSlice';
import { Preloader } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { setCookie } from '../../utils/cookie';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectErrorText);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch(
        fetchRegisterUser({
          name: userName,
          password: password,
          email: email
        })
      )
        .unwrap()
        .then((payload) => {
          localStorage.setItem('refreshToken', payload.refreshToken);
          setCookie('accessToken', payload.accessToken);
          dispatch(getUserThunk());
        })
        .catch((err) => console.error('Ошибка:', err?.message));
    },
    [dispatch, userName, password, email]
  );

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
