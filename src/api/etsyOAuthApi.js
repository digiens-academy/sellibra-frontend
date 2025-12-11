import axios from './axiosConfig';

export const etsyOAuthApi = {
  // Initiate OAuth connection to Etsy
  initiateConnection: async (scopes = ['listings_r', 'shops_r', 'transactions_r']) => {
    const response = await axios.get('/etsy-oauth/connect', {
      params: { scopes: scopes.join(',') },
    });
    return response.data;
  },

  // Get OAuth connection status for all stores
  getConnectionStatus: async () => {
    const response = await axios.get('/etsy-oauth/status');
    return response.data;
  },

  // Manually refresh token for a store
  refreshToken: async (storeId) => {
    const response = await axios.post(`/etsy-oauth/refresh/${storeId}`);
    return response.data;
  },

  // Disconnect a store
  disconnectStore: async (storeId) => {
    const response = await axios.delete(`/etsy-oauth/disconnect/${storeId}`);
    return response.data;
  },

  // Test connection for a store
  testConnection: async (storeId) => {
    const response = await axios.get(`/etsy-oauth/test-connection/${storeId}`);
    return response.data;
  },
};

