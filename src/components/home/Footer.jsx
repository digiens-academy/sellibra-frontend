import { Link } from 'react-router-dom';
import { FaRocket, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="home-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo-with-sellibra.svg" alt="Sellibra" style={{ height: '1.75rem', width: 'auto' }} />
            </div>
            <p className="footer-description">
              E-ticaret işletmenizi dijitalleştirin ve büyütün. 
              AI destekli araçlarla işinizi bir üst seviyeye taşıyın.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-heading">Hızlı Bağlantılar</h3>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.HOME}>Ana Sayfa</Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN}>Giriş Yap</Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER}>Kayıt Ol</Link>
              </li>
              <li>
                <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div className="footer-section">
            <h3 className="footer-heading">Modüller</h3>
            <ul className="footer-links">
              <li>
                <Link to={ROUTES.PRINTNEST_DASHBOARD}>PrintNest</Link>
              </li>
              <li>
                <Link to={ROUTES.ETSY_AI_DASHBOARD}>Etsy-AI Tools</Link>
              </li>
              <li>
                <Link to={ROUTES.ETSY_AI_DESIGN}>AI Tasarım</Link>
              </li>
              <li>
                <Link to={ROUTES.ETSY_AI_PROFIT}>Kar Hesaplama</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3 className="footer-heading">İletişim</h3>
            <ul className="footer-contact">
              <li>
                <FaEnvelope className="contact-icon" />
                <span>destek@digiensacademy.com</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+90 (850) 308 25 35</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Sellibra. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

