import { useNavigate } from 'react-router-dom';
import { FaPalette, FaRobot, FaCheck } from 'react-icons/fa';
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
    <section className="hero-section">
      <div className="hero-container">
        {/* Main Hero */}
        <div className="hero-main">
          <h1 className="hero-title">
            E-Ticaret İşinizi <span className="gradient-text">Dijitalleştirin</span>
          </h1>
          <p className="hero-subtitle">
            PrintNest entegrasyonu ve AI destekli Etsy araçlarıyla işletmenizi bir üst seviyeye taşıyın
          </p>
          <button className="hero-cta-btn" onClick={handleGetStarted}>
            Hemen Başlayın
          </button>
        </div>

        {/* Features */}
        <div className="hero-features">
          {/* PrintNest Feature */}
          <div className="feature-card printnest-card">
            <div className="feature-icon">
              <FaPalette style={{ color: '#00D4A0' }} />
            </div>
            <h3 className="feature-title">PrintNest Entegrasyonu</h3>
            <p className="feature-description">
              PrintNest platformu ile tam entegrasyon. Siparişlerinizi takip edin, 
              ürünlerinizi yönetin ve işlerinizi kolaylaştırın.
            </p>
            <ul className="feature-list">
              <li><FaCheck /> Gerçek zamanlı sipariş takibi</li>
              <li><FaCheck /> Otomatik ürün senkronizasyonu</li>
              <li><FaCheck /> Detaylı raporlama ve analitik</li>
              <li><FaCheck /> Kolay yönetim paneli</li>
            </ul>
          </div>

          {/* Etsy-AI Feature */}
          <div className="feature-card etsy-ai-card">
            <div className="feature-icon">
              <FaRobot style={{ color: '#4A90E2' }} />
            </div>
            <h3 className="feature-title">Etsy-AI Araçları</h3>
            <p className="feature-description">
              Yapay zeka destekli araçlarla Etsy mağazanızı optimize edin. 
              Tasarımdan içerik oluşturmaya kadar her şey sizin için hazır.
            </p>
            <ul className="feature-list">
              <li><FaCheck /> AI ile görsel tasarım</li>
              <li><FaCheck /> Arka plan kaldırma</li>
              <li><FaCheck /> SEO uyumlu başlık ve açıklama</li>
              <li><FaCheck /> Kar hesaplama aracı</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

