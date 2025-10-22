import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
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

  const { register, loading, error } = useAuthStore();
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

    const success = await register(formData);
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
          <p>Hemen Kayıt Olun</p>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Ad</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="Adınız"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Soyad</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Soyadınız"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>E-posta Adresi</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Telefon Numarası</Form.Label>
            <PhoneInput
              country={'tr'}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'phoneNumber',
                required: true,
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

          <Form.Group className="form-group">
            <Form.Label>Etsy Mağaza URL</Form.Label>
            <Form.Control
              type="text"
              name="etsyStoreUrl"
              placeholder="Etsy URL veya mağaza adı"
              value={formData.etsyStoreUrl}
              onChange={handleChange}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Etsy mağaza URL'nizi veya sadece mağaza adınızı giriniz.
            </Form.Text>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
            <Form.Text className="text-muted">
              En az 6 karakter olmalıdır
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="btn-auth"
            disabled={loading}
          >
            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </Button>
        </Form>

        <div className="auth-footer">
          <p>
            Zaten hesabınız var mı?{' '}
            <Link to={ROUTES.LOGIN}>Giriş Yap</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

