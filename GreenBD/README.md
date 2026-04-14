# GreenBD

A mobile application for tracking and rewarding eco-friendly activities in Bangladesh.

## Features

- Capture eco-friendly activities with photo/video evidence
- Earn points and climb leaderboards
- Redeem benefits with earned points
- AI-powered activity verification
- Multi-role support (User, Security, Admin)
- Offline-first architecture with background sync
- Bilingual support (Bangla/English)
- Dark mode support

## Tech Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- Expo Router for navigation
- Node.js backend with Prisma ORM
- PostgreSQL database

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
API_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

### 3. Start Development Server

```bash
npm start
```

This opens Expo Dev Tools. Scan the QR code with Expo Go app to run on your device.

### 4. Run on Emulator/Simulator

Android:
```bash
npm run dev:android
```

iOS (macOS only):
```bash
npm run dev:ios
```

## Backend Setup

### 1. Navigate to Server Directory

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `server/.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/greenbd
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

### 4. Setup Database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start Server

```bash
npm run dev
```

Server runs on http://localhost:3000

## Building for Production

### Android APK (Preview)

```bash
npm run build:preview-apk
```

### Android App Bundle (Production)

```bash
npm run build:prod
```

### iOS (Production)

```bash
npm run build:ios
```

Builds are handled by Expo Application Services (EAS). First time setup:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## Project Structure

```
GreenBD/
├── src/
│   ├── app/              # Expo Router screens
│   │   ├── (auth)/       # Authentication screens
│   │   ├── (tabs)/       # Main user tabs
│   │   ├── (admin)/      # Admin panel
│   │   └── (security)/   # Security panel
│   ├── components/       # Reusable components
│   ├── store/            # Zustand stores
│   ├── services/         # API services
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── i18n/             # Internationalization
│   └── constants/        # App constants
├── server/               # Backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Server utilities
│   └── prisma/           # Database schema
└── assets/               # Images, fonts, etc.
```

## Testing

The app includes offline mode testing. To test:

1. Enable airplane mode on device
2. Capture activities (saved locally)
3. Disable airplane mode
4. Activities sync automatically

## Environment Variables

### App (.env)
- `API_BASE_URL` - Backend API URL
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `FACEBOOK_APP_ID` - Facebook app ID

### Server (server/.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for AI review
- `PORT` - Server port (default: 3000)

## User Roles

1. **User** - Regular users who capture activities
2. **Security** - Review flagged submissions
3. **Admin** - Full system management

## License

Proprietary
