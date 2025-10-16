import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (user?.role !== USER_ROLES.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default AdminRoute;

