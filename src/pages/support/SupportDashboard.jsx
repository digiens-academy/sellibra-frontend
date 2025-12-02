import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { getAllAnnouncements } from '../../api/announcementApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';
import { 
  FaEye, 
  FaBullhorn, 
  FaUsers, 
  FaCheckCircle, 
  FaInfoCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { ROUTES } from '../../utils/constants';
import useAuthStore from '../../store/authStore';

const SupportDashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, announcementsRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ 
          search: search || undefined, 
          page: currentPage, 
          limit: itemsPerPage 
        }),
        getAllAnnouncements(1, 10)
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setAnnouncements(announcementsRes.data.announcements);
    } catch (error) {
      console.error('Fetch data error:', error);
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await adminApi.getUserById(userId);
      toast.info(`Kullanıcı: ${response.data.user.firstName} ${response.data.user.lastName}`);
    } catch (error) {
      console.error('View user error:', error);
      toast.error('Kullanıcı detayları yüklenemedi');
    }
  };

  const getAnnouncementStatus = (announcement) => {
    if (!announcement.isActive) return { text: 'Yayında Değil', variant: 'secondary' };
    
    const now = new Date();
    const start = new Date(announcement.startDate);
    const end = new Date(announcement.endDate);
    
    if (now < start) return { text: 'Planlanmış', variant: 'info' };
    if (now > end) return { text: 'Süresi Doldu', variant: 'secondary' };
    return { text: 'Aktif', variant: 'success' };
  };

  if (loading) {
    return <Loader />;
  }

  // Yetki kontrolü
  if (user?.role !== 'support' && user?.role !== 'admin') {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h3>Bu sayfaya erişim yetkiniz yok</h3>
          <p className="text-muted">Sadece destek ve admin kullanıcıları bu sayfayı görüntüleyebilir.</p>
          <Button variant="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h2>🛟 Destek Paneli</h2>
              <p className="text-muted mb-0">
                Hoş geldin, {user?.firstName}! Kullanıcı ve bildirim yönetimi
              </p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
              className="d-flex align-items-center gap-2"
            >
              <FaBullhorn />
              Bildirim Yönetimi
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon primary">
                <FaUsers size={24} />
              </div>
              <div className="stats-value">{stats?.totalUsers || 0}</div>
              <div className="stats-label">Toplam Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon success">
                <FaCheckCircle size={24} />
              </div>
              <div className="stats-value">{stats?.confirmedUsers || 0}</div>
              <div className="stats-label">Onaylı Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon info">
                <FaBullhorn size={24} />
              </div>
              <div className="stats-value">{announcements.length}</div>
              <div className="stats-label">Toplam Bildirim</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon warning">
                <FaInfoCircle size={24} />
              </div>
              <div className="stats-value">
                {announcements.filter(a => {
                  const now = new Date();
                  return a.isActive && new Date(a.startDate) <= now && new Date(a.endDate) >= now;
                }).length}
              </div>
              <div className="stats-label">Aktif Bildirim</div>
            </div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">⚡ Hızlı İşlemler</h5>
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaBullhorn />
                    Bildirim Oluştur
                  </Button>
                  
                  <Button 
                    variant="info" 
                    onClick={() => window.location.reload()}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaUsers />
                    Kullanıcıları Yenile
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Announcements */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">📢 Son Bildirimler</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                  >
                    Tümünü Gör
                  </Button>
                </div>

                {announcements.length > 0 ? (
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Başlık</th>
                        <th>Tip</th>
                        <th>Durum</th>
                        <th>Oluşturulma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.slice(0, 5).map((announcement) => {
                        const status = getAnnouncementStatus(announcement);
                        return (
                          <tr key={announcement.id}>
                            <td>
                              <strong>{announcement.title}</strong>
                              <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                                {announcement.message}
                              </div>
                            </td>
                            <td>
                              <Badge bg={
                                announcement.type === 'info' ? 'info' :
                                announcement.type === 'success' ? 'success' :
                                announcement.type === 'warning' ? 'warning' : 'danger'
                              }>
                                {announcement.type === 'info' ? 'Bilgi' :
                                 announcement.type === 'success' ? 'Başarılı' :
                                 announcement.type === 'warning' ? 'Uyarı' : 'Hata'}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={status.variant}>{status.text}</Badge>
                            </td>
                            <td className="small">
                              {new Date(announcement.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaBullhorn size={48} className="mb-3" style={{ opacity: 0.3 }} />
                    <p>Henüz bildirim yok</p>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => navigate(ROUTES.ADMIN_ANNOUNCEMENTS)}
                    >
                      İlk Bildirimi Oluştur
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Table - Read Only */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">👥 Kullanıcılar (Salt Okunur)</h5>
                    <small className="text-muted">
                      <FaInfoCircle className="me-1" />
                      Sadece görüntüleme yetkisine sahipsiniz
                    </small>
                  </div>
                  
                  <Form onSubmit={handleSearch} className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: '250px' }}
                      size="sm"
                    />
                    <Button type="submit" variant="primary" size="sm" disabled={loading}>
                      Ara
                    </Button>
                  </Form>
                </div>

                <div className="alert alert-info d-flex align-items-center gap-2 mb-3">
                  <FaExclamationTriangle />
                  <span>
                    Kullanıcı bilgilerini görüntüleyebilirsiniz ancak değiştiremezsiniz. 
                    Düzenleme yetkisi için admin ile iletişime geçin.
                  </span>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Ad Soyad</th>
                      <th>E-posta</th>
                      <th>Rol</th>
                      <th>PrintNest</th>
                      <th>Kayıt Tarihi</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          {user.firstName} {user.lastName}
                          {user.isSuperAdmin && (
                            <Badge bg="danger" className="ms-2" style={{ fontSize: '0.65rem' }}>
                              SUPER ADMIN
                            </Badge>
                          )}
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <Badge bg={
                            user.role === 'admin' ? 'primary' : 
                            user.role === 'support' ? 'info' : 
                            'secondary'
                          }>
                            {user.role === 'admin' ? 'Admin' : 
                             user.role === 'support' ? 'Destek' : 
                             'Kullanıcı'}
                          </Badge>
                        </td>
                        <td>
                          {user.printNestConfirmed ? (
                            <Badge bg="success">Onaylı</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">Bekliyor</Badge>
                          )}
                        </td>
                        <td>{new Date(user.registeredAt).toLocaleDateString('tr-TR')}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() => handleViewUser(user.id)}
                            title="Detayları Gör"
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {users.length === 0 && (
                  <p className="text-center text-muted py-3">
                    {search ? 'Arama sonucu kullanıcı bulunamadı' : 'Kullanıcı bulunamadı'}
                  </p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SupportDashboard;

