# GreenBD Testing Guide

## Pre-Testing Checklist

Before testing, ensure:
- [ ] Backend server is running
- [ ] Database is seeded with test data
- [ ] Environment variables are configured
- [ ] Device/emulator has internet connection
- [ ] Location services are enabled
- [ ] Camera permissions are granted

## Integration Testing Checklist

### 1. Authentication Flow

#### User Login (Phone/OTP)
- [ ] Open app for first time
- [ ] Complete onboarding screens
- [ ] Enter phone number
- [ ] Receive OTP (check console in dev mode)
- [ ] Enter correct OTP
- [ ] Redirected to user dashboard (tabs)
- [ ] User data loads correctly

#### Admin Login
- [ ] Navigate to admin login (hidden route)
- [ ] Enter admin credentials
- [ ] Redirected to admin panel
- [ ] Admin features accessible

#### Security Login
- [ ] Navigate to security login
- [ ] Enter security credentials
- [ ] Redirected to security panel
- [ ] Security features accessible

#### Logout
- [ ] Logout from any role
- [ ] Redirected to login screen
- [ ] Cannot access protected routes
- [ ] Login again works correctly

### 2. Dashboard (User)

#### Points Display
- [ ] Total points shown correctly
- [ ] Today's points accurate
- [ ] Weekly/monthly points calculated
- [ ] Grade badge displays (A+, A, B+, etc.)
- [ ] Grade progress bar animates

#### Charts
- [ ] Points chart renders
- [ ] Shows last 30 days data
- [ ] Touch interaction works
- [ ] Data updates after new submission

#### Quick Stats
- [ ] Trees planted count
- [ ] Cleanups count
- [ ] Total activities count
- [ ] All stats accurate

#### Leaderboard Preview
- [ ] Shows top 3 users
- [ ] District rank displayed
- [ ] National rank displayed
- [ ] Tap navigates to full leaderboard

#### Recent Activity
- [ ] Shows last 5 activities
- [ ] Correct status badges
- [ ] Tap opens detail view
- [ ] Empty state when no activities

### 3. Capture Flow

#### Camera Access
- [ ] Camera permission requested
- [ ] Camera preview loads
- [ ] Switch front/back camera works
- [ ] Flash toggle works
- [ ] Photo capture works
- [ ] Video recording works
- [ ] Multiple photos can be taken

#### Form Validation
- [ ] Category selection required
- [ ] Summary minimum 10 characters
- [ ] Location automatically captured
- [ ] Group members optional
- [ ] Voice input works (Bangla)
- [ ] Form shows validation errors

#### Submission
- [ ] Submit button disabled when invalid
- [ ] Loading state during submission
- [ ] Success message shown
- [ ] Redirected to success screen
- [ ] Activity appears in history

#### Offline Mode
- [ ] Capture works without internet
- [ ] Submission saved locally
- [ ] Shows "pending upload" status
- [ ] Auto-syncs when online
- [ ] Retry failed uploads works

#### Rate Limiting
- [ ] Cannot submit within 30 min cooldown
- [ ] Shows remaining cooldown time
- [ ] Max 5 submissions per day enforced
- [ ] Counter resets at midnight

### 4. History Screen

#### List Display
- [ ] All submissions shown
- [ ] Sorted by date (newest first)
- [ ] Status badges correct (pending/approved/rejected)
- [ ] Points shown for approved items
- [ ] Pagination works (load more)

#### Filters
- [ ] Filter by status works
- [ ] Filter by category works
- [ ] Filter by date range works
- [ ] Clear filters works

#### Detail View
- [ ] Tap opens detail screen
- [ ] All images/videos shown
- [ ] Location map displayed
- [ ] Review comments shown (if any)
- [ ] Share button works

### 5. Benefits Screen

#### Benefits List
- [ ] All benefits displayed
- [ ] Points required shown
- [ ] User's points shown at top
- [ ] Benefits sorted by points
- [ ] Images load correctly

#### Redemption
- [ ] Cannot redeem if insufficient points
- [ ] Confirmation dialog shown
- [ ] Points deducted after redemption
- [ ] Redemption code generated
- [ ] Redemption saved in history

### 6. Leaderboard

#### Rankings
- [ ] National leaderboard loads
- [ ] District leaderboard loads
- [ ] Current user highlighted
- [ ] Rank, name, points shown
- [ ] Profile pictures load
- [ ] Pagination works

#### Filters
- [ ] Switch between national/district
- [ ] Time period filter (week/month/all)
- [ ] Search by name works

### 7. Admin Panel

#### Dashboard
- [ ] Total users count
- [ ] Pending reviews count
- [ ] Total points distributed
- [ ] Charts render correctly

#### User Management
- [ ] User list loads
- [ ] Search users works
- [ ] View user details
- [ ] Ban/unban user works
- [ ] Adjust user points works

#### Security User Management
- [ ] Create security user
- [ ] Assign district
- [ ] Set credentials
- [ ] Edit security user
- [ ] Deactivate security user

#### Messages
- [ ] Inbox shows messages
- [ ] Read/unread status
- [ ] Reply to messages
- [ ] Mark as read works

#### Notices
- [ ] Create notice
- [ ] Target audience selection
- [ ] Schedule notice
- [ ] Edit/delete notice
- [ ] Notice appears for users

#### Settings
- [ ] Update app settings
- [ ] Configure point values
- [ ] Set submission limits
- [ ] Changes persist

### 8. Security Panel

#### Review Queue
- [ ] Flagged submissions shown
- [ ] Filter by category
- [ ] View submission details
- [ ] Approve submission works
- [ ] Reject with reason works
- [ ] Points awarded on approval

#### Messages
- [ ] Send message to admin
- [ ] View message history
- [ ] Receive admin replies

#### Profile
- [ ] View assigned district
- [ ] View review statistics
- [ ] Change password

### 9. Notifications

#### Push Notifications
- [ ] Permission requested on first launch
- [ ] Token registered with backend
- [ ] Receive test notification
- [ ] Tap opens relevant screen
- [ ] Badge count updates

#### In-App Notifications
- [ ] Notification bell shows count
- [ ] List shows all notifications
- [ ] Mark as read works
- [ ] Clear all works
- [ ] Tap navigates correctly

### 10. Offline Mode

#### Offline Detection
- [ ] Banner shown when offline
- [ ] Features work offline (capture)
- [ ] Banner hidden when online

#### Sync Queue
- [ ] Pending uploads shown
- [ ] Auto-sync on reconnect
- [ ] Manual retry works
- [ ] Failed uploads marked
- [ ] Success notification shown

### 11. Theme & Language

#### Dark Mode
- [ ] Toggle in settings works
- [ ] All screens adapt correctly
- [ ] Colors consistent
- [ ] Preference persists

#### Language Switch
- [ ] Toggle Bangla/English works
- [ ] All text translates
- [ ] Numerals switch (Bangla digits)
- [ ] Preference persists
- [ ] RTL not needed (Bangla is LTR)

## Performance Testing

### Startup Time
- [ ] Cold start < 3 seconds
- [ ] Splash screen shows immediately
- [ ] Auth check completes quickly

### List Performance
- [ ] History list scrolls smoothly
- [ ] Leaderboard scrolls smoothly
- [ ] No lag with 100+ items
- [ ] Images load progressively

### Memory Usage
- [ ] No memory leaks
- [ ] Camera resources released
- [ ] Images cached efficiently
- [ ] App doesn't crash on low memory

### Network Performance
- [ ] API calls have timeout
- [ ] Retry logic works
- [ ] Loading states shown
- [ ] Error states handled

## Error Handling Testing

### Network Errors
- [ ] Airplane mode handled gracefully
- [ ] Timeout errors shown
- [ ] Retry button works
- [ ] Offline banner appears

### API Errors
- [ ] 400 errors show validation messages
- [ ] 401 redirects to login
- [ ] 403 shows permission error
- [ ] 500 shows generic error
- [ ] Error boundary catches crashes

### Validation Errors
- [ ] Form validation messages clear
- [ ] Required fields highlighted
- [ ] Format errors explained
- [ ] Submission blocked when invalid

## Security Testing

### Authentication
- [ ] JWT tokens stored securely
- [ ] Tokens expire correctly
- [ ] Refresh token works
- [ ] Logout clears all data

### Authorization
- [ ] Users cannot access admin routes
- [ ] Security cannot access admin features
- [ ] API calls include auth headers
- [ ] Unauthorized calls rejected

### Input Sanitization
- [ ] XSS attempts blocked
- [ ] SQL injection prevented (backend)
- [ ] File upload validation works
- [ ] Max file size enforced

## Build Testing

### Development Build
```bash
npm run dev:android
```
- [ ] Builds successfully
- [ ] Runs on device/emulator
- [ ] Hot reload works
- [ ] Console logs visible

### Preview Build
```bash
npm run build:preview-apk
```
- [ ] Build completes (~5-8 min)
- [ ] APK downloads
- [ ] Installs on device
- [ ] All features work
- [ ] No dev tools visible

### Production Build
```bash
npm run build:prod
```
- [ ] Build completes
- [ ] AAB file generated
- [ ] ProGuard/R8 applied
- [ ] Bundle size optimized
- [ ] Ready for Play Store

## Device Testing Matrix

Test on multiple devices:
- [ ] Android 10 (API 29)
- [ ] Android 11 (API 30)
- [ ] Android 12 (API 31)
- [ ] Android 13 (API 33)
- [ ] Android 14 (API 34)
- [ ] Small screen (5")
- [ ] Medium screen (6")
- [ ] Large screen (6.5"+)
- [ ] Tablet (optional)

## Known Issues

Document any issues found during testing:

1. Issue: [Description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Severity: Critical/High/Medium/Low

## Test Data

### Test Users
- User: +8801712345678 (OTP: 123456)
- Admin: admin / admin123
- Security: SEC001 / security123

### Test Categories
- Tree Planting
- Waste Collection
- River Cleanup
- Awareness Campaign
- Recycling

## Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Component tests with React Native Testing Library
- E2E tests with Detox
- API tests with Supertest
