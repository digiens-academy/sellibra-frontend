import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import PrintNestIframe from '../components/printnest/PrintNestIframe';
import { ROUTES } from '../utils/constants';

const PrintNestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="printnest-fullscreen-container">
      {/* Floating Back Button */}
      <Button 
        variant="primary" 
        size="sm"
        onClick={() => navigate(ROUTES.PRINTNEST_DASHBOARD)}
        className="printnest-floating-back-btn"
        title="PrintNest Dashboard'a Dön"
      >
        <FaArrowLeft />
      </Button>
      
      <div className="printnest-iframe-wrapper">
        <PrintNestIframe />
      </div>
    </div>
  );
};

export default PrintNestPage;

