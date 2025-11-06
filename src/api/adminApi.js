import axiosInstance from './axiosConfig';

export const adminApi = {
  // Get all users
  getUsers: async (params = {}) => {
    const { search, printNestConfirmed, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      ...(search && { search }),
      ...(printNestConfirmed !== undefined && { printNestConfirmed }),
      page,
      limit,
    });
    const response = await axiosInstance.get(`/admin/users?${queryParams}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Confirm PrintNest registration
  confirmPrintNest: async (userId) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/confirm-printnest`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  // Update user tokens
  updateUserTokens: async (userId, dailyTokens) => {
    const response = await axiosInstance.put(`/admin/users/${userId}/tokens`, { dailyTokens });
    return response.data;
  },

  // Reset user tokens
  resetUserTokens: async (userId) => {
    const response = await axiosInstance.post(`/admin/users/${userId}/reset-tokens`);
    return response.data;
  },

  // Get PrintNest sessions
  getPrintNestSessions: async (params = {}) => {
    const { userId, startDate, endDate, page = 1, limit = 20 } = params;
    const queryParams = new URLSearchParams({
      ...(userId && { userId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      page,
      limit,
    });
    const response = await axiosInstance.get(`/admin/printnest-sessions?${queryParams}`);
    return response.data;
  },

  // Get stats
  getStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },

  // Manual sync to Google Sheets (DATABASE -> SHEET)
  syncToSheets: async () => {
    const response = await axiosInstance.post('/admin/sync-to-sheets');
    return response.data;
  },

  // Import from Google Sheets to Database (SHEET -> DATABASE)
  importFromSheets: async () => {
    const response = await axiosInstance.post('/admin/import-from-sheets');
    return response.data;
  },

  // Get sync logs
  getSyncLogs: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/admin/sync-logs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get system settings
  getSettings: async () => {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  },

  // Update system setting
  updateSetting: async (settingKey, settingValue) => {
    const response = await axiosInstance.put('/admin/settings', { settingKey, settingValue });
    return response.data;
  },
};

