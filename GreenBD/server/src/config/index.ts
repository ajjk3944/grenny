import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  database: {
    url: process.env.DATABASE_URL!,
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiry: process.env.JWT_EXPIRY || '7d',
  },
  
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  
  rateLimit: {
    submissionsPerDay: parseInt(process.env.RATE_LIMIT_SUBMISSIONS_PER_DAY || '5', 10),
    cooldownMinutes: parseInt(process.env.RATE_LIMIT_COOLDOWN_MINUTES || '30', 10),
  },
};
