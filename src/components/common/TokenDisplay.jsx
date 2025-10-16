import React, { useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import { userApi } from '../../api/userApi';
import { FaCoins } from 'react-icons/fa';

const TokenDisplay = () => {
  const { dailyTokens, updateTokens } = useAuthStore();

  useEffect(() => {
    // Token bilgisini al
    const fetchTokens = async () => {
      try {
        const response = await userApi.getTokens();
        updateTokens(response.data.tokens.dailyTokens);
      } catch (error) {
        console.error('Token bilgisi alınamadı:', error);
      }
    };

    fetchTokens();
  }, [updateTokens]);

  return (
    <div className="token-display">
      <div className="token-card">
        <FaCoins className="token-icon" />
        <div className="token-info">
          <span className="token-label">Kalan Token:</span>
          <span className="token-value">{dailyTokens !== null ? dailyTokens : '...'}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenDisplay;

