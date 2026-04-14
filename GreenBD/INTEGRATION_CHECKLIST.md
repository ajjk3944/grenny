# GreenBD Integration Checklist

## Authentication Flow

### User Login
- [ ] Phone number input validates correctly
- [ ] OTP is sent and received
- [ ] OTP verification works
- [ ] User is redirected to main tabs after login
- [ ] Token is stored securely
- [ ] User data is persisted

### Admin Login
- [ ] Username/password validation works
- [ ] Admin is redirected to admin panel
- [ ] Admin token is stored securely
- [ ] Admin role is verified

### Security Login
- [ ] User ID/password validation works
- [ ] Security user is redirected to security panel
- [ ] Security token is stored securely
- [ ] Security role is verified

### Social Login
- [ ] Google login flow works
- [ ] Facebook login flow works
- [ ] User profile is created/updated
- [ ] Tokens are stored securely

### Biometric Login
- [ ] Biometric availability is checked
- [ ] Fingerprint authentication works
- [ ] Face ID authentication works (iOS)
- [ ] Fallback to password works

### Logout
- [ ] User is logged out
- [ ] Tokens are cleared
- [ ] User is redirected to login screen
- [ ] Local data is cleared appropriately

## Dashboard

### Points Display
- [ ] Current points are displayed correctly
- [ ] Points history is shown
- [ ] Points chart renders with correct data
- [ ] Grade badge shows correct level
- [ ] Points update after submission approval

### Quick Stats
- [ ] Total submissions count is correct
- [ ] Pending submissions count is correct
- [ ] Approved submissions count is correct
- [ ] Rejected submissions count is correct

### Recent Activity
- [ ] Recent submissions are displayed
- [ ] Activity items show correct status
- [ ] Tapping activity navigates to detail

### Leaderboard Preview
- [ ] Top 3 users are displayed
- [ ] User's rank is shown
- [ ] "View All" navigates to full leaderboard

### Benefits Preview
- [ ] Available benefits are shown
- [ ] Points required are displayed
- [ ] "View All" navigates to benefits page

### Time Filters
- [ ] Week filter works
- [ ] Month filter works
- [ ] Year filter works
- [ ] Data updates when filter changes

## Capture Flow

### Camera Permission
- [ ] Permission request is shown
- [ ] Camera opens after permission granted
- [ ] Error message shown if permission denied
- [ ] Settings link works

### Photo Capture
- [ ] Camera preview works
- [ ] Photo is captured correctly
- [ ] Flash toggle works
- [ ] Camera flip works (front/back)
- [ ] Photo quality is acceptable

### Video Capture
- [ ] Video recording starts
- [ ] Recording timer is displayed
- [ ] Video stops at max duration
- [ ] Video quality is acceptable

### Location
- [ ] Location permission is requested
- [ ] Current location is captured
- [ ] Location is displayed on map
- [ ] Manual location selection works

### Form Validation
- [ ] Activity type is required
- [ ] Description is required
- [ ] Description length is validated
- [ ] Image/video is required
- [ ] Location is required

### Submission
- [ ] Form submits successfully
- [ ] Loading state is shown
- [ ] Success message is displayed
- [ ] User is redirected to success screen
- [ ] Points are awarded immediately

### Offline Mode
- [ ] Submission is saved locally when offline
- [ ] Pending indicator is shown
- [ ] Submission syncs when online
- [ ] User is notified of sync status

## History

### List View
- [ ] All submissions are displayed
- [ ] Submissions are sorted by date
- [ ] Status badges are correct
- [ ] Pull to refresh works
- [ ] Infinite scroll works

### Filters
- [ ] Status filter works (all/pending/approved/rejected)
- [ ] Date range filter works
- [ ] Activity type filter works

### Detail View
- [ ] Tapping submission opens detail
- [ ] All submission data is displayed
- [ ] Images/videos are shown
- [ ] Location is displayed on map
- [ ] Review comments are shown (if any)

## Admin Panel

### Dashboard
- [ ] Total users count is correct
- [ ] Total submissions count is correct
- [ ] Pending reviews count is correct
- [ ] Recent activity is displayed

### User Management
- [ ] All users are listed
- [ ] Search works
- [ ] User detail view works
- [ ] User can be blocked/unblocked
- [ ] User points can be adjusted

### Security User Management
- [ ] Security users are listed
- [ ] New security user can be created
- [ ] Security user can be edited
- [ ] Security user can be deleted
- [ ] Credentials are generated correctly

### Messages
- [ ] Messages from users are displayed
- [ ] Messages from security are displayed
- [ ] Messages can be marked as read
- [ ] Reply functionality works

### Notices
- [ ] New notice can be created
- [ ] Notice is sent to all users
- [ ] Notice history is displayed
- [ ] Notice can be edited/deleted

### Settings
- [ ] App settings can be updated
- [ ] Points configuration works
- [ ] Activity types can be managed
- [ ] Benefits can be managed

## Security Panel

### Review Queue
- [ ] Flagged submissions are displayed
- [ ] Submissions are sorted by priority
- [ ] Detail view shows all submission data
- [ ] Approve button works
- [ ] Reject button works
- [ ] Comment can be added

### Approved/Rejected Lists
- [ ] Approved submissions are listed
- [ ] Rejected submissions are listed
- [ ] History is maintained

### Messages
- [ ] Messages to admin can be sent
- [ ] Message history is displayed
- [ ] Replies are shown

### Profile
- [ ] Security user profile is displayed
- [ ] Password can be changed
- [ ] Profile can be updated

## Benefits

### List View
- [ ] All benefits are displayed
- [ ] Benefits are categorized
- [ ] Points required are shown
- [ ] User's points are displayed

### Redemption
- [ ] Redeem button is enabled/disabled based on points
- [ ] Confirmation dialog is shown
- [ ] Points are deducted correctly
- [ ] Redemption is recorded
- [ ] User is notified

### History
- [ ] Redemption history is displayed
- [ ] Redemption details are shown

## Leaderboard

### Rankings
- [ ] Top users are displayed
- [ ] User's rank is highlighted
- [ ] Points are shown correctly
- [ ] Profile pictures are displayed

### Filters
- [ ] Weekly leaderboard works
- [ ] Monthly leaderboard works
- [ ] All-time leaderboard works

## Challenges

### List View
- [ ] Active challenges are displayed
- [ ] Challenge details are shown
- [ ] Progress is displayed
- [ ] Completed challenges are marked

### Participation
- [ ] User can join challenge
- [ ] Progress is tracked
- [ ] Completion is detected
- [ ] Rewards are given

## Green Map

### Map Display
- [ ] Map loads correctly
- [ ] User location is shown
- [ ] Activity markers are displayed
- [ ] Marker clustering works

### Interactions
- [ ] Tapping marker shows details
- [ ] Filter by activity type works
- [ ] Search location works

## Notifications

### Push Notifications
- [ ] Permission is requested
- [ ] Token is registered
- [ ] Notifications are received
- [ ] Tapping notification navigates correctly

### In-App Notifications
- [ ] Notification list is displayed
- [ ] Unread count is shown
- [ ] Notifications can be marked as read
- [ ] Notifications can be deleted

## Profile

### View Profile
- [ ] User data is displayed correctly
- [ ] Profile picture is shown
- [ ] Stats are displayed
- [ ] Achievements are shown

### Edit Profile
- [ ] Name can be updated
- [ ] Profile picture can be changed
- [ ] Phone number can be updated
- [ ] Changes are saved

### Settings
- [ ] Language toggle works (Bangla/English)
- [ ] Theme toggle works (Light/Dark)
- [ ] Notifications can be enabled/disabled
- [ ] Biometric login can be enabled/disabled

## Offline Mode

### Data Persistence
- [ ] User data is cached
- [ ] Submissions are cached
- [ ] Images are cached
- [ ] App works without internet

### Sync
- [ ] Pending submissions sync when online
- [ ] Sync status is displayed
- [ ] Conflicts are handled
- [ ] User is notified of sync completion

## Performance

### App Startup
- [ ] Splash screen is displayed
- [ ] App loads in < 3 seconds
- [ ] Initial data is loaded

### Navigation
- [ ] Screen transitions are smooth
- [ ] No lag when navigating
- [ ] Back button works correctly

### Lists
- [ ] Long lists scroll smoothly
- [ ] Images load progressively
- [ ] No memory leaks

### Images
- [ ] Images are cached
- [ ] Placeholders are shown
- [ ] Images load quickly

## Theme

### Light Mode
- [ ] All screens render correctly
- [ ] Colors are appropriate
- [ ] Text is readable

### Dark Mode
- [ ] All screens render correctly
- [ ] Colors are appropriate
- [ ] Text is readable

### Toggle
- [ ] Theme toggle works
- [ ] Theme persists across sessions
- [ ] All screens update immediately

## Language

### Bangla
- [ ] All text is translated
- [ ] Numerals are in Bangla
- [ ] Date/time formats are correct
- [ ] RTL is not applied (Bangla is LTR)

### English
- [ ] All text is in English
- [ ] Numerals are in English
- [ ] Date/time formats are correct

### Toggle
- [ ] Language toggle works
- [ ] Language persists across sessions
- [ ] All screens update immediately

## Error Handling

### Network Errors
- [ ] Offline message is shown
- [ ] Retry button works
- [ ] Graceful degradation

### API Errors
- [ ] Error messages are user-friendly
- [ ] Retry mechanism works
- [ ] Fallback data is shown

### Validation Errors
- [ ] Form errors are displayed
- [ ] Error messages are clear
- [ ] Fields are highlighted

### Critical Errors
- [ ] Error boundary catches errors
- [ ] Error screen is shown
- [ ] User can retry or go home

## Security

### Token Storage
- [ ] Tokens are stored in SecureStore
- [ ] Tokens are not logged
- [ ] Tokens expire correctly

### API Security
- [ ] All requests include auth token
- [ ] Unauthorized requests redirect to login
- [ ] Sensitive data is encrypted

### Input Sanitization
- [ ] User inputs are sanitized
- [ ] XSS is prevented
- [ ] SQL injection is prevented

### Route Protection
- [ ] Admin routes require admin role
- [ ] Security routes require security role
- [ ] Unauthorized access is blocked

## Build & Deployment

### Development Build
- [ ] Dev build runs on Android
- [ ] Dev build runs on iOS
- [ ] Hot reload works
- [ ] Debugging works

### Preview Build
- [ ] Preview APK builds successfully
- [ ] APK installs on device
- [ ] All features work
- [ ] No crashes

### Production Build
- [ ] Production build is optimized
- [ ] Bundle size is acceptable
- [ ] App runs smoothly
- [ ] No debug code included

### App Store
- [ ] App icon is correct
- [ ] Splash screen is correct
- [ ] App name is correct
- [ ] Permissions are declared
- [ ] Privacy policy is included
