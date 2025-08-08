import { FC, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectIsInit
} from '../../slices/burgerConstructorSlice';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
  unAuthOnly?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  unAuthOnly = false
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInit = useSelector(selectIsInit);
  const location = useLocation();

  const { shouldRedirect, redirectTo, redirectState } = useMemo(() => {
    const authCheckFailed = unAuthOnly ? isAuthenticated : !isAuthenticated;
    const from = location.state?.from || '/';

    return {
      shouldRedirect: isInit && authCheckFailed,
      redirectTo: unAuthOnly ? from : '/login',
      redirectState: unAuthOnly ? undefined : { from: location }
    };
  }, [isInit, isAuthenticated, unAuthOnly, location]);

  if (!isInit) {
    return <Preloader />;
  }

  if (shouldRedirect) {
    return <Navigate replace to={redirectTo} state={redirectState} />;
  }

  return children;
};
