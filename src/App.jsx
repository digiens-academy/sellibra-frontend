import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/authStore';

// Components
import Header from './components/common/Header';
import PrivateRoute from './components/common/PrivateRoute';
import PremiumRoute from './components/common/PremiumRoute';
import AdminRoute from './components/common/AdminRoute';
import AnnouncementModal from './components/common/AnnouncementModal';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import PrintNestDashboard from './pages/printnest/PrintNestDashboard';
import PrintNestPage from './pages/PrintNestPage';
import EtsyAIDashboard from './pages/etsy-ai/EtsyAIDashboard';
import DesignPage from './pages/etsy-ai/DesignPage';
import RemoveBackgroundPage from './pages/etsy-ai/design/RemoveBackgroundPage';
import TextToImagePage from './pages/etsy-ai/design/TextToImagePage';
import ImageToImagePage from './pages/etsy-ai/design/ImageToImagePage';
import MockupGeneratorPage from './pages/etsy-ai/design/MockupGeneratorPage';
import DescriptionPage from './pages/etsy-ai/DescriptionPage';
import TitlePage from './pages/etsy-ai/TitlePage';
import ProfitCalculatorPage from './pages/etsy-ai/ProfitCalculatorPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';

// Constants
import { ROUTES } from './utils/constants';

function App() {
  const { checkAuth, user } = useAuthStore();

  // Check and update user data on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="App">
        {/* Announcement Modal - Show only for logged-in users */}
        {user && <AnnouncementModal />}
        
        <Routes>
          {/* Home Page - No Header */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          
          {/* Auth Routes - No Header */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          
          {/* Private Routes - With Header */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <Dashboard />
                </>
              </PrivateRoute>
            }
          />

          {/* PrintNest Module */}
          <Route
            path={ROUTES.PRINTNEST_DASHBOARD}
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <PrintNestDashboard />
                </>
              </PrivateRoute>
            }
          />
          
          <Route
            path={ROUTES.PRINTNEST}
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <PrintNestPage />
                </>
              </PrivateRoute>
            }
          />

          {/* Etsy-AI Module - Nested Routes - PREMIUM ONLY */}
          <Route
            path="/etsy-ai"
            element={
              <PrivateRoute>
                <PremiumRoute>
                  <>
                    <Header />
                    <EtsyAIDashboard />
                  </>
                </PremiumRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/etsy-ai/design" replace />} />
            <Route path="dashboard" element={<Navigate to="/etsy-ai/design" replace />} />
            <Route path="design" element={<DesignPage />} />
            <Route path="design/remove-background" element={<RemoveBackgroundPage />} />
            <Route path="design/text-to-image" element={<TextToImagePage />} />
            <Route path="design/image-to-image" element={<ImageToImagePage />} />
            {/* <Route path="design/mockup-generator" element={<MockupGeneratorPage />} /> Sonra eklenebilir dursun*/}
            <Route path="description" element={<DescriptionPage />} />
            <Route path="title" element={<TitlePage />} />
            <Route path="profit-calculator" element={<ProfitCalculatorPage />} />
          </Route>
          
          {/* Profile */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <PrivateRoute>
                <>
                  <Header />
                  <ProfilePage />
                </>
              </PrivateRoute>
            }
          />
          
          {/* Admin Routes */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <AdminRoute>
                <>
                  <Header />
                  <AdminDashboard />
                </>
              </AdminRoute>
            }
          />
          
          <Route
            path="/admin/announcements"
            element={
              <AdminRoute>
                <>
                  <Header />
                  <AnnouncementManagement />
                </>
              </AdminRoute>
            }
          />
          
          {/* 404 - Redirect to home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
