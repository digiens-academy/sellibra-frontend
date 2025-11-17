import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    etsyStoreUrl: '',
  });

  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await register(formData);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <section className="register-section">
      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Sol Taraf - Görsel/Pattern */}
          <Col lg={5} className="d-none d-lg-block register-image-col">
            <div className="register-image-wrapper">
              <img 
                src="/59271.jpg" 
                alt="Register" 
                className="register-background-image"
              />
              <div className="pattern-overlay"></div>
              <div className="register-image-content">
                <h2>Sellibra'ya Hoş Geldiniz</h2>
                <p>E-ticaret yolculuğunuza bugün başlayın</p>
                <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded border border-warning">
                  <p className="mb-0 small text-warning-emphasis">
                    <strong>⚠️ Önemli Duyuru:</strong> Etsy Mağaza Bilgilerini Girmeyen Kullanıcıların Dikkatine, 
                    30 Kasım 2025 tarihine kadar etsy mağaza url bilgisi girilmemiş hesaplar kapatılacaktır.
                  </p>
                </div>
              </div>
            </div>
          </Col>

          {/* Sağ Taraf - Form */}
          <Col lg={7} className="d-flex align-items-center justify-content-center">
            <div className="register-form-container">
              <div className="text-center mb-4">
                <img 
                  src="/59271.jpg" 
                  alt="Background" 
                  className="register-logo-background-image"
                />
                <div className="register-logo-overlay"></div>
                <div className="register-logo-content">
                  <Link to={ROUTES.HOME} className="d-inline-block mb-3">
                    <img 
                      src="/logo-with-sellibra.svg" 
                      alt="Sellibra" 
                      className="register-logo"
                    />
                  </Link>
                  <h2 className="register-title">Hemen Kayıt Olun</h2>
                  <p className="register-subtitle">
                    Formu doldurarak kayıt olabilirsiniz.
                  </p>
                </div>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Ad</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Adınız"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Soyad</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">E-posta Adresi</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">Telefon Numarası</Form.Label>
                  <PhoneInput
                    country={'tr'}
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phoneNumber',
                      disabled: loading,
                    }}
                    containerClass="phone-input-container"
                    inputClass="form-control"
                    buttonClass="phone-input-button"
                    dropdownClass="phone-input-dropdown"
                    enableSearch={true}
                    searchPlaceholder="Ülke ara..."
                    placeholder="5XX XXX XX XX"
                  />
                  <Form.Text className="text-muted">
                    Ülke kodunu seçin ve telefon numaranızı girin
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    Etsy Mağaza URL <span className="text-muted small">(Opsiyonel)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="etsyStoreUrl"
                    placeholder="Etsy URL veya mağaza adı"
                    value={formData.etsyStoreUrl}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                  <Form.Text className="text-muted">
                    Etsy mağaza URL'nizi veya sadece mağaza adınızı giriniz. 30 Kasım 2025'e kadar girebilirsiniz.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-control-modern"
                  />
                  <Form.Text className="text-muted">
                    En az 6 karakter olmalıdır
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="btn-register-modern w-100"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                </Button>

                <p className="text-center text-muted mt-4 mb-0">
                  Zaten hesabınız var mı?{' '}
                  <Link to={ROUTES.LOGIN} className="register-link">
                    Giriş Yap
                  </Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RegisterPage;

