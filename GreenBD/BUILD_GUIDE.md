# GreenBD Build & Release Guide

## Prerequisites

1. Node.js 18+ installed
2. npm or yarn installed
3. Expo CLI installed globally: `npm install -g expo-cli`
4. EAS CLI installed globally: `npm install -g eas-cli`
5. Expo account created at expo.dev
6. Android Studio (for Android builds)
7. Xcode (for iOS builds, macOS only)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 2. Configure Environment Variables

Create `.env` file in root:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

Create `server/.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/greenbd
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

### 3. Setup Database

```bash
cd server
npx prisma migrate dev
npx prisma generate
cd ..
```

### 4. Login to EAS

```bash
eas login
```

## Development Builds

### Run on Expo Go (Fastest)

```bash
npm start
```

Then scan QR code with Expo Go app.

Note: Some features (camera, biometric) may not work in Expo Go.

### Run on Android Emulator

```bash
npm run dev:android
```

### Run on iOS Simulator (macOS only)

```bash
npm run dev:ios
```

### Build Development APK

```bash
npm run build:dev-apk
```

This creates a development build with debugging enabled.

## Preview Builds

Preview builds are for internal testing and sharing with testers.

### Android Preview APK

```bash
npm run build:preview-apk
```

Build time: ~5-8 minutes

Download link will be provided after build completes.

### iOS Preview (TestFlight)

```bash
eas build -p ios --profile preview
```

Requires Apple Developer account.

## Production Builds

### Android Production Build

```bash
npm run build:prod
```

This creates an AAB (Android App Bundle) for Google Play Store.

Build time: ~10-15 minutes

### iOS Production Build

```bash
npm run build:ios
```

This creates an IPA for App Store.

Requires Apple Developer account.

## Local Builds (Faster)

For faster iteration, you can build locally:

### Android Local Build

```bash
npx expo run:android --variant release
```

This builds a release APK locally in ~2-3 minutes.

### iOS Local Build (macOS only)

```bash
npx expo run:ios --configuration Release
```

## Build Profiles

Build profiles are defined in `eas.json`:

### Development Profile
- Development client enabled
- Internal distribution
- APK format (Android)
- Simulator build (iOS)

### Preview Profile
- Internal distribution
- APK format (Android)
- Release configuration
- For testing before production

### Production Profile
- App Bundle format (Android)
- Production configuration
- For store submission

## Versioning

Update version in `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

Version format: MAJOR.MINOR.PATCH

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

Increment `versionCode` (Android) and `buildNumber` (iOS) for each build.

## Submission to Stores

### Google Play Store

1. Build production AAB:
   ```bash
   npm run build:prod
   ```

2. Download AAB from EAS dashboard

3. Create app in Google Play Console

4. Upload AAB

5. Fill in store listing details

6. Submit for review

### Apple App Store

1. Build production IPA:
   ```bash
   npm run build:ios
   ```

2. Download IPA from EAS dashboard

3. Upload to App Store Connect using Transporter

4. Fill in app information

5. Submit for review

## Automated Submission

EAS can submit directly to stores:

### Submit to Google Play

```bash
eas submit -p android --latest
```

### Submit to App Store

```bash
eas submit -p ios --latest
```

Requires store credentials configured in EAS.

## Over-The-Air (OTA) Updates

For minor updates without rebuilding:

```bash
eas update --branch production --message "Bug fixes"
```

Users will receive update on next app launch.

Note: OTA updates cannot change native code or dependencies.

## Build Optimization

### Reduce Bundle Size

1. Remove unused dependencies
2. Enable Hermes engine (Android)
3. Enable ProGuard/R8 (Android)
4. Use production mode

### Improve Performance

1. Enable RAM bundles
2. Optimize images
3. Use native driver for animations
4. Lazy load screens

## Troubleshooting

### Build Fails

1. Check EAS build logs
2. Verify all dependencies are compatible
3. Check for TypeScript errors
4. Ensure environment variables are set

### App Crashes on Launch

1. Check native logs (adb logcat or Xcode console)
2. Verify all native modules are linked
3. Check for missing permissions
4. Test on different devices

### Features Not Working

1. Verify permissions are declared
2. Check API endpoints are accessible
3. Test on physical device (not emulator)
4. Check for network issues

## Testing Checklist

Before releasing:

- [ ] Test on multiple Android devices
- [ ] Test on multiple iOS devices
- [ ] Test all user flows
- [ ] Test offline mode
- [ ] Test push notifications
- [ ] Test camera and location
- [ ] Test biometric authentication
- [ ] Test in different languages
- [ ] Test in light and dark mode
- [ ] Check for memory leaks
- [ ] Check for crashes
- [ ] Verify analytics are working
- [ ] Test payment/redemption flows

## Release Checklist

- [ ] Update version number
- [ ] Update changelog
- [ ] Test thoroughly
- [ ] Build production version
- [ ] Test production build
- [ ] Prepare store assets (screenshots, descriptions)
- [ ] Submit to stores
- [ ] Monitor crash reports
- [ ] Monitor user feedback
- [ ] Prepare hotfix if needed

## Continuous Integration

For automated builds, integrate with CI/CD:

### GitHub Actions Example

```yaml
name: Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: eas build --platform android --non-interactive
```

## Monitoring

After release:

1. Monitor crash reports (Sentry, Firebase Crashlytics)
2. Monitor analytics (Firebase Analytics)
3. Monitor user reviews
4. Monitor API errors
5. Monitor performance metrics

## Rollback

If critical issue found:

1. Remove app from stores (temporary)
2. Fix issue
3. Build new version
4. Test thoroughly
5. Resubmit

Or use OTA update for quick fix:

```bash
eas update --branch production --message "Critical fix"
```

## Support

- Expo Documentation: https://docs.expo.dev
- EAS Documentation: https://docs.expo.dev/eas
- React Native Documentation: https://reactnative.dev
- GitHub Issues: Create issue in repository
