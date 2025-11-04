import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaCrown } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';
import { ROUTES, USER_ROLES } from '../../utils/constants';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <Navbar expand="lg" className="app-navbar shadow-sm">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={ROUTES.HOME} className="fw-bold d-flex align-items-center gap-2">
          <img src="/logo-with-sellibra.svg" alt="Sellibra" style={{ height: '1.75rem', width: 'auto' }} />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to={ROUTES.DASHBOARD}>
                  Ana Sayfa
                </Nav.Link>
                
                <NavDropdown 
                  title="Modüller" 
                  id="modules-dropdown"
                >
                  <NavDropdown.Item as={Link} to={ROUTES.PRINTNEST_DASHBOARD} className="d-flex align-items-center gap-2">
                    <img 
                      src="/integrations/printnest_logo-BSbxRoeY.svg" 
                      alt="PrintNest" 
                      style={{ height: '20px', width: 'auto' }}
                    /> 
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to={ROUTES.ETSY_AI_DASHBOARD} 
                    className="d-flex align-items-center gap-2 justify-content-between"
                  >
                    <span className="d-flex align-items-center gap-2">
                      <img 
                        src="/integrations/etsy.svg" 
                        alt="Etsy" 
                        style={{ height: '20px', width: 'auto' }}
                      /> AI Tools
                    </span>
                    {user?.role !== USER_ROLES.ADMIN && !user?.hasActiveSubscription && (
                      <Badge bg="warning" className="ms-2 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                        <FaCrown size={10} /> PREMIUM
                      </Badge>
                    )}
                  </NavDropdown.Item>
                </NavDropdown>
                
                <NavDropdown 
                  title={`${user?.firstName} ${user?.lastName}`} 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to={ROUTES.PROFILE} className="d-flex align-items-center gap-2">
                    <FaUser /> Profil
                  </NavDropdown.Item>

                  {user?.role === USER_ROLES.ADMIN && (
                  <NavDropdown.Item as={Link} to={ROUTES.ADMIN}>
                    Admin Panel
                  </NavDropdown.Item>
                )}
                  
                  <NavDropdown.Divider />
                  
                  <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center gap-2">
                    <FaSignOutAlt /> Çıkış Yap
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={ROUTES.LOGIN}>
                  Giriş Yap
                </Nav.Link>
                <Nav.Link as={Link} to={ROUTES.REGISTER}>
                  Kayıt Ol
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

