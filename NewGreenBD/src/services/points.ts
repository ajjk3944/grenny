import api from './api';

export const getPointsSummary = async () => {
  const response = await api.get('/points/summary');
  return response.data;
};

export const getPointsHistory = async (period: 'week' | 'month' | 'year' = 'week') => {
  const response = await api.get('/points/history', {
    params: { period },
  });
  return response.data;
};
