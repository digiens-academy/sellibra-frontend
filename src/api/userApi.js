import axiosInstance from './axiosConfig';

export const userApi = {
  // Get profile
  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (updates) => {
    const response = await axiosInstance.put('/users/profile', updates);
    return response.data;
  },

  // Get PrintNest sessions
  getPrintNestSessions: async (limit = 20) => {
    const response = await axiosInstance.get(`/users/printnest-sessions?limit=${limit}`);
    return response.data;
  },

  // Get user tokens
  getTokens: async () => {
    const response = await axiosInstance.get('/users/tokens');
    return response.data;
  },
};

