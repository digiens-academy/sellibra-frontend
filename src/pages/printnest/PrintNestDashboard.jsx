import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { ROUTES } from '../../utils/constants';

const PrintNestDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2>🎨 PrintNest Dashboard</h2>
          <p>PrintNest tracking ve yönetim sistemi</p>
        </div>

        <Row>
          {/* User Info */}
          <Col lg={4} className="mb-4">
            <Card className="profile-card h-100">
              <div className="profile-header">
                <div className="profile-avatar">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <h4>{user?.firstName} {user?.lastName}</h4>
                <p className="text-muted mb-2">{user?.email}</p>
                {user?.printNestConfirmed ? (
                  <span className="badge bg-success">PrintNest Onaylı ✓</span>
                ) : (
                  <span className="badge bg-warning text-dark">Onay Bekliyor</span>
                )}
              </div>

              <div className="mt-3">
                <p className="text-muted mb-2">
                  <strong>Etsy Mağaza:</strong>
                </p>
                {user?.etsyStoreUrl ? (
                  <a href={user.etsyStoreUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                    {user.etsyStoreUrl}
                  </a>
                ) : (
                  <span className="text-muted">Belirtilmemiş</span>
                )}
              </div>

              <div className="mt-4">
                <Button as={Link} to={ROUTES.PROFILE} variant="outline-primary" className="w-100">
                  Profili Düzenle
                </Button>
              </div>
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col lg={8}>
            <Row>
              <Col md={12}>
                <Card className="mb-4">
                  <Card.Body>
                    <h5 className="mb-3">Hızlı İşlemler</h5>
                    <div className="d-grid gap-2">
                      <Button as={Link} to={ROUTES.PRINTNEST} variant="primary" size="lg">
                        🎨 PrintNest'e Git
                      </Button>
                      <Button as={Link} to={ROUTES.PROFILE} variant="outline-secondary">
                        Profili Düzenle
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Info Card */}
            <Row>
              <Col md={12}>
                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="mb-3">ℹ️ PrintNest Hakkında</h6>
                    <ul className="mb-0">
                      <li>PrintNest ile tasarımlarınızı kolayca oluşturabilir ve yönetebilirsiniz</li>
                      <li>Tüm tasarım araçlarına tek bir yerden erişim sağlayın</li>
                      <li>Etsy mağazanız için profesyonel tasarımlar oluşturun</li>
                      {!user?.printNestConfirmed && (
                        <li className="text-warning">
                          <strong>PrintNest erişiminizin aktif olması için admin onayı bekleniyor</strong>
                        </li>
                      )}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrintNestDashboard;

