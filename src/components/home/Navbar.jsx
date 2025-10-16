import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleActionClick = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <nav className="home-navbar">
      <div className="home-navbar-container">
        <Link to={ROUTES.HOME} className="home-navbar-logo">
            <img src="logo-with-sellibra.svg" alt="Sellibra Etsy Pro" className="w-32 sm:w-44 cursor-pointer" onClick={() => navigate("/")}/>
        </Link>

        <div className="home-navbar-actions">
          <button 
            className="home-navbar-btn"
            onClick={handleActionClick}
          >
            {isAuthenticated ? 'Dashboard\'a Git' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

