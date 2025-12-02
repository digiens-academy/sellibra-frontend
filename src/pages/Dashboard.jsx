import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaArrowRight, FaCrown, FaCheckCircle } from 'react-icons/fa';
import useAuthStore from '../store/authStore';
import { MODULES } from '../utils/constants';
import PremiumModal from '../components/common/PremiumModal';
import AnnouncementModal from '../components/common/AnnouncementModal';
import { getActiveAnnouncements } from '../api/announcementApi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(true); // Default olarak açık
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  // Header yüksekliğini dinamik olarak al
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('.app-navbar');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);

    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Debug: Kullanıcı bilgilerini konsola yazdır
  useEffect(() => {
    console.log('Dashboard - User Info:', {
      email: user?.email,
      role: user?.role,
      hasActiveSubscription: user?.hasActiveSubscription,
      subscriptionCheckedAt: user?.subscriptionCheckedAt
    });
  }, [user]);

  // Aktif duyuruları yükle
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getActiveAnnouncements();
        if (response.success && response.data.announcements.length > 0) {
          setAnnouncements(response.data.announcements);
          setShowAnnouncementModal(true);
        }
      } catch (error) {
        console.error('Duyurular yüklenirken hata:', error);
        // Hata gösterme - kullanıcıyı rahatsız etmeyelim
      }
    };

    fetchAnnouncements();
  }, []);

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
      {/* Info Butonu - Offcanvas'ı açmak için */}
      {!showOffcanvas && headerHeight > 0 && (
        <Button
          variant="primary"
          className="position-fixed d-flex align-items-center gap-2 shadow-lg"
          style={{
            top: `${headerHeight + 20}px`,
            right: '20px',
            zIndex: 1040,
            borderRadius: '50px',
            padding: '12px 24px',
            fontWeight: '600',
            backgroundColor: '#157347',
            borderColor: '#157347'
          }}
          onClick={() => setShowOffcanvas(true)}
        >
          <FaInfoCircle size={20} />
          Önemli Bilgi
        </Button>
      )}

      <Container fluid className="main-content">
        <div className="page-header text-center mb-5">
          <h1>Hoş Geldiniz, {user?.firstName}!</h1>
          <p className="lead">
            Hangi modülü kullanmak istersiniz?
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Admin/Support Panel Card */}
            {(user?.role === 'admin' || user?.role === 'support') && (
              <Row className="mb-4">
                <Col>
                  <Card className="border-primary shadow-sm">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-2">
                            {user?.role === 'admin' ? '🛡️ Admin Panel' : '🛟 Destek Paneli'}
                          </h5>
                          <p className="text-muted mb-0">
                            {user?.role === 'admin' 
                              ? 'Kullanıcı yönetimi, bildirimler ve sistem ayarları'
                              : 'Kullanıcı görüntüleme ve bildirim yönetimi'}
                          </p>
                        </div>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/support')}
                          className="d-flex align-items-center gap-2"
                        >
                          {user?.role === 'admin' ? 'Panele Git' : 'Panele Git'}
                          <FaArrowRight />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

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

                    {/* PrintNest Önemli Bilgiler */}
                    <div className="mt-4 pt-4 border-top">
                      <h6 className="mb-3 d-flex align-items-center gap-2 text-warning">
                        <FaInfoCircle style={{ color: '#ffc107' }} /> PrintNest Önemli Bilgiler
                      </h6>
                      <ul className="mb-0">
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
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* Premium Bilgilendirme Offcanvas */}
      {headerHeight > 0 && (
        <Offcanvas 
          show={showOffcanvas} 
          onHide={() => setShowOffcanvas(false)}
          placement="end"
          backdrop={false}
          scroll={true}
          style={{ 
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: 'rgba(33, 82, 95, 0.15)',
            top: `${headerHeight}px`,
            height: `calc(100vh - ${headerHeight}px)`,
            zIndex: 1030
          }}
        >
        <Offcanvas.Header 
          closeButton 
          closeVariant="white"
          className="border-bottom"
          style={{ 
            backgroundColor: 'rgba(33, 82, 95, 0.15)',
            padding: '20px 24px',
            borderBottomColor: 'rgba(255, 255, 255, 0.2) !important'
          }}
        >
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold" style={{ color: '#fff' }}>
            <FaCrown style={{ color: '#ffc107' }} size={24} />
            Premium Bilgilendirme
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: '24px', backgroundColor: 'rgba(33, 82, 95, 0.15)' }}>
          {/* Bilgilendirme */}
          <div 
            className="p-4 rounded-3 border-start border-4"
            style={{ 
              backgroundColor: '#e7f3ff',
              borderColor: '#0d6efd !important'
            }}
          >
            <div className="d-flex align-items-start gap-3 mb-3">
              <FaCheckCircle 
                style={{ 
                  color: '#0d6efd',
                  fontSize: '1.5rem',
                  marginTop: '2px',
                  flexShrink: 0
                }} 
              />
              <h6 className="mb-0 fw-bold" style={{ color: '#0d6efd' }}>
                Etsy Yapay Zeka Tool Erişimi
              </h6>
            </div>
            <p className="mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#495057' }}>
              Premium aboneleri <strong>eğitime kayıt oldukları mail ile Sellibra'ya üye olduklarında</strong> Etsy Yapay Zeka Tool'una erişebileceklerdir.
            </p>
          </div>

          {/* Alt Bilgilendirme */}
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted small mb-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
              <FaInfoCircle className="me-2" style={{ color: '#6c757d' }} />
              Premium aboneliğinizin aktif olduğundan ve doğru e-posta adresi ile kayıt olduğunuzdan emin olun.
            </p>
          </div>
        </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Premium Modal */}
      <PremiumModal 
        show={showPremiumModal}
        onHide={() => setShowPremiumModal(false)}
      />

      {/* Announcement Modal */}
      <AnnouncementModal 
        show={showAnnouncementModal}
        onHide={() => setShowAnnouncementModal(false)}
        announcements={announcements}
      />
    </div>
  );
};

export default Dashboard;

