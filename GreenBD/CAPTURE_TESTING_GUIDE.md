# Capture & Submit Flow - Testing Guide

## Prerequisites
- Physical device (iOS or Android) - Camera functionality requires real hardware
- Location services enabled
- Internet connection (for initial testing)

## Test Scenarios

### 1. Camera Permissions
**Test Steps:**
1. Fresh install the app
2. Navigate to capture tab (center button)
3. Verify camera permission prompt appears
4. Deny permission
5. Verify error message with "Open Settings" option
6. Grant permission through settings
7. Return to app and verify camera opens

**Expected Result:**
- Clear permission request with Bangla text
- Graceful handling of denied permissions
- Settings link works correctly

### 2. Photo Capture
**Test Steps:**
1. Tap center capture button
2. Verify camera opens in full screen
3. Test flash toggle (auto/on/off)
4. Test camera flip (front/back)
5. Take a photo
6. Verify preview appears
7. Verify location is captured

**Expected Result:**
- Camera UI is responsive
- Flash modes work correctly
- Photo quality is good
- GPS coordinates are captured

### 3. Video Recording
**Test Steps:**
1. Open camera
2. Switch to video mode
3. Start recording
4. Verify recording indicator appears
5. Record for 10 seconds
6. Stop recording
7. Verify video preview

**Expected Result:**
- Video mode toggle works
- Recording indicator shows
- Video is saved correctly
- Max 60 seconds enforced

### 4. Gallery Selection
**Test Steps:**
1. Open camera
2. Tap gallery icon
3. Select an existing photo
4. Verify it loads in submission form

**Expected Result:**
- Gallery picker opens
- Selected image loads correctly
- EXIF data is preserved

### 5. Category Selection
**Test Steps:**
1. After capturing media, view submission form
2. Scroll through categories
3. Select "গাছ লাগানো" (Tree Planting)
4. Verify checkmark appears
5. Select different category
6. Verify only one can be selected

**Expected Result:**
- All 8 categories visible
- Horizontal scroll works smoothly
- Selection state updates correctly
- Haptic feedback on selection

### 6. Summary Input
**Test Steps:**
1. Type in summary field
2. Verify character counter updates
3. Type 500+ characters
4. Verify it stops at 500
5. Clear and type less than 10 characters
6. Try to submit
7. Verify validation error

**Expected Result:**
- Character counter accurate
- 500 character limit enforced
- Minimum 10 characters required
- Validation message clear

### 7. Voice Input
**Test Steps:**
1. Tap microphone button
2. Grant microphone permission if needed
3. Speak in Bangla
4. Verify text appears in summary field
5. Tap stop button
6. Edit the transcribed text

**Expected Result:**
- Microphone permission requested
- Recording indicator shows
- Bangla speech recognized
- Text is editable after transcription

### 8. Additional Photos
**Test Steps:**
1. After capturing initial photo
2. Tap "আরও ছবি যোগ করুন"
3. Select 4 more photos
4. Verify thumbnails appear
5. Try to add 6th photo
6. Verify limit message
7. Remove one photo
8. Verify it's removed

**Expected Result:**
- Can add up to 4 additional photos (5 total)
- Thumbnails display correctly
- Remove button works
- Limit enforced with message

### 9. Image Compression
**Test Steps:**
1. Select a large photo (>5MB)
2. Verify compression indicator appears
3. Wait for compression to complete
4. Check file size after compression

**Expected Result:**
- Compression indicator shows
- Image compressed to <2MB
- Quality remains acceptable
- EXIF data preserved

### 10. Submission Validation
**Test Steps:**
1. Try to submit without category
2. Verify error message
3. Select category
4. Try to submit with 5 character summary
5. Verify error message
6. Write 10+ character summary
7. Turn off location services
8. Try to submit
9. Verify location error

**Expected Result:**
- All validation rules enforced
- Clear error messages in Bangla
- Submit button disabled when invalid

### 11. Daily Submission Limit
**Test Steps:**
1. Submit 5 activities in one day
2. Try to submit 6th activity
3. Verify limit message
4. Check remaining count

**Expected Result:**
- 5 submissions allowed per day
- 6th submission blocked
- Clear message about daily limit
- Counter shows remaining submissions

### 12. Cooldown Timer
**Test Steps:**
1. Submit an activity
2. Immediately try to submit another
3. Verify cooldown message
4. Check countdown timer
5. Wait 30 minutes
6. Verify can submit again

**Expected Result:**
- 30 minute cooldown enforced
- Timer shows remaining time
- Clear message in Bangla
- Can submit after cooldown expires

### 13. Success Screen
**Test Steps:**
1. Complete valid submission
2. Verify success animation plays
3. Check AI verification message
4. Tap "ড্যাশবোর্ডে ফিরে যান"
5. Verify returns to dashboard
6. Submit another activity
7. Tap "আরেকটি জমা দিন"
8. Verify returns to camera

**Expected Result:**
- Smooth checkmark animation
- AI verification status shown
- Both buttons work correctly
- Draft is cleared after submission

### 14. Offline Submission
**Test Steps:**
1. Turn off internet
2. Capture and submit activity
3. Verify success message appears
4. Check submission is queued
5. Turn on internet
6. Verify automatic upload starts

**Expected Result:**
- Submission saved locally
- Success shown immediately
- Upload queued for retry
- Automatic upload when online

### 15. Background Upload
**Test Steps:**
1. Submit activity
2. Immediately navigate away
3. Check upload continues in background
4. Return to history
5. Verify upload status

**Expected Result:**
- Upload continues in background
- Status visible in history
- No blocking of UI

## Performance Tests

### Load Time
- Camera should open in <1 second
- Image compression should take <3 seconds
- Submission should save locally in <500ms

### Memory Usage
- App should not crash with multiple photos
- Video recording should not cause memory issues
- Image compression should not freeze UI

### Battery Impact
- Camera usage should be efficient
- Background uploads should not drain battery
- Location tracking should be minimal

## Edge Cases

### 1. Low Storage
- Test with device nearly full
- Verify graceful error handling

### 2. Poor GPS Signal
- Test indoors with weak GPS
- Verify timeout and error message

### 3. Camera Failure
- Test with camera in use by another app
- Verify error handling

### 4. Network Interruption
- Test upload with intermittent connection
- Verify retry logic works

### 5. App Backgrounding
- Start recording video
- Background the app
- Verify recording stops gracefully

## Accessibility Tests

### 1. Screen Reader
- Test with TalkBack (Android) or VoiceOver (iOS)
- Verify all buttons are labeled
- Verify form fields are accessible

### 2. Large Text
- Enable large text in device settings
- Verify UI adapts correctly
- Verify no text truncation

### 3. Color Contrast
- Verify all text is readable
- Check button states are clear
- Verify recording indicator is visible

## Localization Tests

### 1. Bangla Text
- Verify all UI text is in Bangla
- Check text wrapping is correct
- Verify no English fallbacks

### 2. Voice Input
- Test Bangla speech recognition
- Verify accuracy is acceptable
- Test with different accents

## Security Tests

### 1. Permissions
- Verify permissions are requested only when needed
- Check permission rationale is clear
- Verify app works with denied permissions

### 2. Data Privacy
- Verify GPS data is not exposed
- Check EXIF data handling
- Verify local storage is secure

## Regression Tests

After any code changes, verify:
- [ ] Camera still opens
- [ ] Photo capture works
- [ ] Video recording works
- [ ] Submission succeeds
- [ ] Validation rules work
- [ ] Success screen appears
- [ ] No TypeScript errors
- [ ] No console warnings

## Known Limitations

1. Video compression not implemented (returns original)
2. Group member search not implemented (UI only)
3. Video duration not displayed
4. Actual API upload not implemented (simulated)

## Reporting Issues

When reporting bugs, include:
- Device model and OS version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if possible
- Console logs if available
