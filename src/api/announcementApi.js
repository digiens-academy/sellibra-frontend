import api from './axiosConfig';

// Admin Announcement Operations
export const announcementApi = {
  // Get all announcements (admin)
  getAnnouncements: async (params = {}) => {
    const response = await api.get('/admin/announcements', { params });
    return response.data;
  },

  // Get announcement by ID (admin)
  getAnnouncementById: async (id) => {
    const response = await api.get(`/admin/announcements/${id}`);
    return response.data;
  },

  // Create announcement (admin)
  createAnnouncement: async (data) => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  },

  // Update announcement (admin)
  updateAnnouncement: async (id, data) => {
    const response = await api.put(`/admin/announcements/${id}`, data);
    return response.data;
  },

  // Toggle announcement status (admin)
  toggleAnnouncementStatus: async (id) => {
    const response = await api.patch(`/admin/announcements/${id}/toggle`);
    return response.data;
  },

  // Delete announcement (admin)
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/admin/announcements/${id}`);
    return response.data;
  },

  // Get announcement stats (admin)
  getAnnouncementStats: async () => {
    const response = await api.get('/admin/announcements/stats');
    return response.data;
  },

  // Get active announcements (public)
  getActiveAnnouncements: async () => {
    const response = await api.get('/announcements/active');
    return response.data;
  },
};

export default announcementApi;

