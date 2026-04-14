/**
 * App Configuration
 * Central configuration for the entire application
 */

import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
    enableLogging: true,
    enableMockData: true,
  },
  staging: {
    apiUrl: 'https://staging-api.greenbd.app/api',
    wsUrl: 'wss://staging-api.greenbd.app',
    enableLogging: true,
    enableMockData: false,
  },
  prod: {
    apiUrl: 'https://api.greenbd.app/api',
    wsUrl: 'wss://api.greenbd.app',
    enableLogging: false,
    enableMockData: false,
  },
};

const getEnvVars = () => {
  const releaseChannel = Constants.expoConfig?.extra?.releaseChannel;
  
  if (__DEV__) return ENV.dev;
  if (releaseChannel === 'staging') return ENV.staging;
  return ENV.prod;
};

const env = getEnvVars();

export const AppConfig = {
  // API Configuration
  apiUrl: env.apiUrl,
  wsUrl: env.wsUrl,
  apiTimeout: 30000, // 30 seconds
  
  // Feature Flags
  enableLogging: env.enableLogging,
  enableMockData: env.enableMockData,
  enableBiometric: true,
  enablePushNotifications: true,
  enableOfflineMode: true,
  enableAIReview: true,
  
  // App Information
  appName: 'GreenBD',
  appVersion: Constants.expoConfig?.version || '1.0.0',
  buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1',
  bundleId: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package || 'com.greenbd.app',
  
  // Submission Limits
  maxSubmissionsPerDay: 5,
  submissionCooldown: 30 * 60 * 1000, // 30 minutes in ms
  maxMediaSize: 10 * 1024 * 1024, // 10MB
  maxVideoDuration: 60, // seconds
  
  // Points Configuration
  pointsPerSubmission: {
    min: 10,
    max: 100,
    aiBonus: 20,
    locationBonus: 10,
    descriptionBonus: 5,
  },
  
  // Grade Thresholds
  gradeThresholds: {
    bronze: 0,
    silver: 500,
    gold: 2000,
    platinum: 5000,
    diamond: 10000,
  },
  
  // Leaderboard Configuration
  leaderboardLevels: ['ward', 'upazila', 'district', 'division', 'national'],
  leaderboardPageSize: 20,
  
  // Map Configuration
  mapConfig: {
    initialRegion: {
      latitude: 23.8103, // Dhaka
      longitude: 90.4125,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    clusterRadius: 50,
    maxZoom: 18,
    minZoom: 5,
  },
  
  // Cache Configuration
  cacheConfig: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 50 * 1024 * 1024, // 50MB
    imageCacheSize: 100, // number of images
  },
  
  // Notification Configuration
  notificationConfig: {
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true,
  },
  
  // Offline Configuration
  offlineConfig: {
    maxQueueSize: 50,
    syncInterval: 5 * 60 * 1000, // 5 minutes
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Security Configuration
  securityConfig: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  
  // UI Configuration
  uiConfig: {
    animationDuration: 300,
    toastDuration: 3000,
    skeletonAnimationSpeed: 1000,
    refreshControlTintColor: '#006A4E',
  },
  
  // External Services
  services: {
    googleMapsApiKey: Constants.expoConfig?.android?.config?.googleMaps?.apiKey || '',
    firebaseProjectId: Constants.expoConfig?.extra?.firebaseProjectId || '',
  },
  
  // Support
  support: {
    email: 'support@greenbd.app',
    phone: '+8801234567890',
    website: 'https://greenbd.app',
    privacyPolicy: 'https://greenbd.app/privacy',
    termsOfService: 'https://greenbd.app/terms',
  },
  
  // Development
  isDev: __DEV__,
  isStaging: Constants.expoConfig?.extra?.releaseChannel === 'staging',
  isProd: !__DEV__ && Constants.expoConfig?.extra?.releaseChannel !== 'staging',
};

// Type-safe config access
export type AppConfigType = typeof AppConfig;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof AppConfig): boolean => {
  const value = AppConfig[feature];
  return typeof value === 'boolean' ? value : false;
};

export const getApiUrl = (endpoint: string): string => {
  return `${AppConfig.apiUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

export const getGradeFromPoints = (points: number): string => {
  const { gradeThresholds } = AppConfig;
  
  if (points >= gradeThresholds.diamond) return 'diamond';
  if (points >= gradeThresholds.platinum) return 'platinum';
  if (points >= gradeThresholds.gold) return 'gold';
  if (points >= gradeThresholds.silver) return 'silver';
  return 'bronze';
};

export const getNextGradeThreshold = (currentPoints: number): { grade: string; points: number } => {
  const { gradeThresholds } = AppConfig;
  
  if (currentPoints < gradeThresholds.silver) {
    return { grade: 'silver', points: gradeThresholds.silver };
  }
  if (currentPoints < gradeThresholds.gold) {
    return { grade: 'gold', points: gradeThresholds.gold };
  }
  if (currentPoints < gradeThresholds.platinum) {
    return { grade: 'platinum', points: gradeThresholds.platinum };
  }
  if (currentPoints < gradeThresholds.diamond) {
    return { grade: 'diamond', points: gradeThresholds.diamond };
  }
  
  return { grade: 'diamond', points: gradeThresholds.diamond };
};

export default AppConfig;
