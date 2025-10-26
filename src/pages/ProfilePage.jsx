import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { userApi } from '../api/userApi';
import { etsyStoreApi } from '../api/etsyStoreApi';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Etsy stores state
  const [etsyStores, setEtsyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStore, setCurrentStore] = useState(null);
  const [storeFormData, setStoreFormData] = useState({
    storeUrl: '',
    storeName: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
      });
    }
  }, [user]);

  // Load Etsy stores
  useEffect(() => {
    loadEtsyStores();
  }, []);

  const loadEtsyStores = async () => {
    try {
      setLoadingStores(true);
      const response = await etsyStoreApi.getStores();
      setEtsyStores(response.data.stores);
    } catch (error) {
      console.error('Load stores error:', error);
      toast.error('Mağazalar yüklenirken hata oluştu');
    } finally {
      setLoadingStores(false);
    }
  };

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

  // Etsy store handlers
  const handleAddStore = () => {
    setStoreFormData({ storeUrl: '', storeName: '' });
    setShowAddModal(true);
  };

  const handleEditStore = (store) => {
    setCurrentStore(store);
    setStoreFormData({ storeUrl: store.storeUrl, storeName: store.storeName || '' });
    setShowEditModal(true);
  };

  const handleStoreFormChange = (e) => {
    setStoreFormData({
      ...storeFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await etsyStoreApi.addStore(storeFormData);
      toast.success('Mağaza eklendi');
      setShowAddModal(false);
      loadEtsyStores();
    } catch (error) {
      console.error('Add store error:', error);
      toast.error(error.response?.data?.message || 'Mağaza eklenirken hata oluştu');
    }
  };

  const handleEditStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await etsyStoreApi.updateStore(currentStore.id, storeFormData);
      toast.success('Mağaza güncellendi');
      setShowEditModal(false);
      loadEtsyStores();
    } catch (error) {
      console.error('Update store error:', error);
      toast.error('Mağaza güncellenirken hata oluştu');
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Bu mağazayı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await etsyStoreApi.deleteStore(storeId);
      toast.success('Mağaza silindi');
      loadEtsyStores();
    } catch (error) {
      console.error('Delete store error:', error);
      toast.error('Mağaza silinirken hata oluştu');
    }
  };

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2>Profil Ayarları</h2>
          <p>Hesap bilgilerinizi güncelleyin</p>
        </div>

        <Row className="g-4">
          {/* Sol Taraf - Profil Bilgileri */}
          <Col lg={6} md={12}>
            <Card className="h-100">
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

          {/* Sağ Taraf - Etsy Mağazaları */}
          <Col lg={6} md={12}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Etsy Mağazalarım</h5>
                  <Button variant="success" size="sm" onClick={handleAddStore}>
                    + Mağaza Ekle
                  </Button>
                </div>

                {loadingStores ? (
                  <p className="text-muted">Yükleniyor...</p>
                ) : etsyStores.length === 0 ? (
                  <p className="text-muted">Henüz mağaza eklenmemiş.</p>
                ) : (
                  <ListGroup>
                    {etsyStores.map((store) => (
                      <ListGroup.Item
                        key={store.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{store.storeName || 'İsimsiz Mağaza'}</strong>
                          <br />
                          <a
                            href={store.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted small"
                          >
                            {store.storeUrl}
                          </a>
                        </div>
                        <div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditStore(store)}
                          >
                            Düzenle
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteStore(store.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Store Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Mağaza Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddStoreSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mağaza URL *</Form.Label>
              <Form.Control
                type="url"
                name="storeUrl"
                value={storeFormData.storeUrl}
                onChange={handleStoreFormChange}
                placeholder="https://etsy.com/shop/yourshop"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mağaza Adı</Form.Label>
              <Form.Control
                type="text"
                name="storeName"
                value={storeFormData.storeName}
                onChange={handleStoreFormChange}
                placeholder="Mağaza adı (opsiyonel)"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                İptal
              </Button>
              <Button variant="primary" type="submit">
                Ekle
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Store Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mağazayı Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditStoreSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Mağaza URL *</Form.Label>
              <Form.Control
                type="url"
                name="storeUrl"
                value={storeFormData.storeUrl}
                onChange={handleStoreFormChange}
                placeholder="https://etsy.com/shop/yourshop"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mağaza Adı</Form.Label>
              <Form.Control
                type="text"
                name="storeName"
                value={storeFormData.storeName}
                onChange={handleStoreFormChange}
                placeholder="Mağaza adı (opsiyonel)"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                İptal
              </Button>
              <Button variant="primary" type="submit">
                Güncelle
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfilePage;

