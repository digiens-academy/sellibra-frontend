import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { userApi } from '../api/userApi';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    etsyStoreUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        etsyStoreUrl: user.etsyStoreUrl || '',
      });
    }
  }, [user]);

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
    setSubmitting(true);

    try {
      const response = await userApi.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profil güncellendi');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Profil güncellenirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2>Profil Ayarları</h2>
          <p>Hesap bilgilerinizi güncelleyin</p>
        </div>

        <Row>
          <Col lg={8} md={10} className="mx-auto mb-4">
            <Card>
              <Card.Body>
                <h5 className="mb-4">Profil Bilgileri</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ad</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>E-posta</Form.Label>
                    <Form.Control
                      type="email"
                      value={user?.email}
                      disabled
                    />
                    <Form.Text className="text-muted">
                      E-posta adresi değiştirilemez
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Telefon Numarası</Form.Label>
                    <PhoneInput
                      country={'tr'}
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: 'phoneNumber',
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
                    <Form.Label>Etsy Mağaza URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="etsyStoreUrl"
                      value={formData.etsyStoreUrl}
                      onChange={handleChange}
                      placeholder="https://etsy.com/shop/yourshop"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;

