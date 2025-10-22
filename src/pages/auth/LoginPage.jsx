import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login({ email, password });
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
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
            <Form.Label>Şifre</Form.Label>
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
    </div>
  );
};

export default LoginPage;

