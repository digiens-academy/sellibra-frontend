import { Modal, Button, Badge } from 'react-bootstrap';
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AnnouncementModal = ({ show, onHide, announcements = [] }) => {
  // Bildirim tipine göre ikon ve renk seç
  const getTypeConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle size={24} />,
          color: '#198754',
          bgColor: '#d1e7dd',
          badgeVariant: 'success'
        };
      case 'warning':
        return {
          icon: <FaExclamationTriangle size={24} />,
          color: '#ffc107',
          bgColor: '#fff3cd',
          badgeVariant: 'warning'
        };
      case 'error':
        return {
          icon: <FaTimesCircle size={24} />,
          color: '#dc3545',
          bgColor: '#f8d7da',
          badgeVariant: 'danger'
        };
      case 'info':
      default:
        return {
          icon: <FaInfoCircle size={24} />,
          color: '#0dcaf0',
          bgColor: '#cff4fc',
          badgeVariant: 'info'
        };
    }
  };

  // Tarihi formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="lg" 
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton style={{ borderBottom: '2px solid #dee2e6' }}>
        <Modal.Title className="d-flex align-items-center gap-2">
          <FaInfoCircle style={{ color: '#0d6efd' }} />
          Önemli Duyurular
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {announcements.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaInfoCircle size={48} className="mb-3" />
            <p>Şu anda aktif duyuru bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {announcements.map((announcement) => {
              const typeConfig = getTypeConfig(announcement.type);
              return (
                <div
                  key={announcement.id}
                  className="p-4 rounded-3 border-start border-4"
                  style={{
                    backgroundColor: typeConfig.bgColor,
                    borderColor: `${typeConfig.color} !important`
                  }}
                >
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div style={{ color: typeConfig.color, flexShrink: 0 }}>
                      {typeConfig.icon}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <h5 className="mb-0 fw-bold" style={{ color: typeConfig.color }}>
                          {announcement.title}
                        </h5>
                        <Badge bg={typeConfig.badgeVariant} className="text-uppercase">
                          {announcement.type === 'info' ? 'Bilgi' : 
                           announcement.type === 'warning' ? 'Uyarı' :
                           announcement.type === 'success' ? 'Başarılı' :
                           'Hata'}
                        </Badge>
                      </div>
                      
                      <p 
                        className="mb-0" 
                        style={{ 
                          fontSize: '0.95rem', 
                          lineHeight: '1.6', 
                          color: '#495057',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="primary" onClick={onHide}>
          Anladım
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnnouncementModal;

