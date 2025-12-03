import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown, Modal, Button, Form } from 'react-bootstrap';
import { FaArrowLeft, FaStore, FaQuestionCircle, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import PrintNestIframe from '../components/printnest/PrintNestIframe';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';

const STORAGE_KEY = 'printnest_email_warning_dismissed';

const PrintNestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Modal'ı açıp açmamaya karar ver
  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
      setShowModal(true);
    }
  }, []);

  const handleModalClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setShowModal(false);
  };

  return (
    <div className="printnest-fullscreen-container">
      {/* Email Uyarı Modal */}
      <Modal 
        show={showModal} 
        onHide={handleModalClose}
        centered
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            padding: '30px'
          }}
        >
          <Modal.Title className="text-white w-100 text-center">
            <FaEnvelope size={50} className="mb-3 d-block mx-auto" style={{ opacity: 0.9 }} />
            <h3 className="fw-bold mb-0">⚠️ Önemli: E-posta Adresi Uyarısı</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px' }}>
          {/* Kullanıcı Email Bilgisi */}
          <div 
            className="text-center mb-4 p-4 rounded-3"
            style={{
              background: 'linear-gradient(135deg, #e8f4fd 0%, #f0f8ff 100%)',
              border: '2px solid #4A90E2'
            }}
          >
            <p className="mb-2 text-muted" style={{ fontSize: '0.95rem' }}>
              Sellibra'da Kayıtlı E-posta Adresiniz:
            </p>
            <h4 className="fw-bold mb-0" style={{ color: '#2c5282', fontSize: '1.5rem' }}>
              {user?.email || 'Yükleniyor...'}
            </h4>
          </div>

          {/* Uyarı Mesajı */}
          <div 
            className="alert d-flex align-items-start gap-3 mb-4"
            style={{
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '20px'
            }}
          >
            <FaExclamationTriangle 
              size={30} 
              style={{ color: '#856404', marginTop: '4px', flexShrink: 0 }} 
            />
            <div>
              <h5 className="fw-bold mb-2" style={{ color: '#856404' }}>
                PrintNest'e Bu E-posta Adresi İle Üye Olmalısınız!
              </h5>
              <p className="mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#495057' }}>
                Farklı bir e-posta adresi kullanmanız durumunda:
              </p>
              <ul className="mt-2 mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                <li><strong>PrintNest indirimi tanımlanamaz</strong></li>
                <li><strong>Etsy mağaza entegrasyonu sorun yaşar</strong></li>
                <li><strong>Destek süreçlerinde sorun yaşanır</strong></li>
              </ul>
            </div>
          </div>

          {/* Bilgilendirme Notları */}
          <div 
            className="p-3 rounded-3 mb-3"
            style={{
              backgroundColor: 'rgba(74, 144, 226, 0.08)',
              border: '1px solid rgba(74, 144, 226, 0.2)'
            }}
          >
            <h6 className="fw-bold mb-2" style={{ color: '#2c5282' }}>
              📌 Önemli Notlar:
            </h6>
            <ul className="mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <li>PrintNest'e kayıt olmadan önce bu e-posta adresini kullandığınızdan emin olun</li>
              <li>Etsy mağazalarınızı da aynı şekilde eşleştirmeniz gerekmektedir</li>
              <li>Tüm entegrasyonlar için tek bir e-posta adresi kullanın</li>
            </ul>
          </div>

          {/* Tekrar Gösterme Checkbox */}
          <Form.Check 
            type="checkbox"
            id="dont-show-again"
            label="Bu uyarıyı bir daha gösterme"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="mt-3"
            style={{ fontSize: '0.95rem' }}
          />
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '20px 30px' }}>
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleModalClose}
            className="w-100"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '12px 30px',
              fontWeight: '600',
              fontSize: '1.05rem'
            }}
          >
            Anladım, PrintNest'e Geç
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Floating Action Menu */}
      <Dropdown className="printnest-floating-back-btn">
        <Dropdown.Toggle 
          variant="primary" 
          size="sm"
          id="printnest-actions-dropdown"
          style={{
            borderRadius: '8px',
            padding: '8px 12px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <FaArrowLeft className="me-2" />
          Menü
        </Dropdown.Toggle>

        <Dropdown.Menu 
          align="start"
          style={{
            minWidth: '280px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e3e8ef',
            borderRadius: '8px',
            padding: '8px'
          }}
        >
          <Dropdown.Item 
            onClick={() => navigate(ROUTES.PRINTNEST_DASHBOARD)}
            className="d-flex align-items-center gap-2 py-2"
            style={{ fontSize: '0.95rem' }}
          >
            <FaArrowLeft style={{ color: '#0d6efd' }} />
            <span>Dashboard'a Geri Dön</span>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item 
            href="https://printnest.com/admin/settings/integrations"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-start gap-2 py-2"
            style={{ fontSize: '0.95rem' }}
          >
            <FaStore style={{ color: '#198754', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div className="fw-bold mb-1" style={{ color: '#198754' }}>
                Mağaza Bağlama
              </div>
              <small className="text-muted">
                PrintNest'e mağaza bağlamak için tıklayınız
              </small>
            </div>
          </Dropdown.Item>

          <Dropdown.Divider />

          <Dropdown.Item 
            href="https://www.printnest.com/help/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-start gap-2 py-2"
            style={{ fontSize: '0.95rem' }}
          >
            <FaQuestionCircle style={{ color: '#ffc107', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div className="fw-bold mb-1" style={{ color: '#856404' }}>
                Yardım & Destek
              </div>
              <small className="text-muted">
                PrintNest ile yaşadığınız problemleri bu linkten iletebilirsiniz
              </small>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <div className="printnest-iframe-wrapper">
        <PrintNestIframe />
      </div>
    </div>
  );
};

export default PrintNestPage;

