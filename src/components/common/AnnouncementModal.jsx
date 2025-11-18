import { useState, useEffect } from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { announcementApi } from '../../api/announcementApi';
import './AnnouncementModal.scss';

const AnnouncementModal = () => {
  const [show, setShow] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    fetchActiveAnnouncements();
  }, []);

  const fetchActiveAnnouncements = async () => {
    try {
      const response = await announcementApi.getActiveAnnouncements();
      const activeAnnouncements = response.data.announcements;

      if (activeAnnouncements && activeAnnouncements.length > 0) {
        // Filter out announcements that user has already seen
        const viewedAnnouncements = getViewedAnnouncements();
        const newAnnouncements = activeAnnouncements.filter(
          (announcement) => !viewedAnnouncements.includes(announcement.id)
        );

        // Sort by priority: high -> normal -> low
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        newAnnouncements.sort(
          (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
        );

        if (newAnnouncements.length > 0) {
          setAnnouncements(newAnnouncements);
          setShow(true);
        }
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const getViewedAnnouncements = () => {
    try {
      const viewed = localStorage.getItem('viewedAnnouncements');
      return viewed ? JSON.parse(viewed) : [];
    } catch (error) {
      return [];
    }
  };

  const markAsViewed = (announcementId) => {
    try {
      const viewed = getViewedAnnouncements();
      if (!viewed.includes(announcementId)) {
        viewed.push(announcementId);
        localStorage.setItem('viewedAnnouncements', JSON.stringify(viewed));
      }
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
    }
  };

  const handleClose = () => {
    const currentAnnouncement = announcements[currentIndex];
    
    if (dontShowAgain && currentAnnouncement) {
      markAsViewed(currentAnnouncement.id);
    }

    // Check if there are more announcements to show
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDontShowAgain(false); // Reset for next announcement
    } else {
      setShow(false);
      setCurrentIndex(0);
      setDontShowAgain(false);
    }
  };

  const handleSkipAll = () => {
    // Mark all remaining announcements as viewed if "don't show again" is checked
    if (dontShowAgain) {
      announcements.forEach((announcement) => {
        markAsViewed(announcement.id);
      });
    }
    setShow(false);
    setCurrentIndex(0);
    setDontShowAgain(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      info: 'info',
      success: 'success',
      warning: 'warning',
      error: 'danger',
    };
    return colors[type] || 'info';
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    return icons[type] || 'ℹ️';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'secondary',
      normal: 'primary',
      high: 'danger',
    };
    return colors[priority] || 'secondary';
  };

  if (announcements.length === 0) {
    return null;
  }

  const currentAnnouncement = announcements[currentIndex];
  const hasMore = currentIndex < announcements.length - 1;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={false}
      className="announcement-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="modal-header-content">
          <div className="icon-wrapper" data-type={currentAnnouncement.type}>
            {getTypeIcon(currentAnnouncement.type)}
          </div>
          <div className="header-text">
            <Modal.Title className="announcement-title">
              {currentAnnouncement.title}
            </Modal.Title>
            <div className="d-flex align-items-center gap-2 mt-1">
              <Badge 
                bg={getPriorityColor(currentAnnouncement.priority)} 
                className="priority-badge"
              >
                {currentAnnouncement.priority === 'high'
                  ? 'Yüksek Öncelik'
                  : currentAnnouncement.priority === 'low'
                  ? 'Düşük Öncelik'
                  : 'Normal Öncelik'}
              </Badge>
              {announcements.length > 1 && (
                <Badge bg="light" text="dark" className="counter-badge">
                  {currentIndex + 1} / {announcements.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="announcement-body">
        <div className={`announcement-content ${currentAnnouncement.type}`}>
          <div className="content-text">
            {currentAnnouncement.content}
          </div>
        </div>

        <div className="dont-show-section">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">Bu duyuruyu bir daha gösterme</span>
          </label>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <div className="footer-buttons">
          {hasMore && (
            <Button 
              variant="outline-secondary" 
              onClick={handleSkipAll}
              className="btn-cancel"
            >
              Tümünü Kapat
            </Button>
          )}
          <Button
            variant={hasMore ? 'primary' : 'success'}
            onClick={handleClose}
            className={`btn-action ${hasMore ? 'btn-next' : 'btn-confirm'}`}
          >
            {hasMore ? 'Sonraki Duyuru →' : 'Anladım'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AnnouncementModal;

