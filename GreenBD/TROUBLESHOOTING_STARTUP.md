# Troubleshooting Startup Issues

## Error: `codegenNativeComponent is not a function`

This error occurs because some packages in the project require custom native code that isn't available in Expo Go.

### Solution Options

## Option 1: Use Development Build (Recommended)

A development build includes all the native code your app needs.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Step 2: Configure EAS
```bash
eas build:configure
```

### Step 3: Build Development Client
```bash
# For Android
eas build --profile development --platform android

# For iOS (Mac only)
eas build --profile development --platform ios
```

### Step 4: Install the Development Build
- Download and install the APK/IPA when build completes
- Run `npx expo start --dev-client`

## Option 2: Remove Problematic Packages (Quick Fix)

If you just want to test quickly, temporarily remove packages that require native code:

### Packages that require development build:
- `react-native-reanimated`
- `@react-native-voice/voice`
- `expo-speech-recognition`
- `react-native-worklets`

### Quick fix:
```bash
# Comment out these imports in your code temporarily
# Then run:
npx expo start -c
```

## Option 3: Use Web Version

The web version doesn't have native module issues:

```bash
npx expo start --web
```

Note: Camera and location features won't work on web.

## Recommended Approach

For full functionality, use **Option 1** (Development Build). This is what you'll need for production anyway.

### Quick Development Build Commands

```bash
# First time setup
npm install -g eas-cli
eas login
eas build:configure

# Build for Android (takes 10-20 minutes)
npm run build:dev-apk

# After installing the APK on your device
npx expo start --dev-client
```

## Why This Happens

Expo Go is a generic app that includes common Expo modules. However, some packages require custom native code:

- **react-native-reanimated**: Advanced animations
- **@react-native-voice/voice**: Speech recognition
- **expo-speech-recognition**: Voice input
- **react-native-worklets**: Background processing

These packages need to be compiled into your app, which requires a development build.

## What to Do Now

### For Quick Testing (Web)
```bash
npx expo start --web
```

### For Full App Testing (Recommended)
```bash
# Build development APK
npm run build:dev-apk

# Wait for build to complete (10-20 min)
# Download and install APK
# Then run:
npx expo start --dev-client
```

## Alternative: Simplify for Expo Go

If you want to use Expo Go, you can temporarily remove advanced features:

1. Remove voice input features
2. Use simpler animations
3. Remove speech recognition

But for production, you'll need a development/production build anyway.

## Next Steps

I recommend building a development APK:

```bash
# Install EAS CLI (one time)
npm install -g eas-cli

# Login to Expo
eas login

# Build development APK
npm run build:dev-apk
```

This will create an APK with all native modules included. Install it on your device and use `npx expo start --dev-client` to develop.
