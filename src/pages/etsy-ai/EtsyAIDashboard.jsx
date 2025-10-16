import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import EtsyAISidebar from '../../components/etsy-ai/EtsyAISidebar';

const EtsyAIDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Responsive: Mobilde sidebar'ı kapat
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="etsy-ai-layout">
      <EtsyAISidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
      
      <div 
        className={`etsy-ai-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default EtsyAIDashboard;

