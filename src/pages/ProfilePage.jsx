import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal, Badge, Spinner } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { userApi } from '../api/userApi';
import { etsyStoreApi } from '../api/etsyStoreApi';
import { etsyOAuthApi } from '../api/etsyOAuthApi';
import useAuthStore from '../store/authStore';
import { toast } from 'react-toastify';
import { FaEtsy, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSync, FaPlug, FaUnlink } from 'react-icons/fa';

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
  const [connectingOAuth, setConnectingOAuth] = useState(false);

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
    checkOAuthCallback();
  }, []);

  // Check if we're coming back from OAuth callback
  const checkOAuthCallback = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('etsy_connected') === 'true') {
      const shopName = params.get('shop_name');
      toast.success(`Etsy mağazası başarıyla bağlandı: ${shopName || 'Mağaza'}`);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Reload stores
      loadEtsyStores();
    } else if (params.get('etsy_error')) {
      const error = params.get('etsy_error');
      const errorMessages = {
        missing_params: 'Bağlantı parametreleri eksik',
        invalid_state: 'Geçersiz bağlantı durumu',
        connection_failed: 'Bağlantı başarısız oldu',
      };
      toast.error(errorMessages[error] || 'Etsy bağlantısı başarısız oldu');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const loadEtsyStores = async () => {
    try {
      setLoadingStores(true);
      // Load stores with OAuth status
      const response = await etsyOAuthApi.getConnectionStatus();
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

  // OAuth handlers
  const handleConnectEtsy = async () => {
    try {
      setConnectingOAuth(true);
      const response = await etsyOAuthApi.initiateConnection();
      // Redirect to Etsy OAuth page
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      console.error('Connect Etsy error:', error);
      toast.error('Etsy bağlantısı başlatılamadı');
      setConnectingOAuth(false);
    }
  };

  const handleDisconnectStore = async (storeId, storeName) => {
    if (!window.confirm(`${storeName} mağazasının bağlantısını kesmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await etsyOAuthApi.disconnectStore(storeId);
      toast.success('Mağaza bağlantısı kesildi');
      loadEtsyStores();
    } catch (error) {
      console.error('Disconnect store error:', error);
      toast.error('Bağlantı kesilemedi');
    }
  };

  const handleRefreshToken = async (storeId) => {
    try {
      await etsyOAuthApi.refreshToken(storeId);
      toast.success('Token yenilendi');
      loadEtsyStores();
    } catch (error) {
      console.error('Refresh token error:', error);
      toast.error('Token yenilenemedi. Lütfen yeniden bağlanın.');
    }
  };

  const handleTestConnection = async (storeId) => {
    try {
      const response = await etsyOAuthApi.testConnection(storeId);
      if (response.data.connected) {
        toast.success('Bağlantı başarılı! ✅');
      } else {
        toast.error('Bağlantı başarısız ❌');
      }
    } catch (error) {
      console.error('Test connection error:', error);
      toast.error('Bağlantı testi başarısız');
    }
  };

  // Helper to get connection status badge
  const getConnectionBadge = (store) => {
    if (!store.isConnected) {
      return <Badge bg="secondary"><FaTimesCircle /> Bağlı Değil</Badge>;
    }
    if (store.tokenStatus === 'expired') {
      return <Badge bg="warning" text="dark"><FaExclamationTriangle /> Süre Dolmuş</Badge>;
    }
    if (store.tokenStatus === 'valid') {
      return <Badge bg="success"><FaCheckCircle /> Bağlı</Badge>;
    }
    return <Badge bg="secondary">Bilinmiyor</Badge>;
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

          {/* Sağ Taraf - Etsy Bölümü */}
          <Col lg={6} md={12}>
            {/* Kayıtlı Mağazalar (OAuth'suz) */}
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">📋 Kayıtlı Mağazalar</h5>
                  <Button variant="outline-primary" size="sm" onClick={handleAddStore}>
                    + Mağaza Ekle
                  </Button>
                </div>

                <div className="alert alert-light small mb-3">
                  <strong>ℹ️ Basit Kayıt:</strong> Mağaza URL'lerinizi kaydedin. 
                  API bağlantısı için aşağıdaki "Etsy OAuth" bölümünü kullanın.
                </div>

                {loadingStores ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" variant="primary" size="sm" />
                  </div>
                ) : etsyStores.filter(store => !store.isConnected && !store.shopId).length === 0 ? (
                  <p className="text-muted small text-center">Kayıtlı mağaza yok</p>
                ) : (
                  <ListGroup variant="flush">
                    {etsyStores
                      .filter(store => !store.isConnected && !store.shopId)
                      .map((store) => (
                        <ListGroup.Item key={store.id} className="px-0 py-2">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <strong className="d-block">{store.storeName || 'İsimsiz Mağaza'}</strong>
                              <a
                                href={store.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted small"
                              >
                                {store.storeUrl}
                              </a>
                            </div>
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
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
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            {/* Etsy OAuth Bağlantıları */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 d-flex align-items-center gap-2">
                    <FaEtsy style={{ color: '#F1641E' }} /> Etsy OAuth Bağlantıları
                  </h5>
                  <Button 
                    variant="success" 
                    size="sm" 
                    onClick={handleConnectEtsy}
                    disabled={connectingOAuth}
                    className="d-flex align-items-center gap-2"
                  >
                    {connectingOAuth ? (
                      <>
                        <Spinner size="sm" animation="border" />
                        Bağlanıyor...
                      </>
                    ) : (
                      <>
                        <FaPlug /> Etsy Bağla
                      </>
                    )}
                  </Button>
                </div>

                <div className="alert alert-success small mb-3">
                  <strong>🔐 OAuth ile Güvenli Bağlantı:</strong> Etsy mağazanızı güvenli OAuth protokolü ile bağlayın. 
                  Şifrenizi bizimle paylaşmanıza gerek yok!
                </div>

                {loadingStores ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Yükleniyor...</p>
                  </div>
                ) : etsyStores.filter(store => store.isConnected || store.shopId).length === 0 ? (
                  <div className="text-center py-4">
                    <FaEtsy size={48} style={{ color: '#F1641E', opacity: 0.3 }} />
                    <p className="text-muted mt-3">Henüz OAuth bağlantısı yok.</p>
                    <p className="small text-muted">
                      Yukarıdaki "Etsy Bağla" butonuna tıklayarak mağazanızı bağlayın.
                    </p>
                  </div>
                ) : (
                  <ListGroup>
                    {etsyStores
                      .filter(store => store.isConnected || store.shopId)
                      .map((store) => (
                        <ListGroup.Item key={store.id} className="p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <strong>{store.storeName || 'İsimsiz Mağaza'}</strong>
                                {getConnectionBadge(store)}
                              </div>
                              <a
                                href={store.storeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted small d-block mb-2"
                              >
                                {store.storeUrl}
                              </a>
                              {store.shopId && (
                                <small className="text-muted">Shop ID: {store.shopId}</small>
                              )}
                            </div>

                            <div className="d-flex flex-column gap-2">
                              {store.isConnected ? (
                                <>
                                  {store.tokenStatus === 'expired' && (
                                    <Button
                                      variant="warning"
                                      size="sm"
                                      onClick={() => handleRefreshToken(store.id)}
                                      className="d-flex align-items-center gap-1"
                                    >
                                      <FaSync /> Yenile
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleTestConnection(store.id)}
                                  >
                                    Test Et
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDisconnectStore(store.id, store.storeName)}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <FaUnlink /> Bağlantıyı Kes
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDeleteStore(store.id)}
                                >
                                  Sil
                                </Button>
                              )}
                            </div>
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

