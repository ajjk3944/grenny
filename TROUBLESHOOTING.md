# GreenBD Troubleshooting Guide

## Installation Issues

### npm install fails

Problem: Dependencies fail to install

Solutions:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules and package-lock.json
3. Run `npm install` again
4. Try using yarn: `yarn install`
5. Check Node.js version (requires 18+)

### Expo CLI not found

Problem: `expo: command not found`

Solution:
```bash
npm install -g expo-cli
```

### EAS CLI not found

Problem: `eas: command not found`

Solution:
```bash
npm install -g eas-cli
```

## Development Server Issues

### Metro bundler fails to start

Problem: Port 8081 already in use

Solutions:
1. Kill process on port 8081:
   ```bash
   # Windows
   netstat -ano | findstr :8081
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:8081 | xargs kill -9
   ```
2. Start on different port:
   ```bash
   npx expo start --port 8082
   ```

### QR code not scanning

Problem: Expo Go app can't scan QR code

Solutions:
1. Ensure phone and computer are on same network
2. Try tunnel mode: `npx expo start --tunnel`
3. Manually enter URL in Expo Go
4. Check firewall settings

### Hot reload not working

Problem: Changes don't reflect in app

Solutions:
1. Shake device and press "Reload"
2. Restart Metro bundler
3. Clear cache: `npx expo start -c`
4. Check if file is saved

## Build Issues

### EAS build fails

Problem: Build fails on EAS servers

Solutions:
1. Check build logs in EAS dashboard
2. Verify all dependencies are compatible
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Ensure environment variables are set
5. Try building locally first

### Android build fails

Problem: Gradle build fails

Solutions:
1. Check Java version (requires JDK 11)
2. Clear Gradle cache:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```
3. Check for duplicate dependencies
4. Verify Android SDK is installed

### iOS build fails

Problem: Xcode build fails

Solutions:
1. Check Xcode version (requires 14+)
2. Clean build folder in Xcode
3. Update CocoaPods: `cd ios && pod install && cd ..`
4. Check provisioning profiles
5. Verify bundle identifier is unique

### Build takes too long

Problem: EAS build takes over 30 minutes

Solutions:
1. Use local builds for faster iteration
2. Check for large dependencies
3. Optimize images and assets
4. Use caching in eas.json

## Runtime Issues

### App crashes on launch

Problem: App crashes immediately after opening

Solutions:
1. Check native logs:
   ```bash
   # Android
   adb logcat
   
   # iOS
   # Open Xcode > Window > Devices and Simulators > View Device Logs
   ```
2. Verify all native modules are linked
3. Check for missing permissions
4. Test on different device
5. Rebuild app

### White screen on launch

Problem: App shows white screen

Solutions:
1. Check for JavaScript errors in console
2. Verify splash screen is configured
3. Check if fonts are loaded
4. Add error boundary
5. Check network connectivity

### Camera not working

Problem: Camera doesn't open

Solutions:
1. Check camera permissions in app settings
2. Verify permissions in app.json
3. Test on physical device (not emulator)
4. Check if camera is available:
   ```typescript
   const { status } = await Camera.requestCameraPermissionsAsync();
   ```
5. Restart app

### Location not working

Problem: Location not detected

Solutions:
1. Check location permissions
2. Enable location services on device
3. Test outdoors (GPS works better)
4. Check if location is available:
   ```typescript
   const { status } = await Location.requestForegroundPermissionsAsync();
   ```
5. Use mock location for testing

### Push notifications not working

Problem: Notifications not received

Solutions:
1. Check notification permissions
2. Verify push token is registered
3. Test on physical device
4. Check Expo push notification tool
5. Verify backend is sending notifications

### Images not loading

Problem: Images show placeholder

Solutions:
1. Check network connectivity
2. Verify image URLs are correct
3. Check CORS settings on server
4. Clear image cache
5. Check image format is supported

## API Issues

### API requests fail

Problem: All API requests return errors

Solutions:
1. Check API URL in .env file
2. Verify backend server is running
3. Check network connectivity
4. Test API with Postman
5. Check CORS settings

### Authentication fails

Problem: Login doesn't work

Solutions:
1. Check credentials are correct
2. Verify JWT token is valid
3. Check token expiration
4. Clear secure storage
5. Check backend logs

### 401 Unauthorized errors

Problem: API returns 401 errors

Solutions:
1. Check if token is included in request
2. Verify token is not expired
3. Check token format (Bearer token)
4. Re-login to get new token
5. Check backend authentication middleware

### 500 Server errors

Problem: API returns 500 errors

Solutions:
1. Check backend logs
2. Verify database is running
3. Check environment variables
4. Test API endpoint directly
5. Check for missing dependencies

## Database Issues

### Prisma migration fails

Problem: Database migration fails

Solutions:
1. Check database connection string
2. Verify database is running
3. Check for syntax errors in schema
4. Reset database: `npx prisma migrate reset`
5. Generate Prisma client: `npx prisma generate`

### Database connection fails

Problem: Can't connect to database

Solutions:
1. Check DATABASE_URL in .env
2. Verify PostgreSQL is running
3. Check database credentials
4. Test connection with psql
5. Check firewall settings

## Performance Issues

### App is slow

Problem: App feels laggy

Solutions:
1. Enable Hermes engine
2. Optimize images (compress, resize)
3. Use FlatList for long lists
4. Implement pagination
5. Profile with React DevTools

### High memory usage

Problem: App uses too much memory

Solutions:
1. Check for memory leaks
2. Dispose camera resources
3. Clear image cache periodically
4. Limit cached data
5. Use React.memo for expensive components

### Slow navigation

Problem: Screen transitions are slow

Solutions:
1. Use react-native-reanimated
2. Lazy load screens
3. Optimize component renders
4. Remove console.log statements
5. Enable native driver for animations

## Offline Mode Issues

### Sync not working

Problem: Offline submissions don't sync

Solutions:
1. Check network connectivity
2. Verify sync service is running
3. Check pending uploads in store
4. Clear sync queue and retry
5. Check backend sync endpoint

### Data not persisting

Problem: Data is lost after app restart

Solutions:
1. Check AsyncStorage is working
2. Verify data is being saved
3. Check storage permissions
4. Clear app data and test
5. Use SecureStore for sensitive data

## Theme Issues

### Dark mode not working

Problem: Dark mode doesn't apply

Solutions:
1. Check theme store
2. Verify theme toggle works
3. Check if theme is persisted
4. Restart app
5. Check component styles

### Colors are wrong

Problem: Colors don't match design

Solutions:
1. Check theme configuration
2. Verify color values in styles
3. Check if theme is applied to all components
4. Test in both light and dark mode
5. Check for hardcoded colors

## Language Issues

### Translation not working

Problem: Text doesn't change language

Solutions:
1. Check i18n configuration
2. Verify translation files exist
3. Check if language is persisted
4. Restart app
5. Check for missing translation keys

### Bangla text not displaying

Problem: Bangla characters show as boxes

Solutions:
1. Check if Bangla font is loaded
2. Verify font file exists
3. Check font configuration in app.json
4. Test on different device
5. Use system font as fallback

## Testing Issues

### Tests fail

Problem: Unit tests fail

Solutions:
1. Check test configuration
2. Verify mocks are correct
3. Update snapshots if needed
4. Check for async issues
5. Run tests in isolation

### E2E tests fail

Problem: End-to-end tests fail

Solutions:
1. Check if app is built
2. Verify emulator/simulator is running
3. Check for timing issues
4. Increase timeouts
5. Check test selectors

## Deployment Issues

### App rejected by store

Problem: App Store/Play Store rejects app

Solutions:
1. Read rejection reason carefully
2. Fix issues mentioned
3. Update app metadata
4. Resubmit with explanation
5. Contact store support if needed

### OTA update not working

Problem: Users don't receive updates

Solutions:
1. Check update configuration
2. Verify update is published
3. Check update channel
4. Force update check in app
5. Check Expo dashboard

## Common Error Messages

### "Network request failed"

Cause: No internet connection or API is down

Solution:
1. Check internet connection
2. Verify API URL
3. Check if backend is running
4. Test with different network

### "Permission denied"

Cause: Required permission not granted

Solution:
1. Request permission properly
2. Check permission status
3. Guide user to settings
4. Handle permission denial gracefully

### "Module not found"

Cause: Dependency not installed or imported incorrectly

Solution:
1. Install missing dependency
2. Check import path
3. Clear cache and rebuild
4. Check for typos

### "Invariant Violation"

Cause: React Native internal error

Solution:
1. Check component structure
2. Verify props are correct
3. Clear cache and restart
4. Update React Native version

## Getting Help

If you're still stuck:

1. Check GitHub Issues
2. Search Stack Overflow
3. Ask in Expo Discord
4. Check Expo Forums
5. Create detailed bug report

When asking for help, include:
- Error message (full stack trace)
- Steps to reproduce
- Device/OS version
- App version
- Relevant code snippets
- What you've tried

## Useful Commands

```bash
# Clear all caches
npx expo start -c
rm -rf node_modules
npm install

# Reset Metro bundler
npx react-native start --reset-cache

# Check for issues
npx expo-doctor

# View logs
npx expo start --dev-client
adb logcat (Android)

# Rebuild app
npx expo run:android --variant release
npx expo run:ios --configuration Release

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint

# Format code
npm run format
```

## Prevention Tips

1. Always test on physical devices
2. Test in both online and offline modes
3. Test in different languages
4. Test in light and dark modes
5. Monitor crash reports
6. Keep dependencies updated
7. Write tests for critical flows
8. Use TypeScript for type safety
9. Follow React Native best practices
10. Document known issues
