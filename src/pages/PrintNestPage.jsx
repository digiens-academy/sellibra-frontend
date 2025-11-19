import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FaArrowLeft, FaStore, FaQuestionCircle } from 'react-icons/fa';
import PrintNestIframe from '../components/printnest/PrintNestIframe';
import { ROUTES } from '../utils/constants';

const PrintNestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="printnest-fullscreen-container">
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

