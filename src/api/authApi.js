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

  // Request password reset
  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset token
  verifyResetToken: async (token) => {
    const response = await axiosInstance.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
};

