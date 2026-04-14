import api from './api';
import { MapPin } from '../types';

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapFilters {
  category?: string;
  timeRange?: 'week' | 'month' | 'all';
}

export const getMapPins = async (region: MapRegion, filters: MapFilters = {}): Promise<MapPin[]> => {
  try {
    const response = await api.get('/map/pins', {
      params: {
        minLat: region.latitude - region.latitudeDelta / 2,
        maxLat: region.latitude + region.latitudeDelta / 2,
        minLng: region.longitude - region.longitudeDelta / 2,
        maxLng: region.longitude + region.longitudeDelta / 2,
        category: filters.category,
        timeRange: filters.timeRange,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch map pins:', error);
    return [];
  }
};

export const getAreaStats = async (areaName: string): Promise<{
  totalActions: number;
  recentActivities: any[];
}> => {
  try {
    const response = await api.get('/map/area-stats', {
      params: { area: areaName },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch area stats:', error);
    return { totalActions: 0, recentActivities: [] };
  }
};

export const getSubmissionDetail = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/submissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch submission detail:', error);
    return null;
  }
};
