export const APP_CONFIG = {
  name: 'GreenBD',
  version: '1.0.0',
  buildNumber: 1,
  
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 30000,
    retryAttempts: 3,
  },
  
  features: {
    biometricAuth: true,
    offlineMode: true,
    pushNotifications: true,
    voiceInput: true,
    socialSharing: true,
    deepLinking: true,
  },
  
  limits: {
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxVideoSize: 50 * 1024 * 1024, // 50MB
    maxImagesPerSubmission: 5,
    maxDescriptionLength: 500,
    minDescriptionLength: 10,
  },
  
  points: {
    photoSubmission: 10,
    videoSubmission: 20,
    verifiedSubmission: 50,
    dailyLoginBonus: 5,
    referralBonus: 100,
    challengeCompletion: 100,
  },
  
  sync: {
    intervalMinutes: 15,
    maxRetries: 5,
    batchSize: 10,
  },
  
  cache: {
    imageCacheDays: 7,
    dataCacheHours: 24,
  },
  
  theme: {
    primaryColor: '#006A4E',
    secondaryColor: '#F42A41',
    accentColor: '#FFD700',
  },
};
