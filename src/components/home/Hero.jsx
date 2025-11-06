import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { ROUTES } from "../../utils/constants";

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

  const scrollToSellibraFeatures = () => {
    const element = document.getElementById('sellibra-features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToPricing = () => {
    const element = document.getElementById('pricing-comparison');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-section-new">
      <div className="hero-overlay"></div>
      <button 
        className="hero-price-badge"
        onClick={scrollToPricing}
        aria-label="En Uygun Fiyat"
      >
        <span className="hero-price-badge__word">EN</span>
        <span className="hero-price-badge__word">UYGUN</span>
        <span className="hero-price-badge__word">FİYAT</span>
      </button>
      <div className="hero-content-wrapper">
        <div className="hero-text-content">
          <h1 className="hero-main-title">Etsy'de yalnız değilsiniz.</h1>
          <p className="hero-main-description">
            <strong>Sellibra</strong>, binlerce satıcının büyüdüğü bir
            topluluğun parçasıdır.
          </p>
          <p className="hero-main-description">
            Her ay yüzlerce yeni kullanıcı, tasarımlarını dünya çapında satışa
            dönüştürüyor.
          </p>
          <p 
            className="hero-main-description clickable"
            onClick={scrollToSellibraFeatures}
          >
            Sellibra yapay zeka entegrasyonu ile sizi üst seviyeye taşır.
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
