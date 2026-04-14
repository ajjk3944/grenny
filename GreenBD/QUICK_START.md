# GreenBD - Quick Start Guide

## ✅ Installation Complete!

Your GreenBD project is ready to run. All dependencies are installed.

## 🚀 Start Development

### ⚠️ Important: Development Build Required

This app uses packages that require custom native code (like `react-native-reanimated`, voice recognition). You have two options:

### Option 1: Build Development APK (Recommended)

```bash
# Install EAS CLI (first time only)
npm install -g eas-cli
eas login

# Build development APK
cd GreenBD
npm run build:dev-apk
```

Wait 10-20 minutes for the build to complete, then:
1. Download and install the APK on your Android device
2. Run: `npx expo start --dev-client`

### Option 2: Test on Web (Quick Testing)

```bash
cd GreenBD
npx expo start --web
```

Note: Camera, location, and voice features won't work on web.

### Option 3: Start Expo Dev Server (May have errors)
```bash
cd GreenBD
npm start
```

This opens Expo Dev Tools, but you may see native module errors with Expo Go.

## 📱 Testing on Physical Device

1. Install Expo Go app from Play Store (Android) or App Store (iOS)
2. Run `npm start` in the GreenBD directory
3. Scan the QR code with Expo Go app

## 🔧 Backend Setup (Optional for now)

The app works with mock data, but to connect to a real backend:

```bash
cd GreenBD/server
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma migrate dev
npm run dev
```

## 📝 Environment Variables

Create a `.env` file in the GreenBD directory:

```env
API_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

## 🎯 What's Working

✅ All dependencies installed
✅ Expo SDK 55 configured
✅ TypeScript configured
✅ ESLint and Prettier configured
✅ All components created
✅ All utilities created
✅ Complete documentation

## 📚 Next Steps

1. **Start the app**: `npm start`
2. **Read the docs**: Check DEVELOPER_GUIDE.md for quick reference
3. **Test features**: Follow INTEGRATION_CHECKLIST.md
4. **Build APK**: `npm run build:preview-apk` (requires EAS CLI)

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npx expo start -c
```

### Clear cache completely
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Port already in use
```bash
npx expo start --port 8082
```

## 📖 Documentation

- **DEVELOPER_GUIDE.md** - Quick reference for developers
- **DOCUMENTATION_INDEX.md** - Complete documentation index
- **PERFORMANCE.md** - Performance optimization guide
- **SECURITY.md** - Security best practices
- **BUILD_GUIDE.md** - Building for production
- **DEPLOYMENT_GUIDE.md** - Deploying to production

## 🎉 You're Ready!

Your GreenBD project is fully set up and ready for development. Start the dev server and begin coding!

```bash
cd GreenBD
npm start
```

Happy coding! 🚀
