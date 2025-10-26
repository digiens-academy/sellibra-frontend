import axios from './axiosConfig';

export const etsyStoreApi = {
  // Get all user's Etsy stores
  getStores: async () => {
    const response = await axios.get('/etsy-stores');
    return response.data;
  },

  // Add new Etsy store
  addStore: async (storeData) => {
    const response = await axios.post('/etsy-stores', storeData);
    return response.data;
  },

  // Update Etsy store
  updateStore: async (storeId, storeData) => {
    const response = await axios.put(`/etsy-stores/${storeId}`, storeData);
    return response.data;
  },

  // Delete Etsy store
  deleteStore: async (storeId) => {
    const response = await axios.delete(`/etsy-stores/${storeId}`);
    return response.data;
  },
};

