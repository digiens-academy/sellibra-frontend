import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaPalette, FaInfoCircle } from 'react-icons/fa';
import { MODULES } from '../../utils/constants';

const DesignPage = () => {
  const navigate = useNavigate();

  const handleToolClick = (route) => {
    navigate(route);
  };

  const designTools = MODULES.ETSY_AI.subModules.find(m => m.id === 'design')?.subTools || [];

  return (
    <div className="dashboard-container">
      <Container fluid className="main-content">
        <div className="page-header">
          <h2 className="d-flex align-items-center gap-2">
            <FaPalette style={{ color: '#00D4A0' }} /> Tasarım
          </h2>
          <p>AI ile tasarım oluşturma ve düzenleme</p>
        </div>

        {/* Design Tools Grid */}
        <Row>
          {designTools.map((tool) => (
            <Col key={tool.id} md={6} lg={4} className="mb-4">
              <Card 
                className="tool-card h-100 hover-shadow"
                onClick={() => handleToolClick(tool.route)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex flex-column align-items-center text-center p-4">
                  <div className="tool-icon mb-3" style={{ fontSize: '4rem' }}>
                    <tool.Icon style={{ color: tool.iconColor }} />
                  </div>
                  <h5 className="mb-2">{tool.name}</h5>
                  <p className="text-muted small mb-0">
                    {tool.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Info Section */}
        <Row className="mt-4">
          <Col>
            <Card className="bg-light">
              <Card.Body>
                <h6 className="mb-3 d-flex align-items-center gap-2">
                  <FaInfoCircle style={{ color: '#4A90E2' }} /> Tasarım Araçları Hakkında
                </h6>
                <Row>
                  {designTools.map((tool) => {
                    const infoTexts = {
                      'remove-bg': 'Ürün görsellerinizden arka planı otomatik olarak kaldırın. Profesyonel beyaz arka plan için ideal.',
                      'text-to-image': 'Metin açıklamasından AI ile görsel oluşturun. Ürün fikirleri için hızlı mockup.',
                      'image-to-image': 'Mevcut görselinizi AI ile dönüştürün. Farklı stiller ve varyasyonlar oluşturun.',
                      'mockup-generator': 'Tasarımınızı gerçek ürünler üzerinde görüntüleyin. Tişört, hoodie, mug ve daha fazlası için profesyonel mockup\'lar oluşturun.'
                    };

                    return (
                      <Col key={tool.id} md={4}>
                        <div className="mb-3">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <tool.Icon style={{ color: tool.iconColor }} />
                            <strong>{tool.name}</strong>
                          </div>
                          <p className="text-muted small mb-0">
                            {infoTexts[tool.id]}
                          </p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DesignPage;

