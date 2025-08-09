import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { fetchLogout } from '../../slices/userSlice';
import { useDispatch } from '../../services/store';
import { deleteCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(fetchLogout())
      .unwrap()
      .then((payload) => {
        if (payload.success) {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        }
        navigate('/', { replace: true });
      })
      .catch((err) => console.error('Ошибка выхода:', err?.message));
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
