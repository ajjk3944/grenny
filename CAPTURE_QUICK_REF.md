# Capture Flow - Quick Reference

## User Flow
```
Tap Capture Button
    ↓
Camera Opens (Full Screen)
    ↓
Take Photo/Video OR Select from Gallery
    ↓
Preview & Retake Option
    ↓
Select Category (8 options)
    ↓
Write Summary (10-500 chars)
    ↓
Optional: Add More Photos (max 5 total)
    ↓
Optional: Add Group Members
    ↓
Submit
    ↓
Success Animation
    ↓
Return to Dashboard OR Submit Another
```

## Key Components

### Camera Screen
- **File**: `src/app/(tabs)/capture.tsx`
- **Features**: Photo/video toggle, flash, flip camera, gallery
- **Permissions**: Camera, Location

### Submit Form
- **File**: `src/app/capture/submit.tsx`
- **Features**: Category, summary, voice input, additional photos
- **Validation**: Category required, 10+ chars, location required

### Success Screen
- **File**: `src/app/capture/success.tsx`
- **Features**: Animated checkmark, AI status, navigation

### Submission Store
- **File**: `src/store/submissionStore.ts`
- **Features**: Draft management, limits, upload queue

## Validation Rules
| Rule | Value | Error Message |
|------|-------|---------------|
| Min Summary | 10 chars | "সারসংক্ষেপ কমপক্ষে ১০ অক্ষর হতে হবে" |
| Max Summary | 500 chars | Auto-limited |
| Category | Required | "ক্যাটাগরি নির্বাচন করুন" |
| Location | Required | "লোকেশন সার্ভিস চালু করুন" |
| Daily Limit | 5 submissions | "আজকের জন্য সর্বোচ্চ ৫টি জমা দেওয়া হয়েছে" |
| Cooldown | 30 minutes | "পরবর্তী জমা দিতে অপেক্ষা করুন" |
| Max Photos | 5 total | "সর্বোচ্চ ৫টি ছবি যোগ করা যাবে" |

## Categories
1. 🌱 গাছ লাগানো (Tree Planting)
2. 🧹 পরিষ্কার-পরিচ্ছন্নতা (Cleaning)
3. 💧 নদী পরিষ্কার (River Cleanup)
4. ♻️ বর্জ্য ব্যবস্থাপনা (Waste Management)
5. 📢 সচেতনতা কার্যক্রম (Awareness Campaign)
6. 🤝 এনজিও কার্যক্রম (NGO Activity)
7. 🐾 বন্যপ্রাণী সেবা (Wildlife Care)
8. ➕ অন্যান্য (Other)

## Image Compression
- **Max Width**: 1920px
- **Quality**: 80%
- **Format**: JPEG
- **EXIF**: Preserved

## Submission Limits
- **Daily**: 5 submissions max
- **Cooldown**: 30 minutes between submissions
- **Photos**: 5 max per submission
- **Video**: 1 per submission (no additional photos)
- **Summary**: 10-500 characters

## Metadata Captured
- GPS coordinates (lat/lng)
- Timestamp (ISO 8601)
- Device info
- EXIF data (from photos)
- User ID
- Category
- Summary text
- Group members (optional)

## Storage Keys
- `pending_submissions` - Upload queue
- `last_submission_time` - Cooldown tracking
- `daily_submission_count` - Daily limit tracking

## API Endpoints (To Be Implemented)
```typescript
POST /api/submissions
{
  mediaUris: string[],
  mediaType: 'photo' | 'video',
  category: string,
  summary: string,
  location: { lat: number, lng: number },
  timestamp: string,
  groupMembers: string[],
  userId: string
}
```

## Testing Commands
```bash
# Start dev server
npm start

# Check TypeScript
npx tsc --noEmit

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Common Issues & Solutions

### Camera Won't Open
- Check permissions granted
- Restart app
- Check device camera works in other apps

### Location Not Captured
- Enable location services
- Grant location permission
- Check GPS signal (go outside)

### Voice Input Not Working
- Grant microphone permission
- Check device language set to Bangla
- Speak clearly and slowly

### Image Compression Slow
- Normal for large images (>5MB)
- Wait for indicator to complete
- Consider using smaller images

### Submission Failed
- Check internet connection
- Verify all fields filled
- Check daily limit not reached
- Check cooldown timer

## Performance Tips
- Use compressed images when possible
- Avoid recording very long videos
- Clear old submissions from queue
- Test on physical device, not emulator

## Debugging
```typescript
// Enable submission store logging
console.log(useSubmissionStore.getState())

// Check pending uploads
console.log(useSubmissionStore.getState().pendingUploads)

// Check limits
console.log(useSubmissionStore.getState().checkSubmissionLimits())
```

## Next Implementation Steps
1. Connect to actual API endpoint
2. Implement AI verification service
3. Add submission history sync
4. Implement group member search
5. Add video compression
