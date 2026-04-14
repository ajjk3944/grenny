import express from 'express';
import cors from 'cors';
import { config } from './config';
import { apiRateLimit } from './middleware/rateLimit';

import authRoutes from './routes/auth';
import submissionsRoutes from './routes/submissions';
import pointsRoutes from './routes/points';
import leaderboardRoutes from './routes/leaderboard';
import benefitsRoutes from './routes/benefits';
import notificationsRoutes from './routes/notifications';
import profileRoutes from './routes/profile';
import adminRoutes from './routes/admin';
import securityRoutes from './routes/security';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRateLimit);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/security', securityRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(config.port, () => {
  console.log(`GreenBD API Server running on port ${config.port}`);
  console.log(`Environment: ${config.env}`);
});
