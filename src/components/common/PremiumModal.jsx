import { Modal, Button } from 'react-bootstrap';
import { FaCrown, FaTimes } from 'react-icons/fa';

const PremiumModal = ({ show, onHide }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="border-0 pb-0">
        <Button
          variant="link"
          className="ms-auto text-decoration-none text-dark"
          onClick={onHide}
          aria-label="Kapat"
        >
          <FaTimes size={24} />
        </Button>
      </Modal.Header>
      
      <Modal.Body className="text-center px-5 pb-5">
        <div className="mb-4">
          <FaCrown size={80} style={{ color: '#FFD700' }} />
        </div>
        
        <h2 className="mb-4">Premium Özellik</h2>
        
        <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
          <strong>Etsy-AI Tools</strong> modülü sadece premium aboneliği olan öğrenciler için kullanılabilir.
        </p>
        
        <div className="alert alert-info mb-4">
          <h5 className="mb-3">Premium Üyelik Avantajları:</h5>
          <ul className="text-start mb-0">
            <li>AI destekli görsel arka plan silme</li>
            <li>Text-to-Image ile tasarım oluşturma</li>
            <li>Image-to-Image ile tasarım dönüştürme</li>
            <li>Mockup generator ile ürün görselleri</li>
            <li>Etsy için otomatik başlık oluşturma</li>
            <li>SEO uyumlu ürün açıklamaları</li>
            <li>Kâr hesaplayıcı araçları</li>
          </ul>
        </div>
        
        <p className="text-muted mb-4">
          Premium üyelik için lütfen Digiens Kampüs platformundan abone olunuz.
        </p>
        
        <div className="d-flex gap-3 justify-content-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.open('https://www.digiensacademy.com/login', '_blank')}
          >
            Premium Ol
          </Button>
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={onHide}
          >
            Kapat
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PremiumModal;

