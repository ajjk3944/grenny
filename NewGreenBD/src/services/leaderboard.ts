import api from './api';

export const getLeaderboard = async (
  scope: 'national' | 'district' = 'national',
  period: 'weekly' | 'monthly' | 'yearly' | 'all' = 'monthly',
  district?: string
) => {
  const response = await api.get('/leaderboard', {
    params: { scope, period, district },
  });
  return response.data;
};
