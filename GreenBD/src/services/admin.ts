import api from './api';
import { Activity } from '../types';

export const adminService = {
  async getPendingActivities(): Promise<Activity[]> {
    const response = await api.get('/admin/activities/pending');
    return response.data;
  },

  async approveActivity(id: string, points: number) {
    const response = await api.post(`/admin/activities/${id}/approve`, { points });
    return response.data;
  },

  async rejectActivity(id: string, reason: string) {
    const response = await api.post(`/admin/activities/${id}/reject`, { reason });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
