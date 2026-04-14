import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';
import { Notification } from '../types';
import { storage } from '../utils/storage';

const PUSH_TOKEN_KEY = 'push_token';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async (): Promise<string | null> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Replace with actual project ID
    });

    const token = tokenData.data;

    // Save token locally
    await storage.set(PUSH_TOKEN_KEY, token);

    // Send token to backend
    try {
      await api.post('/notifications/register', { token, platform: Platform.OS });
    } catch (error) {
      console.error('Failed to register push token with backend:', error);
    }

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

export const markAllAsRead = async (): Promise<void> => {
  try {
    await api.put('/notifications/read-all');
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    throw error;
  }
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await api.put(`/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

export const getNotificationIcon = (type: Notification['type']): string => {
  const icons: Record<Notification['type'], string> = {
    verification_complete: 'checkmark-circle',
    points_earned: 'star',
    grade_upgrade: 'arrow-up-circle',
    new_challenge: 'flag',
    streak_reminder: 'flame',
    government_announcement: 'megaphone',
    warning: 'warning',
    submission_rejected: 'close-circle',
  };
  return icons[type] || 'notifications';
};

export const getNotificationColor = (type: Notification['type']): string => {
  const colors: Record<Notification['type'], string> = {
    verification_complete: '#10b981',
    points_earned: '#f59e0b',
    grade_upgrade: '#3b82f6',
    new_challenge: '#8b5cf6',
    streak_reminder: '#f97316',
    government_announcement: '#06b6d4',
    warning: '#eab308',
    submission_rejected: '#ef4444',
  };
  return colors[type] || '#6b7280';
};

// Setup notification listeners
export const setupNotificationListeners = (
  onNotificationReceived: (notification: Notifications.Notification) => void,
  onNotificationTapped: (response: Notifications.NotificationResponse) => void
) => {
  const receivedSubscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(onNotificationTapped);

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};
