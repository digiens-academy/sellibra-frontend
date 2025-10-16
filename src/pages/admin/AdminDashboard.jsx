import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form } from 'react-bootstrap';
import { adminApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers({ limit: 10 }),
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPrintNest = async (userId) => {
    try {
      await adminApi.confirmPrintNest(userId);
      toast.success('PrintNest kaydı onaylandı');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Confirm error:', error);
    }
  };

  const handleSyncToSheets = async () => {
    setSyncing(true);
    try {
      await adminApi.syncToSheets();
      toast.success('Google Sheets senkronize edildi');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await adminApi.getUsers({ search, limit: 20 });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2>Admin Panel</h2>
          <p>Kullanıcı yönetimi ve istatistikler</p>
        </div>

        {/* Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon primary">👥</div>
              <div className="stats-value">{stats?.totalUsers || 0}</div>
              <div className="stats-label">Toplam Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon success">✅</div>
              <div className="stats-value">{stats?.confirmedUsers || 0}</div>
              <div className="stats-label">Onaylı Kullanıcı</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon info">📊</div>
              <div className="stats-value">{stats?.totalSessions || 0}</div>
              <div className="stats-label">Toplam Oturum</div>
            </div>
          </Col>

          <Col md={3}>
            <div className="stats-card">
              <div className="stats-icon warning">🆕</div>
              <div className="stats-value">{stats?.todaySessions || 0}</div>
              <div className="stats-label">Bugünkü Oturum</div>
            </div>
          </Col>
        </Row>

        {/* Actions */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">İşlemler</h5>
                <Button
                  variant="primary"
                  onClick={handleSyncToSheets}
                  disabled={syncing}
                >
                  {syncing ? 'Senkronize Ediliyor...' : '📊 Google Sheets\'e Senkronize Et'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Users Table */}
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Kullanıcılar</h5>
                  <Form onSubmit={handleSearch} className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Kullanıcı ara..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: '300px' }}
                    />
                    <Button type="submit" variant="primary" className="ms-2">
                      Ara
                    </Button>
                  </Form>
                </div>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Ad Soyad</th>
                      <th>E-posta</th>
                      <th>Etsy Mağaza</th>
                      <th>Kayıt Tarihi</th>
                      <th>Durum</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.firstName} {user.lastName}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.etsyStoreUrl ? (
                            <a href={user.etsyStoreUrl} target="_blank" rel="noopener noreferrer">
                              Link
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{new Date(user.registeredAt).toLocaleDateString('tr-TR')}</td>
                        <td>
                          {user.printNestConfirmed ? (
                            <Badge bg="success">Onaylı</Badge>
                          ) : (
                            <Badge bg="warning" text="dark">Bekliyor</Badge>
                          )}
                        </td>
                        <td>
                          {!user.printNestConfirmed && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleConfirmPrintNest(user.id)}
                            >
                              Onayla
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {users.length === 0 && (
                  <p className="text-center text-muted py-3">Kullanıcı bulunamadı</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;

