import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { STORAGE_KEYS } from '../utils/constants';
import { toast } from 'react-toastify';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  loading: false,
  error: null,
  dailyTokens: null,

  // Register
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      toast.success(response.message || 'Kayıt başarılı!');
      return true;
    } catch (error) {
      // Extract error message from response
      let errorMessage = 'Kayıt işlemi başarısız. Lütfen tekrar deneyin.';
      
      if (error.response?.data?.message) {
        // Single error message
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Validation errors array - show all errors
        const errorMessages = error.response.data.errors.map(err => err.message).join('\n');
        errorMessage = errorMessages;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message && !error.message.includes('status code')) {
        errorMessage = error.message;
      }
      
      set({
        loading: false,
        error: errorMessage,
      });
      
      // Toast mesajı ile kullanıcıyı bilgilendir
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { whiteSpace: 'pre-line' }, // Allow multi-line messages
      });
      
      return false;
    }
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { user, token } = response.data;

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });

      toast.success(response.message || 'Giriş başarılı!');
      return true;
    } catch (error) {
      // Extract error message from response
      let errorMessage = 'Giriş başarısız. Lütfen tekrar deneyin.';
      
      if (error.response?.data?.message) {
        // Single error message
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Validation errors array - show all errors
        const errorMessages = error.response.data.errors.map(err => err.message).join('\n');
        errorMessage = errorMessages;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message && !error.message.includes('status code')) {
        errorMessage = error.message;
      }
      
      set({
        loading: false,
        error: errorMessage,
      });
      
      // Toast mesajı ile kullanıcıyı bilgilendir
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { whiteSpace: 'pre-line' }, // Allow multi-line messages
      });
      
      return false;
    }
  },

  // Logout
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    }

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    toast.info('Çıkış yapıldı');
  },

  // Check auth (verify token)
  checkAuth: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
      return;
    }

    try {
      const response = await authApi.getMe();
      const { user } = response.data;

      // Update user in localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      // Token invalid or expired
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  // Update user profile
  updateUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    set({ user });
  },

  // Update tokens
  updateTokens: (tokens) => {
    set({ dailyTokens: tokens });
  },

  // Set tokens from response
  setTokensFromResponse: (remainingTokens) => {
    if (remainingTokens !== undefined) {
      set({ dailyTokens: remainingTokens });
    }
  },
}));

export default useAuthStore;

