# GreenBD Authentication System

## Overview
The authentication system supports 3 user roles with different login flows.

## User Roles

### 1. Main Admin
- **Access**: Tap app version "v1.0.0" 5 times on login screen
- **Credentials**: Hardcoded in backend
- **Test Credentials**: 
  - Username: `admin`
  - Password: `admin123`
- **Route**: `/(auth)/admin-login`
- **Redirects to**: `/(admin)` group

### 2. Security User
- **Access**: Long-press GreenBD logo for 3 seconds on login screen
- **Credentials**: Created by admin
- **Test Credentials**:
  - User ID: `sec001`
  - Password: `pass123`
- **Route**: `/(auth)/security-login`
- **Redirects to**: `/(security)` group

### 3. General User
- **Access**: Default login screen
- **Sign-up Methods**:
  - Google (mock)
  - Facebook (mock)
  - Phone + OTP (any 6-digit OTP works in mock)
- **Route**: `/(auth)/login` → `/(auth)/otp`
- **Redirects to**: `/(tabs)` group

## Onboarding
- Shows on first app launch
- 3 slides with skip option
- Stored in AsyncStorage: `onboarding_completed`

## Navigation Guards
The root layout (`app/_layout.tsx`) handles automatic routing:
- Not authenticated → Onboarding (first time) → Login
- Authenticated as admin → Admin dashboard
- Authenticated as security → Security dashboard
- Authenticated as user → Main tabs

## Mock Backend
All authentication services in `services/auth.ts` use mock implementations with 500ms delay to simulate network requests.

## Storage
- User data: `auth_user` key in AsyncStorage
- Token: `auth_token` key in AsyncStorage
- Auto-login on app restart if token exists

## Testing
1. General user: Enter any phone number, any 6-digit OTP
2. Admin: Tap version 5 times, use admin/admin123
3. Security: Long-press logo 3s, use sec001/pass123
