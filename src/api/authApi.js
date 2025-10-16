import axiosInstance from './axiosConfig';

export const authApi = {
  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },
};

