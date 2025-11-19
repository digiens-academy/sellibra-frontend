import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaInfoCircle } from 'react-icons/fa';
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

          {/* Quick Actions & Info */}
          <Col lg={8}>
            <Row>
              {/* Quick Actions */}
              <Col md={6} className="mb-4">
                <Card className="h-100">
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

              {/* Info Card */}
              <Col md={6} className="mb-4">
                <Card 
                  className="h-100"
                  style={{
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%)',
                    border: '2px solid #e3e8ef',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                >
                  <Card.Body style={{ padding: '1.5rem' }}>
                    {/* Önemli Bilgilendirme */}
                    <div 
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: 'rgba(74, 144, 226, 0.06)',
                        border: '1px solid rgba(74, 144, 226, 0.15)'
                      }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-3">
                        <FaEnvelope style={{ color: '#4A90E2', fontSize: '1.3rem', marginTop: '2px' }} />
                        <h6 className="mb-0 fw-bold" style={{ color: '#2c5282' }}>
                          Önemli Bilgilendirme
                        </h6>
                      </div>
                      <p className="mb-0" style={{ fontSize: '0.92rem', lineHeight: '1.6', color: '#495057' }}>
                        PrintNest'i sorunsuz kullanabilmeniz için lütfen <strong>Sellibra'ya kayıtlı olduğunuz e-posta adresi</strong> ile üye olunuz. 
                        Aynı e-posta adresini kullanmanız, platformlar arası entegrasyon ve veri senkronizasyonu için önemlidir.
                      </p>
                    </div>

                    {/* PrintNest Önemli Bilgiler */}
                    <div 
                      className="mt-4 p-3 rounded-3"
                      style={{
                        backgroundColor: 'rgba(255, 193, 7, 0.08)',
                        border: '1px solid rgba(255, 193, 7, 0.25)'
                      }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-3">
                        <FaInfoCircle style={{ color: '#ffc107', fontSize: '1.3rem', marginTop: '2px' }} />
                        <h6 className="mb-0 fw-bold text-warning">
                          PrintNest Önemli Bilgiler
                        </h6>
                      </div>
                      <ul className="mb-0" style={{ fontSize: '0.92rem', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                        <li className="mb-2">
                          <strong>Sellibra'ya üye olduğunuz mail</strong> ile PrintNest'e üye olmalısınız.
                        </li>
                        <li className="mb-2">
                          PrintNest'e <strong>kayıt olmadan giriş yapamazsınız</strong>.
                        </li>
                        <li>
                          PrintNest'e Etsy Mağazanızı bağlarken Sellibra içerisinden değil, 
                          <a 
                            href="https://printnest.com/admin/settings/integrations" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="fw-bold text-primary ms-1"
                          >
                            bu linki yeni sekmede açarak
                          </a> bağlamalısınız. 
                          <span className="text-muted fst-italic"> (Yan sekmede Etsy hesabı açık olmalı)</span>
                        </li>
                      </ul>
                    </div>

                    {/* PrintNest Hakkında */}
                    <div 
                      className="mt-4 pt-3 pb-3 px-3 rounded-3"
                      style={{
                        background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%)',
                        border: '2px solid #b8daff',
                        boxShadow: '0 3px 8px rgba(74, 144, 226, 0.1)'
                      }}
                    >
                      <div className="d-flex align-items-start gap-2 mb-3">
                        <FaInfoCircle style={{ color: '#4A90E2', fontSize: '1.3rem', marginTop: '2px' }} />
                        <h6 className="mb-0 fw-bold" style={{ color: '#2c5282' }}>
                          PrintNest Hakkında
                        </h6>
                      </div>
                      <ul className="mb-0" style={{ fontSize: '0.92rem', lineHeight: '1.7', paddingLeft: '1.2rem' }}>
                        <li>PrintNest ile tasarımlarınızı kolayca oluşturabilir ve yönetebilirsiniz</li>
                        <li>Tüm tasarım araçlarına tek bir yerden erişim sağlayın</li>
                        <li>Etsy mağazanız için profesyonel tasarımlar oluşturun</li>
                        {!user?.printNestConfirmed && (
                          <li className="text-warning">
                            <strong>PrintNest erişiminizin aktif olması için admin onayı bekleniyor</strong>
                          </li>
                        )}
                      </ul>
                    </div>
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

