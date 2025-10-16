import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { MODULES } from '../../utils/constants';
import '../../styles/components/_etsy-ai-sidebar.scss';

const EtsyAISidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(['design']); // Design grubu default açık

  const tools = MODULES.ETSY_AI.subModules;

  const handleToolClick = (route) => {
    navigate(route);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  const isGroupActive = (tool) => {
    if (tool.subTools) {
      return tool.subTools.some(subTool => isActiveRoute(subTool.route));
    }
    return isActiveRoute(tool.route);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`etsy-ai-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">
            <MODULES.ETSY_AI.Icon className="me-2" />
            {isOpen && <span>Etsy-AI Tools</span>}
          </div>
          <button 
            className="sidebar-toggle-btn"
            onClick={onToggle}
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {tools.map((tool) => {
              const hasSubTools = tool.subTools && tool.subTools.length > 0;
              const isExpanded = expandedGroups.includes(tool.id);
              const isActive = isGroupActive(tool);

              return (
                <li key={tool.id} className="nav-item">
                  <div
                    className={`nav-link ${isActive ? 'active' : ''} ${hasSubTools ? 'has-children' : ''}`}
                    onClick={() => {
                      if (hasSubTools) {
                        toggleGroup(tool.id);
                        handleToolClick(tool.route);
                      } else {
                        handleToolClick(tool.route);
                      }
                    }}
                  >
                    <div className="nav-link-content">
                      <tool.Icon 
                        className="nav-icon"
                      />
                      {isOpen && (
                        <>
                          <span className="nav-text">{tool.name}</span>
                          {hasSubTools && (
                            <span className="nav-arrow">
                              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sub Tools */}
                  {hasSubTools && isExpanded && isOpen && (
                    <ul className="sub-nav-list">
                      {tool.subTools.map((subTool) => {
                        const isSubActive = isActiveRoute(subTool.route);
                        return (
                          <li key={subTool.id} className="sub-nav-item">
                            <div
                              className={`sub-nav-link ${isSubActive ? 'active' : ''}`}
                              onClick={() => handleToolClick(subTool.route)}
                            >
                              <subTool.Icon 
                                className="sub-nav-icon"
                              />
                              <span className="sub-nav-text">{subTool.name}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Info */}
        {isOpen && (
          <div className="sidebar-footer">
            <small className="text-muted">
              AI destekli {tools.length} araç
            </small>
          </div>
        )}
      </div>
    </>
  );
};

export default EtsyAISidebar;

