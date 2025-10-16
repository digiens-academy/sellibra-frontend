import axios from 'axios';

const SUBSCRIPTION_API_URL = 'https://kpi-crm-api.digienskampus.com/webhook';

export const subscriptionApi = {
  // Check premium subscription
  checkPremiumSubscription: async (email) => {
    try {
      const response = await axios.get(`${SUBSCRIPTION_API_URL}/check-subscription`, {
        params: {
          email: email,
          type: 'PREMIUM'
        },
        timeout: 5000
      });
      
      return {
        success: response.data.success || false,
        hasActiveSubscription: response.data.hasActiveSubscription || false,
        message: response.data.message || ''
      };
    } catch (error) {
      console.error('Subscription check error:', error);
      return {
        success: false,
        hasActiveSubscription: false,
        message: 'Abonelik kontrolü yapılamadı'
      };
    }
  }
};

