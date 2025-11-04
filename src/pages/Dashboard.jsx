import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaArrowRight, FaCrown } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import { MODULES } from '../utils/constants';
import PremiumModal from '../components/common/PremiumModal';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Debug: Kullanıcı bilgilerini konsola yazdır
  useEffect(() => {
    console.log('Dashboard - User Info:', {
      email: user?.email,
      role: user?.role,
      hasActiveSubscription: user?.hasActiveSubscription,
      subscriptionCheckedAt: user?.subscriptionCheckedAt
    });
  }, [user]);

  const handleModuleClick = (moduleId, moduleRoute) => {
    // Etsy-AI modülüne tıklanırsa premium kontrolü yap
    if (moduleId === 'etsy-ai') {
      // Admin her zaman erişebilir
      if (user?.role === 'admin') {
        navigate(moduleRoute);
        return;
      }

      // Premium abonelik kontrolü
      if (!user?.hasActiveSubscription) {
        setShowPremiumModal(true);
        return;
      }
    }

    // PrintNest veya premium kullanıcılar için direkt yönlendir
    navigate(moduleRoute);
  };


  return (
    <div className="module-selection-container">
      <Container fluid className="main-content">
        <div className="page-header text-center mb-5">
          <h1>Hoş Geldiniz, {user?.firstName}!</h1>
          <p className="lead">
            Hangi modülü kullanmak istersiniz?
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <Row className="g-4">
              {/* PrintNest Modülü */}
              <Col md={6}>
                <Card 
                  className="module-card h-100 hover-shadow"
                  onClick={() => handleModuleClick(MODULES.PRINTNEST.id, MODULES.PRINTNEST.route)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center p-5">
                    <div className="module-icon mb-4" style={{ width: '200px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/integrations/printnest_logo-BSbxRoeY.svg" 
                        alt="PrintNest Logo" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <h3 className="mb-3">{MODULES.PRINTNEST.name}</h3>
                    <p className="text-muted mb-4">
                      {MODULES.PRINTNEST.description}
                    </p>
                    <div className="mt-auto">
                      <div className="btn btn-primary btn-lg d-flex align-items-center gap-2">
                        Başla <FaArrowRight />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Etsy-AI Tools Modülü */}
              <Col md={6}>
                <Card 
                  className="module-card h-100 hover-shadow position-relative"
                  onClick={() => handleModuleClick(MODULES.ETSY_AI.id, MODULES.ETSY_AI.route)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Premium Badge */}
                  {user?.role !== 'admin' && !user?.hasActiveSubscription && (
                    <Badge 
                      bg="warning" 
                      className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-1"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                    >
                      <FaCrown /> PREMIUM
                    </Badge>
                  )}
                  
                  <Card.Body className="d-flex flex-column align-items-center text-center p-5">
                    <div className="module-icon mb-4" style={{ width: '200px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src="/integrations/etsy.svg" 
                        alt="Etsy Logo" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <h3 className="mb-3">{MODULES.ETSY_AI.name}</h3>
                    <p className="text-muted mb-4">
                      {MODULES.ETSY_AI.description}
                    </p>
                    <div className="mt-auto">
                      <div className="btn btn-success btn-lg d-flex align-items-center gap-2">
                        Başla <FaArrowRight />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Bilgilendirme */}
            <Row className="mt-5">
              <Col>
                <Card className="bg-light">
                  <Card.Body>
                    <h6 className="mb-3 d-flex align-items-center gap-2">
                      <FaInfoCircle style={{ color: '#4A90E2' }} /> Bilgilendirme
                    </h6>
                    <ul className="mb-0">
                      <li>Modüller arasında istediğiniz zaman geçiş yapabilirsiniz</li>
                      <li>Her modül için ayrı dashboard ve özellikler mevcuttur</li>
                      <li>Profil bilgileriniz tüm modüllerde ortaktır</li>
                      {user?.role !== 'admin' && !user?.hasActiveSubscription && (
                        <li className="text-warning fw-bold">
                          <FaCrown className="me-1" />
                          Etsy-AI Tools modülü premium üyelik gerektirir
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

      {/* Premium Modal */}
      <PremiumModal 
        show={showPremiumModal}
        onHide={() => setShowPremiumModal(false)}
      />
    </div>
  );
};

export default Dashboard;

