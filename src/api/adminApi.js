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

  // Manual sync to Google Sheets
  syncToSheets: async () => {
    const response = await axiosInstance.post('/admin/sync-to-sheets');
    return response.data;
  },

  // Get sync logs
  getSyncLogs: async (page = 1, limit = 20) => {
    const response = await axiosInstance.get(`/admin/sync-logs?page=${page}&limit=${limit}`);
    return response.data;
  },
};

