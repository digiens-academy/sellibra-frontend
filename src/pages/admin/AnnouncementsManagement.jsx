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
    isActive: true
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
      isActive: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (announcement) => {
    setModalMode('edit');
    setCurrentAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      startDate: new Date(announcement.startDate).toISOString().slice(0, 16),
      endDate: new Date(announcement.endDate).toISOString().slice(0, 16),
      isActive: announcement.isActive
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
      isActive: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'create') {
        await createAnnouncement(formData);
        toast.success('Bildirim oluşturuldu');
      } else {
        await updateAnnouncement(currentAnnouncement.id, formData);
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

