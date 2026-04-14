import api from './api';
import { Challenge } from '../types';

export const getChallenges = async (filter: 'active' | 'my' | 'completed' = 'active'): Promise<Challenge[]> => {
  try {
    const response = await api.get('/challenges', { params: { filter } });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    return [];
  }
};

export const getChallengeDetail = async (id: string): Promise<Challenge | null> => {
  try {
    const response = await api.get(`/challenges/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenge detail:', error);
    return null;
  }
};

export const joinChallenge = async (id: string): Promise<void> => {
  try {
    await api.post(`/challenges/${id}/join`);
  } catch (error) {
    console.error('Failed to join challenge:', error);
    throw error;
  }
};

export const leaveChallenge = async (id: string): Promise<void> => {
  try {
    await api.post(`/challenges/${id}/leave`);
  } catch (error) {
    console.error('Failed to leave challenge:', error);
    throw error;
  }
};

export const getChallengeLeaderboard = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get(`/challenges/${id}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenge leaderboard:', error);
    return [];
  }
};

export const getChallengeActivity = async (id: string): Promise<any[]> => {
  try {
    const response = await api.get(`/challenges/${id}/activity`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch challenge activity:', error);
    return [];
  }
};
