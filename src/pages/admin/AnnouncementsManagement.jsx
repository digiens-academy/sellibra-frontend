import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal } from 'react-bootstrap';
import { 
  getAllAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  activateAnnouncement, 
  deactivateAnnouncement, 
  deleteAnnouncement 
} from '../../api/announcementApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaTimesCircle 
} from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const AnnouncementsManagement = () => {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    startDate: '',
    endDate: '',
    isActive: true,
    // Hedef kitle özellikleri
    targetEveryone: true,
    targetRoles: [],
    targetSubscriptionType: 'all', // 'all', 'premium', 'non-premium'
    targetPrintNestStatus: 'all', // 'all', 'pending', 'confirmed'
    targetStoreStatus: 'all' // 'all', 'has-store', 'no-store'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await getAllAnnouncements(1, 100); // Tüm bildirimleri getir
      if (response.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error('Fetch announcements error:', error);
      toast.error('Bildirimler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
      targetEveryone: true,
      targetRoles: [],
      targetSubscriptionType: 'all',
      targetPrintNestStatus: 'all',
      targetStoreStatus: 'all'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (announcement) => {
    setModalMode('edit');
    setCurrentAnnouncement(announcement);
    
    // targetAudience'i parse et
    const target = announcement.targetAudience || {};
    const hasTarget = !!announcement.targetAudience;
    
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      startDate: new Date(announcement.startDate).toISOString().slice(0, 16),
      endDate: new Date(announcement.endDate).toISOString().slice(0, 16),
      isActive: announcement.isActive,
      targetEveryone: !hasTarget,
      targetRoles: target.roles || [],
      targetSubscriptionType: target.hasActiveSubscription === true ? 'premium' : 
                              target.hasActiveSubscription === false ? 'non-premium' : 'all',
      targetPrintNestStatus: target.printNestConfirmed === false ? 'pending' :
                             target.printNestConfirmed === true ? 'confirmed' : 'all',
      targetStoreStatus: target.hasEtsyStore === true ? 'has-store' :
                        target.hasEtsyStore === false ? 'no-store' : 'all'
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      type: 'info',
      startDate: '',
      endDate: '',
      isActive: true,
      targetEveryone: true,
      targetRoles: [],
      targetSubscriptionType: 'all',
      targetPrintNestStatus: 'all',
      targetStoreStatus: 'all'
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => {
      const roles = prev.targetRoles;
      const newRoles = roles.includes(role)
        ? roles.filter(r => r !== role)
        : [...roles, role];
      return { ...prev, targetRoles: newRoles };
    });
  };

  const buildTargetAudience = () => {
    // Eğer herkese gösterilecekse null döndür
    if (formData.targetEveryone) {
      return null;
    }

    const targetAudience = {};

    // Roller
    if (formData.targetRoles.length > 0) {
      targetAudience.roles = formData.targetRoles;
    }

    // Premium üyelik
    if (formData.targetSubscriptionType === 'premium') {
      targetAudience.hasActiveSubscription = true;
    } else if (formData.targetSubscriptionType === 'non-premium') {
      targetAudience.hasActiveSubscription = false;
    }

    // PrintNest durumu
    if (formData.targetPrintNestStatus === 'pending') {
      targetAudience.printNestConfirmed = false;
    } else if (formData.targetPrintNestStatus === 'confirmed') {
      targetAudience.printNestConfirmed = true;
    }

    // Mağaza durumu
    if (formData.targetStoreStatus === 'has-store') {
      targetAudience.hasEtsyStore = true;
    } else if (formData.targetStoreStatus === 'no-store') {
      targetAudience.hasEtsyStore = false;
    }

    // Eğer hiçbir kriter seçilmemişse null döndür
    return Object.keys(targetAudience).length > 0 ? targetAudience : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        targetAudience: buildTargetAudience()
      };

      if (modalMode === 'create') {
        await createAnnouncement(submitData);
        toast.success('Bildirim oluşturuldu');
      } else {
        await updateAnnouncement(currentAnnouncement.id, submitData);
        toast.success('Bildirim güncellendi');
      }
      
      handleCloseModal();
      fetchAnnouncements();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleToggleActive = async (announcement) => {
    try {
      if (announcement.isActive) {
        await deactivateAnnouncement(announcement.id);
        toast.success('Bildirim yayından kaldırıldı');
      } else {
        await activateAnnouncement(announcement.id);
        toast.success('Bildirim yayına alındı');
      }
      fetchAnnouncements();
    } catch (error) {
      console.error('Toggle active error:', error);
      toast.error('İşlem başarısız');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu bildirimi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteAnnouncement(id);
      toast.success('Bildirim silindi');
      fetchAnnouncements();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Silme işlemi başarısız');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle style={{ color: '#198754' }} />;
      case 'warning': return <FaExclamationTriangle style={{ color: '#ffc107' }} />;
      case 'error': return <FaTimesCircle style={{ color: '#dc3545' }} />;
      case 'info':
      default: return <FaInfoCircle style={{ color: '#0dcaf0' }} />;
    }
  };

  const getTypeBadge = (type) => {
    const variants = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'danger'
    };
    return variants[type] || 'info';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTargetAudienceText = (targetAudience) => {
    if (!targetAudience) {
      return <Badge bg="secondary">👥 Herkes</Badge>;
    }

    const badges = [];
    
    if (targetAudience.roles && targetAudience.roles.length > 0) {
      badges.push(
        <Badge key="roles" bg="primary" className="me-1">
          {targetAudience.roles.map(r => 
            r === 'admin' ? '👨‍💼' : r === 'support' ? '🛟' : '👤'
          ).join(' ')}
        </Badge>
      );
    }

    if (targetAudience.hasActiveSubscription === true) {
      badges.push(<Badge key="premium" bg="warning" text="dark" className="me-1">💎 Premium</Badge>);
    } else if (targetAudience.hasActiveSubscription === false) {
      badges.push(<Badge key="non-premium" bg="secondary" className="me-1">⭕ Non-Premium</Badge>);
    }

    if (targetAudience.printNestConfirmed === false) {
      badges.push(<Badge key="printnest-pending" bg="info" className="me-1">⏳ PrintNest Onay Bekliyor</Badge>);
    } else if (targetAudience.printNestConfirmed === true) {
      badges.push(<Badge key="printnest-confirmed" bg="success" className="me-1">✅ PrintNest Onaylı</Badge>);
    }

    if (targetAudience.hasEtsyStore === false) {
      badges.push(<Badge key="no-store" bg="danger" className="me-1">❌ Mağaza Yok</Badge>);
    } else if (targetAudience.hasEtsyStore === true) {
      badges.push(<Badge key="has-store" bg="success" className="me-1">🏪 Mağaza Var</Badge>);
    }

    return badges.length > 0 ? <div className="d-flex flex-wrap gap-1">{badges}</div> : <Badge bg="secondary">👥 Herkes</Badge>;
  };

  const isAnnouncementActive = (announcement) => {
    if (!announcement.isActive) return false;
    const now = new Date();
    const start = new Date(announcement.startDate);
    const end = new Date(announcement.endDate);
    return now >= start && now <= end;
  };

  if (loading) {
    return <Loader />;
  }

  // Destek rolü kontrolü
  const canManage = user?.role === 'admin' || user?.role === 'support';

  if (!canManage) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Bu sayfaya erişim yetkiniz yok</h3>
          <p className="text-muted">Sadece admin ve destek kullanıcıları bu sayfayı görüntüleyebilir.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>📢 Bildirim Yönetimi</h2>
              <p className="text-muted mb-0">Kullanıcılar için duyuru oluştur ve yönet</p>
            </div>
            <Button variant="primary" onClick={handleOpenCreateModal}>
              <FaPlus className="me-2" />
              Yeni Bildirim
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon primary">📢</div>
              <div className="stats-value">{announcements.length}</div>
              <div className="stats-label">Toplam Bildirim</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon success">✅</div>
              <div className="stats-value">
                {announcements.filter(a => isAnnouncementActive(a)).length}
              </div>
              <div className="stats-label">Aktif Bildirim</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon warning">⏸️</div>
              <div className="stats-value">
                {announcements.filter(a => !a.isActive).length}
              </div>
              <div className="stats-label">Yayından Kaldırılmış</div>
            </div>
          </Col>
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon info">⏰</div>
              <div className="stats-value">
                {announcements.filter(a => new Date(a.endDate) < new Date()).length}
              </div>
              <div className="stats-label">Süresi Dolmuş</div>
            </div>
          </Col>
        </Row>

        {/* Announcements Table */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Durum</th>
                      <th>Başlık</th>
                      <th>Tip</th>
                      <th>Hedef Kitle</th>
                      <th>Başlangıç</th>
                      <th>Bitiş</th>
                      <th>Oluşturulma</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.map((announcement) => {
                      const isActive = isAnnouncementActive(announcement);
                      const isPastDate = new Date(announcement.endDate) < new Date();
                      
                      return (
                        <tr key={announcement.id}>
                          <td>
                            {isActive ? (
                              <Badge bg="success" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                <FaEye /> Aktif
                              </Badge>
                            ) : isPastDate ? (
                              <Badge bg="secondary" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                <FaTimesCircle /> Süresi Doldu
                              </Badge>
                            ) : (
                              <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                <FaEyeSlash /> Yayında Değil
                              </Badge>
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              {getTypeIcon(announcement.type)}
                              <strong>{announcement.title}</strong>
                            </div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                              {announcement.message}
                            </div>
                          </td>
                          <td>
                            <Badge bg={getTypeBadge(announcement.type)}>
                              {announcement.type === 'info' ? 'Bilgi' :
                               announcement.type === 'warning' ? 'Uyarı' :
                               announcement.type === 'success' ? 'Başarılı' : 'Hata'}
                            </Badge>
                          </td>
                          <td className="small">
                            {getTargetAudienceText(announcement.targetAudience)}
                            
                            {/* Kaç kişinin göreceği bilgisi */}
                            {announcement.recipientCount !== undefined && (
                              <div className="mt-2">
                                <Badge bg="dark" className="d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                  👥 {announcement.recipientCount.toLocaleString('tr-TR')} kişi görecek
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td className="small">{formatDate(announcement.startDate)}</td>
                          <td className="small">{formatDate(announcement.endDate)}</td>
                          <td className="small">{formatDate(announcement.createdAt)}</td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              <Button
                                size="sm"
                                variant="info"
                                onClick={() => handleOpenEditModal(announcement)}
                                title="Düzenle"
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                size="sm"
                                variant={announcement.isActive ? 'warning' : 'success'}
                                onClick={() => handleToggleActive(announcement)}
                                title={announcement.isActive ? 'Yayından Kaldır' : 'Yayına Al'}
                              >
                                {announcement.isActive ? <FaEyeSlash /> : <FaEye />}
                              </Button>

                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDelete(announcement.id)}
                                title="Sil"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                {announcements.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <FaInfoCircle size={48} className="mb-3" />
                    <p>Henüz bildirim oluşturulmamış</p>
                    <Button variant="primary" onClick={handleOpenCreateModal}>
                      İlk Bildirimi Oluştur
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? 'Yeni Bildirim Oluştur' : 'Bildirimi Düzenle'}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Başlık *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Bildirim başlığı"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mesaj *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Bildirim mesajı (detaylı açıklama)"
              />
              <Form.Text className="text-muted">
                Satır atlamalar korunacaktır
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tip *</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="info">Bilgi</option>
                    <option value="success">Başarılı</option>
                    <option value="warning">Uyarı</option>
                    <option value="error">Hata</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Durum</Form.Label>
                  <Form.Check
                    type="switch"
                    name="isActive"
                    label="Yayında"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    {formData.isActive ? 'Bildirim yayında olacak' : 'Bildirim yayında olmayacak'}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Başlangıç Tarihi *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bitiş Tarihi *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />

            {/* Hedef Kitle Ayarları */}
            <h5 className="mb-3">🎯 Hedef Kitle Ayarları</h5>
            
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="targetEveryone"
                label="Herkese Göster"
                checked={formData.targetEveryone}
                onChange={(e) => setFormData(prev => ({ ...prev, targetEveryone: e.target.checked }))}
              />
              <Form.Text className="text-muted">
                Aktif edilirse tüm kullanıcılar bu bildirimi görecektir. Kapalıysa aşağıdaki filtrelere göre hedef kitle belirlenecektir.
              </Form.Text>
            </Form.Group>

            {!formData.targetEveryone && (
              <>
                {/* Rol Tabanlı Hedefleme */}
                <Form.Group className="mb-3">
                  <Form.Label>Sadece Bu Rollere Göster</Form.Label>
                  <div className="d-flex gap-2 mb-2">
                    <Form.Check
                      type="checkbox"
                      label="👤 Kullanıcılar"
                      checked={formData.targetRoles.includes('user')}
                      onChange={() => handleRoleToggle('user')}
                    />
                    <Form.Check
                      type="checkbox"
                      label="👨‍💼 Adminler"
                      checked={formData.targetRoles.includes('admin')}
                      onChange={() => handleRoleToggle('admin')}
                    />
                    <Form.Check
                      type="checkbox"
                      label="🛟 Destek"
                      checked={formData.targetRoles.includes('support')}
                      onChange={() => handleRoleToggle('support')}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Hiçbiri seçilmezse tüm roller dahil edilir
                  </Form.Text>
                </Form.Group>

                {/* Premium Üyelik Durumu */}
                <Form.Group className="mb-3">
                  <Form.Label>Premium Üyelik Durumu</Form.Label>
                  <Form.Select
                    name="targetSubscriptionType"
                    value={formData.targetSubscriptionType}
                    onChange={handleInputChange}
                  >
                    <option value="all">Tüm Üyeler</option>
                    <option value="premium">💎 Sadece Premium Üyeler</option>
                    <option value="non-premium">⭕ Sadece Premium Olmayan Üyeler</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Premium üyelik durumuna göre filtreleme
                  </Form.Text>
                </Form.Group>

                {/* PrintNest Onay Durumu */}
                <Form.Group className="mb-3">
                  <Form.Label>PrintNest Onay Durumu</Form.Label>
                  <Form.Select
                    name="targetPrintNestStatus"
                    value={formData.targetPrintNestStatus}
                    onChange={handleInputChange}
                  >
                    <option value="all">Tüm Kullanıcılar</option>
                    <option value="pending">⏳ Onay Bekleyenler (Henüz Onaylanmamış)</option>
                    <option value="confirmed">✅ Onaylanmış Kullanıcılar</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    PrintNest onay durumuna göre filtreleme
                  </Form.Text>
                </Form.Group>

                {/* Etsy Mağaza Durumu */}
                <Form.Group className="mb-3">
                  <Form.Label>Etsy Mağaza Durumu</Form.Label>
                  <Form.Select
                    name="targetStoreStatus"
                    value={formData.targetStoreStatus}
                    onChange={handleInputChange}
                  >
                    <option value="all">Tüm Kullanıcılar</option>
                    <option value="has-store">🏪 Mağaza URL'si Girmiş Olanlar</option>
                    <option value="no-store">❌ Mağaza URL'si Girmemiş Olanlar</option>
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Etsy mağaza URL durumuna göre filtreleme
                  </Form.Text>
                </Form.Group>

                <div className="alert alert-info small">
                  <FaInfoCircle className="me-2" />
                  <strong>Bilgi:</strong> Birden fazla filtre seçerseniz, tüm koşulları sağlayan kullanıcılar bildirimi görecektir (VE mantığı ile çalışır).
                </div>
              </>
            )}

            <div className="alert alert-info small">
              <FaInfoCircle className="me-2" />
              <strong>Not:</strong> Bildirim sadece başlangıç ve bitiş tarihleri arasında kullanıcılara gösterilecektir.
              Yayından kaldırılan bildirimler tarih aralığında olsa bile gösterilmez.
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              İptal
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === 'create' ? 'Oluştur' : 'Güncelle'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AnnouncementsManagement;

