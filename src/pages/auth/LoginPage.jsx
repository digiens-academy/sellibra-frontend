import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import useAuthStore from '../../store/authStore';
import { authApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await login({ email, password });
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      const response = await authApi.forgotPassword(forgotEmail);
      setForgotMessage(response.message || 'Şifre sıfırlama linki e-posta adresinize gönderildi.');
      setForgotEmail('');
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotMessage('');
      }, 3000);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleOpenForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail(email); // Pre-fill with login email if available
    setForgotError('');
    setForgotMessage('');
  };

  return (
    <section className="login-section">
      <Container fluid className="h-100">
        <Row className="h-100 g-0">
          {/* Sol Taraf - Form */}
          <Col lg={7} className="d-flex align-items-center justify-content-center">
            <div className="login-form-container">
              <div className="text-center mb-4">
                <img 
                  src="/59271.jpg" 
                  alt="Background" 
                  className="login-logo-background-image"
                />
                <div className="login-logo-overlay"></div>
                <div className="login-logo-content">
                  <Link to={ROUTES.HOME} className="d-inline-block mb-3">
                    <img 
                      src="/logo-with-sellibra.svg" 
                      alt="Sellibra" 
                      className="login-logo"
                    />
                  </Link>
                  <h2 className="login-title">Hoş Geldiniz</h2>
                  <p className="login-subtitle">
                    Hesabınıza giriş yapın
                  </p>
                </div>
              </div>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">E-posta Adresi</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ornek@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="form-label-modern mb-0">Şifre</Form.Label>
                    <button
                      type="button"
                      onClick={handleOpenForgotModal}
                      className="forgot-password-link"
                    >
                      Şifremi Unuttum?
                    </button>
                  </div>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="form-control-modern"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="btn-login-modern w-100"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>

                <p className="text-center text-muted mt-4 mb-0">
                  Hesabınız yok mu?{' '}
                  <Link to={ROUTES.REGISTER} className="login-link">
                    Kayıt Ol
                  </Link>
                </p>
              </Form>
            </div>
          </Col>

          {/* Sağ Taraf - Görsel/Pattern */}
          <Col lg={5} className="d-none d-lg-block login-image-col">
            <div className="login-image-wrapper">
              <img 
                src="/59271.jpg" 
                alt="Login" 
                className="login-background-image"
              />
              <div className="pattern-overlay"></div>
              <div className="login-image-content">
                <h2>Tekrar Hoş Geldiniz!</h2>
                <p>E-ticaret yolculuğunuza devam edin</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Forgot Password Modal */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Şifremi Unuttum</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotMessage && (
            <Alert variant="success" className="mb-3">
              {forgotMessage}
            </Alert>
          )}
          {forgotError && (
            <Alert variant="danger" className="mb-3">
              {forgotError}
            </Alert>
          )}
          <p style={{ marginBottom: '16px', color: '#6b7280' }}>
            E-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
          </p>
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3">
              <Form.Label>E-posta Adresi</Form.Label>
              <Form.Control
                type="email"
                placeholder="ornek@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={forgotLoading}
                autoFocus
              />
            </Form.Group>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => setShowForgotModal(false)}
                disabled={forgotLoading}
              >
                İptal
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={forgotLoading}
              >
                {forgotLoading ? 'Gönderiliyor...' : 'Gönder'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default LoginPage;

