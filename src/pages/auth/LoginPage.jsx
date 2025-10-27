import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
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
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to={ROUTES.HOME} className="logo-container">
            <img src="/logo-with-sellibra.svg" alt="Sellibra" />
          </Link>
          <p>PrintNest Tracking Platformuna Hoş Geldiniz</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>E-posta Adresi</Form.Label>
            <Form.Control
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <Form.Label style={{ margin: 0 }}>Şifre</Form.Label>
              <button
                type="button"
                onClick={handleOpenForgotModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: 0,
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Şifremi Unuttum?
              </button>
            </div>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="btn-auth"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>
            Hesabınız yok mu?{' '}
            <Link to={ROUTES.REGISTER}>Kayıt Ol</Link>
          </p>
        </div>
      </div>

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
    </div>
  );
};

export default LoginPage;

