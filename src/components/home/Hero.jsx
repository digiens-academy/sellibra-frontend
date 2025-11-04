import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.REGISTER);
    }
  };

  return (
    <section className="hero-section-new">
      <div className="hero-overlay"></div>
      <div className="hero-content-wrapper">
        <div className="hero-text-content">
          <h1 className="hero-main-title">
            Etsy'de yalnız değilsiniz.
          </h1>
          <p className="hero-main-description">
            <strong>Sellibra</strong>, binlerce satıcının büyüdüğü bir topluluğun parçasıdır.
          </p>
          <p className="hero-main-description">
            Her ay yüzlerce yeni kullanıcı, tasarımlarını dünya çapında satışa dönüştürüyor.
          </p>
          <button className="hero-cta-btn" onClick={handleGetStarted}>
            Hemen Başlayın
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

