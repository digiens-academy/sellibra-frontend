import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { authApi } from '../../api/authApi';
import { ROUTES } from '../../utils/constants';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    // Verify token on page load
    const verifyToken = async () => {
      try {
        await authApi.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Geçersiz veya süresi dolmuş link. Lütfen yeni bir şifre sıfırlama talebi oluşturun.');
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('Geçersiz link');
      setVerifying(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Şifre sıfırlanırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Link to={ROUTES.HOME} className="logo-container">
              <img src="/logo-with-sellibra.svg" alt="Sellibra" />
            </Link>
            <p>Link doğrulanıyor...</p>
          </div>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Link to={ROUTES.HOME} className="logo-container">
              <img src="/logo-with-sellibra.svg" alt="Sellibra" />
            </Link>
            <p>Şifre Sıfırlama</p>
          </div>

          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" className="btn-auth">
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <Link to={ROUTES.HOME} className="logo-container">
              <img src="/logo-with-sellibra.svg" alt="Sellibra" />
            </Link>
            <p>Şifre Sıfırlama</p>
          </div>

          <Alert variant="success" className="mb-3">
            ✅ Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz...
          </Alert>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to={ROUTES.LOGIN}>
              <Button variant="primary" className="btn-auth">
                Hemen Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to={ROUTES.HOME} className="logo-container">
            <img src="/logo-with-sellibra.svg" alt="Sellibra" />
          </Link>
          <p>Yeni Şifre Belirleyin</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Yeni Şifre</Form.Label>
            <Form.Control
              type="password"
              placeholder="En az 6 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
            <Form.Text className="text-muted">
              Şifreniz en az 6 karakter olmalıdır
            </Form.Text>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Şifre Tekrar</Form.Label>
            <Form.Control
              type="password"
              placeholder="Şifrenizi tekrar girin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Şifre Sıfırlanıyor...' : 'Şifremi Sıfırla'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>
            <Link to={ROUTES.LOGIN}>Giriş Sayfasına Dön</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

