import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const PremiumRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Önce authentication kontrolü
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Admin her zaman erişebilir
  if (user?.role === 'admin') {
    return children;
  }

  // Premium subscription kontrolü
  if (!user?.hasActiveSubscription) {
    toast.error('Bu özellik sadece premium aboneliği olan öğrenciler için kullanılabilir');
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default PremiumRoute;


