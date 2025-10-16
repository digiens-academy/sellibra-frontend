import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default PrivateRoute;

