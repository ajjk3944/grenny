# GreenBD Deployment Guide

## Prerequisites

- EAS CLI installed: `npm install -g eas-cli`
- Expo account created
- Google Play Console account (for Android)
- Apple Developer account (for iOS)

## Initial Setup

### 1. Configure EAS

```bash
eas login
eas build:configure
```

This creates `eas.json` with build profiles.

### 2. Update App Credentials

Edit `app.json`:
- Update `version` for each release
- Update `android.versionCode` (increment by 1)
- Update `ios.buildNumber` (increment by 1)

## Android Deployment

### Development Build (Internal Testing)

```bash
npm run build:dev-apk
```

- Builds APK with development client
- For internal team testing
- Includes dev tools and debugging

### Preview Build (Beta Testing)

```bash
npm run build:preview-apk
```

- Builds release APK
- For beta testers
- No dev tools
- Takes ~5-8 minutes

Download and share APK directly or use:

```bash
eas build:list
```

### Production Build (Play Store)

```bash
npm run build:prod
```

- Builds Android App Bundle (AAB)
- Optimized and minified
- ProGuard/R8 enabled
- Ready for Play Store submission

### Submit to Play Store

```bash
eas submit -p android
```

Or manually:
1. Go to Google Play Console
2. Create new release
3. Upload AAB file
4. Fill release notes
5. Submit for review

## iOS Deployment

### Development Build

```bash
eas build -p ios --profile development
```

### Production Build

```bash
npm run build:ios
```

### Submit to App Store

```bash
eas submit -p ios
```

Or use Xcode:
1. Download IPA from EAS
2. Open Xcode
3. Window > Organizer
4. Upload to App Store Connect

## Backend Deployment

### Option 1: Railway

1. Create Railway account
2. New Project > Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Option 2: Heroku

```bash
heroku create greenbd-api
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix server heroku main
```

### Option 3: DigitalOcean

1. Create Droplet (Ubuntu 22.04)
2. Install Node.js, PostgreSQL
3. Clone repository
4. Setup PM2 for process management
5. Configure Nginx reverse proxy
6. Setup SSL with Let's Encrypt

### Environment Variables

Set these on your hosting platform:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
PORT=3000
NODE_ENV=production
```

### Database Migration

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

## Environment Configuration

### Production API URL

Update `.env` in mobile app:

```
API_BASE_URL=https://api.greenbd.app
```

Rebuild app after changing API URL.

### Over-The-Air Updates

For minor updates without rebuilding:

```bash
eas update --branch production --message "Bug fixes"
```

Users get updates automatically on next app launch.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console.log statements
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Version numbers incremented
- [ ] Release notes prepared
- [ ] Screenshots updated (if UI changed)
- [ ] Privacy policy updated
- [ ] Terms of service updated

## Post-Deployment Checklist

- [ ] Test production build on real device
- [ ] Verify API connectivity
- [ ] Check push notifications
- [ ] Test payment/redemption flow
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Verify deep links work

## Monitoring

### Error Tracking

Consider integrating:
- Sentry for crash reporting
- Firebase Crashlytics
- Bugsnag

### Analytics

- Firebase Analytics
- Mixpanel
- Amplitude

### Performance

- Firebase Performance Monitoring
- New Relic
- Datadog

## Rollback Procedure

### Mobile App

If critical bug found:

1. Revert to previous version in stores
2. Or push OTA update with fix:
   ```bash
   eas update --branch production --message "Hotfix"
   ```

### Backend

1. Revert Git commit
2. Redeploy previous version
3. Rollback database migration if needed:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

## Release Schedule

Recommended schedule:
- Major releases: Monthly
- Minor updates: Bi-weekly
- Hotfixes: As needed
- OTA updates: Weekly (for non-native changes)

## Version Numbering

Follow semantic versioning:
- Major: Breaking changes (2.0.0)
- Minor: New features (1.1.0)
- Patch: Bug fixes (1.0.1)

## Store Listing

### Google Play Store

Required assets:
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (min 2, max 8)
- Short description (80 chars)
- Full description (4000 chars)
- Privacy policy URL
- Content rating questionnaire

### Apple App Store

Required assets:
- App icon (1024x1024)
- Screenshots for each device size
- App preview video (optional)
- Description (4000 chars)
- Keywords (100 chars)
- Support URL
- Privacy policy URL

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: eas build --platform android --non-interactive
```

## Security

### Code Signing

- Android: Managed by EAS
- iOS: Managed by EAS or manual certificates

### API Keys

- Never commit API keys
- Use environment variables
- Rotate keys regularly
- Use different keys for dev/prod

### SSL/TLS

- Use HTTPS for all API calls
- Implement certificate pinning (optional)
- Keep certificates updated

## Support

### User Feedback

- In-app feedback form
- Email: support@greenbd.app
- Play Store reviews monitoring
- Social media monitoring

### Bug Reports

- Crash logs from Sentry
- User-reported issues
- Analytics anomalies
- Performance degradation

## Maintenance

### Regular Tasks

Weekly:
- Check error logs
- Review analytics
- Monitor server health
- Check user feedback

Monthly:
- Update dependencies
- Security audit
- Performance optimization
- Database cleanup

Quarterly:
- Major feature releases
- UI/UX improvements
- A/B testing results
- User surveys

## Costs Estimate

### Development
- Expo EAS: $29/month (Production plan)
- Google Play: $25 one-time
- Apple Developer: $99/year

### Hosting (for 10k users)
- Railway/Heroku: $25-50/month
- Database: Included or $10/month
- Storage (S3): $5-20/month
- CDN (CloudFlare): Free or $20/month

### Services
- OpenAI API: $20-100/month
- Push notifications: Free (Expo)
- Analytics: Free (Firebase)
- Error tracking: Free tier or $26/month

Total: ~$150-300/month

## Scaling Considerations

### 10k users
- Single server sufficient
- Basic database
- Minimal caching

### 100k users
- Load balancer
- Database replication
- Redis caching
- CDN for media

### 1M+ users
- Microservices architecture
- Database sharding
- Message queue (RabbitMQ)
- Kubernetes orchestration
