import axiosInstance from './axiosConfig';

export const printnestApi = {
  // Track iframe open
  trackOpen: async (referrerPage) => {
    const response = await axiosInstance.post('/printnest/track-open', { referrerPage });
    return response.data;
  },

  // Track iframe close
  trackClose: async (sessionId, timeSpent) => {
    const response = await axiosInstance.post('/printnest/track-close', {
      sessionId,
      timeSpent,
    });
    return response.data;
  },

  // Track interaction
  trackInteraction: async (sessionId) => {
    const response = await axiosInstance.post('/printnest/track-interaction', { sessionId });
    return response.data;
  },

  // Get my sessions
  getMySessions: async (limit = 20) => {
    const response = await axiosInstance.get(`/printnest/my-sessions?limit=${limit}`);
    return response.data;
  },
};

