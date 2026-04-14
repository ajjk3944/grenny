import admin from 'firebase-admin';
import { config } from '../config';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    privateKey: config.firebase.privateKey,
    clientEmail: config.firebase.clientEmail,
  }),
});

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const sendPushNotification = async (
  fcmToken: string,
  payload: NotificationPayload
): Promise<void> => {
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    });
  } catch (error) {
    console.error('Push notification error:', error);
  }
};

export const sendBulkNotifications = async (
  tokens: string[],
  payload: NotificationPayload
): Promise<void> => {
  try {
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    });
  } catch (error) {
    console.error('Bulk notification error:', error);
  }
};
