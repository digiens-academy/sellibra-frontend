import api from './axiosConfig';

// Aktif bildirimleri getir (kullanıcılar için)
export const getActiveAnnouncements = async () => {
  const response = await api.get('/announcements/active');
  return response.data;
};

// Tüm bildirimleri getir (admin/support paneli için)
export const getAllAnnouncements = async (page = 1, limit = 20) => {
  const response = await api.get('/announcements', {
    params: { page, limit }
  });
  return response.data;
};

// ID'ye göre bildirim getir
export const getAnnouncementById = async (id) => {
  const response = await api.get(`/announcements/${id}`);
  return response.data;
};

// Yeni bildirim oluştur
export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

// Bildirimi güncelle
export const updateAnnouncement = async (id, announcementData) => {
  const response = await api.put(`/announcements/${id}`, announcementData);
  return response.data;
};

// Bildirimi yayından kaldır
export const deactivateAnnouncement = async (id) => {
  const response = await api.put(`/announcements/${id}/deactivate`);
  return response.data;
};

// Bildirimi yayına al
export const activateAnnouncement = async (id) => {
  const response = await api.put(`/announcements/${id}/activate`);
  return response.data;
};

// Bildirimi sil
export const deleteAnnouncement = async (id) => {
  const response = await api.delete(`/announcements/${id}`);
  return response.data;
};

