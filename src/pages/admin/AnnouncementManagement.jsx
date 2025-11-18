import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, Modal, Pagination } from 'react-bootstrap';
import { announcementApi } from '../../api/announcementApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    isActive: '',
    type: '',
    priority: '',
    search: '',
  });

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'normal',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Build params object, only include filters with values
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Only add filters that have values
      if (filters.isActive) params.isActive = filters.isActive;
      if (filters.type) params.type = filters.type;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const response = await announcementApi.getAnnouncements(params);
      setAnnouncements(response.data.announcements);

      if (response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Fetch announcements error:', error);
      toast.error('Duyurular yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await announcementApi.getAnnouncementStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchAnnouncements();
  };

  const handleClearFilters = () => {
    setFilters({
      isActive: '',
      type: '',
      priority: '',
      search: '',
    });
    setCurrentPage(1);
    setTimeout(() => fetchAnnouncements(), 0);
  };

  const handleOpenFormModal = (announcement = null) => {
    if (announcement) {
      setIsEditing(true);
      setSelectedAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        isActive: announcement.isActive,
        startDate: announcement.startDate
          ? new Date(announcement.startDate).toISOString().slice(0, 16)
          : '',
        endDate: announcement.endDate
          ? new Date(announcement.endDate).toISOString().slice(0, 16)
          : '',
      });
    } else {
      setIsEditing(false);
      setSelectedAnnouncement(null);
      setFormData({
        title: '',
        content: '',
        type: 'info',
        priority: 'normal',
        isActive: true,
        startDate: '',
        endDate: '',
      });
    }
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setSelectedAnnouncement(null);
    setIsEditing(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Başlık ve içerik zorunludur');
      return;
    }

    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (isEditing && selectedAnnouncement) {
        await announcementApi.updateAnnouncement(selectedAnnouncement.id, submitData);
        toast.success('Duyuru güncellendi');
      } else {
        await announcementApi.createAnnouncement(submitData);
        toast.success('Duyuru oluşturuldu');
      }

      handleCloseFormModal();
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error('Submit form error:', error);
      toast.error(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await announcementApi.toggleAnnouncementStatus(id);
      toast.success('Duyuru durumu değiştirildi');
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Durum değiştirilemedi');
    }
  };

  const handleOpenDeleteModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedAnnouncement(null);
  };

  const handleDelete = async () => {
    try {
      await announcementApi.deleteAnnouncement(selectedAnnouncement.id);
      toast.success('Duyuru silindi');
      handleCloseDeleteModal();
      fetchAnnouncements();
      fetchStats();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Duyuru silinemedi');
    }
  };

  const handlePreview = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowPreviewModal(true);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'danger',
    };
    return colors[type] || 'secondary';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'secondary',
      normal: 'primary',
      high: 'danger',
    };
    return colors[priority] || 'secondary';
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[type] || 'ℹ️';
  };

  const renderPagination = () => {
    const items = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      items.push(<Pagination.First key="first" onClick={() => setCurrentPage(1)} />);
    }

    if (currentPage > 1) {
      items.push(
        <Pagination.Prev key="prev" onClick={() => setCurrentPage(currentPage - 1)} />
      );
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => setCurrentPage(currentPage + 1)} />
      );
    }

    if (endPage < totalPages) {
      items.push(
        <Pagination.Last key="last" onClick={() => setCurrentPage(totalPages)} />
      );
    }

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  if (loading && currentPage === 1) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2>📢 Duyuru Yönetimi</h2>
          <p>Kullanıcılara duyuru yönetimi</p>
        </div>

        {/* Stats */}
        {stats && (
          <Row className="mb-4">
            <Col md={3}>
              <div className="stats-card">
                <div className="stats-icon primary">📢</div>
                <div className="stats-value">{stats.total || 0}</div>
                <div className="stats-label">Toplam Duyuru</div>
              </div>
            </Col>

            <Col md={3}>
              <div className="stats-card">
                <div className="stats-icon success">✅</div>
                <div className="stats-value">{stats.active || 0}</div>
                <div className="stats-label">Aktif Duyuru</div>
              </div>
            </Col>

            <Col md={3}>
              <div className="stats-card">
                <div className="stats-icon warning">⏸️</div>
                <div className="stats-value">{stats.inactive || 0}</div>
                <div className="stats-label">Pasif Duyuru</div>
              </div>
            </Col>

            <Col md={3}>
              <div className="stats-card">
                <div className="stats-icon info">🎯</div>
                <div className="stats-value">{stats.byPriority?.high || 0}</div>
                <div className="stats-label">Yüksek Öncelikli</div>
              </div>
            </Col>
          </Row>
        )}

        {/* Filters & Create Button */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <Row className="align-items-end">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Durum</Form.Label>
                      <Form.Select
                        size="sm"
                        name="isActive"
                        value={filters.isActive}
                        onChange={handleFilterChange}
                      >
                        <option value="">Tümü</option>
                        <option value="true">Aktif</option>
                        <option value="false">Pasif</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Tip</Form.Label>
                      <Form.Select
                        size="sm"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                      >
                        <option value="">Tümü</option>
                        <option value="info">Bilgi</option>
                        <option value="success">Başarı</option>
                        <option value="warning">Uyarı</option>
                        <option value="error">Hata</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Öncelik</Form.Label>
                      <Form.Select
                        size="sm"
                        name="priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                      >
                        <option value="">Tümü</option>
                        <option value="low">Düşük</option>
                        <option value="normal">Normal</option>
                        <option value="high">Yüksek</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Ara</Form.Label>
                      <Form.Control
                        size="sm"
                        type="text"
                        placeholder="Başlık veya içerik..."
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3} className="d-flex gap-2">
                    <Button size="sm" variant="primary" onClick={handleApplyFilters}>
                      Filtrele
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleClearFilters}>
                      Temizle
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleOpenFormModal()}
                      className="ms-auto"
                    >
                      <FaPlus className="me-2" />
                      Yeni Duyuru
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Announcements Table */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1">Duyurular</h5>
                    <small className="text-muted">
                      Toplam {totalItems} duyuru - Sayfa {currentPage} / {totalPages}
                    </small>
                  </div>

                  <Form.Select
                    size="sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
                    }}
                    style={{ width: 'auto' }}
                  >
                    <option value={10}>10 / sayfa</option>
                    <option value={20}>20 / sayfa</option>
                    <option value={50}>50 / sayfa</option>
                  </Form.Select>
                </div>

                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Yükleniyor...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Başlık</th>
                          <th>Tip</th>
                          <th>Öncelik</th>
                          <th>Durum</th>
                          <th>Tarih Aralığı</th>
                          <th>Oluşturan</th>
                          <th>İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map((announcement) => (
                          <tr key={announcement.id}>
                            <td>
                              <strong>{announcement.title}</strong>
                              <br />
                              <small className="text-muted">
                                {announcement.content.substring(0, 50)}
                                {announcement.content.length > 50 ? '...' : ''}
                              </small>
                            </td>
                            <td>
                              <Badge bg={getTypeColor(announcement.type)}>
                                {getTypeIcon(announcement.type)}{' '}
                                {announcement.type === 'info'
                                  ? 'Bilgi'
                                  : announcement.type === 'success'
                                  ? 'Başarı'
                                  : announcement.type === 'warning'
                                  ? 'Uyarı'
                                  : 'Hata'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getPriorityColor(announcement.priority)}>
                                {announcement.priority === 'low'
                                  ? 'Düşük'
                                  : announcement.priority === 'high'
                                  ? 'Yüksek'
                                  : 'Normal'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={announcement.isActive ? 'success' : 'secondary'}>
                                {announcement.isActive ? 'Aktif' : 'Pasif'}
                              </Badge>
                            </td>
                            <td>
                              <small>
                                {announcement.startDate
                                  ? new Date(announcement.startDate).toLocaleDateString('tr-TR')
                                  : '-'}
                                <br />
                                {announcement.endDate
                                  ? new Date(announcement.endDate).toLocaleDateString('tr-TR')
                                  : '-'}
                              </small>
                            </td>
                            <td>
                              <small>
                                {announcement.creator?.firstName} {announcement.creator?.lastName}
                              </small>
                            </td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="info"
                                  onClick={() => handlePreview(announcement)}
                                  title="Önizle"
                                >
                                  <FaEye />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="warning"
                                  onClick={() => handleOpenFormModal(announcement)}
                                  title="Düzenle"
                                >
                                  <FaEdit />
                                </Button>

                                <Button
                                  size="sm"
                                  variant={announcement.isActive ? 'secondary' : 'success'}
                                  onClick={() => handleToggleStatus(announcement.id)}
                                  title={announcement.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                                >
                                  {announcement.isActive ? <FaToggleOff /> : <FaToggleOn />}
                                </Button>

                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleOpenDeleteModal(announcement)}
                                  title="Sil"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    {announcements.length === 0 && (
                      <p className="text-center text-muted py-3">Duyuru bulunamadı</p>
                    )}

                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          Gösterilen:{' '}
                          {announcements.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
                          {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
                        </small>
                        {renderPagination()}
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Form Modal */}
      <Modal show={showFormModal} onHide={handleCloseFormModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Duyuru Düzenle' : 'Yeni Duyuru'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitForm}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Başlık *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Duyuru başlığı"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>İçerik *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                placeholder="Duyuru içeriği"
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tip</Form.Label>
                  <Form.Select name="type" value={formData.type} onChange={handleFormChange}>
                    <option value="info">Bilgi</option>
                    <option value="success">Başarı</option>
                    <option value="warning">Uyarı</option>
                    <option value="error">Hata</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Öncelik</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleFormChange}
                  >
                    <option value="low">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="high">Yüksek</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Durum</Form.Label>
                  <Form.Check
                    type="switch"
                    id="isActive"
                    name="isActive"
                    label={formData.isActive ? 'Aktif' : 'Pasif'}
                    checked={formData.isActive}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Başlangıç Tarihi (Opsiyonel)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bitiş Tarihi (Opsiyonel)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseFormModal}>
              İptal
            </Button>
            <Button variant="primary" type="submit">
              {isEditing ? 'Güncelle' : 'Oluştur'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Duyuruyu Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnnouncement && (
            <p>
              <strong>{selectedAnnouncement.title}</strong> duyurusunu silmek istediğinizden emin
              misiniz?
              <br />
              <br />
              <span className="text-danger">Bu işlem geri alınamaz!</span>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            İptal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Sil
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Duyuru Önizleme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAnnouncement && (
            <div
              className={`alert alert-${getTypeColor(selectedAnnouncement.type)} mb-0`}
              role="alert"
            >
              <h4 className="alert-heading">
                {getTypeIcon(selectedAnnouncement.type)} {selectedAnnouncement.title}
              </h4>
              <hr />
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {selectedAnnouncement.content}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;

