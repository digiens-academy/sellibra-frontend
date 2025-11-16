import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../utils/constants';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      // Unauthorized - clear storage and redirect to login
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapınız.');
      }
    } else if (!error.response) {
      // Network error - no response from server
      toast.error('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

