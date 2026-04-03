# GreenBD Dashboard - Testing Checklist

## 📋 Pre-Testing Setup

- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm start`)
- [ ] App loaded on device/emulator
- [ ] Logged in as general user

## 🎨 Visual Testing

### Points Card
- [ ] Card displays with green gradient background
- [ ] Total points shown in large text
- [ ] Grade badge visible with correct color
- [ ] Progress bar shows percentage
- [ ] Today's points displayed at bottom
- [ ] Card has rounded corners and shadow
- [ ] Numbers display in Bangla when language is Bangla
- [ ] Numbers display in English when language is English

### Time Filter Tabs
- [ ] All 4 tabs visible (Today/Weekly/Monthly/Yearly)
- [ ] Tabs are horizontally scrollable
- [ ] Active tab has filled background
- [ ] Inactive tabs have outlined style
- [ ] Tab labels in correct language
- [ ] Tapping tab changes selection
- [ ] Smooth transition between tabs

### Points Chart
- [ ] Chart displays below tabs
- [ ] Line is smooth (bezier curve)
- [ ] Gradient fill below line
- [ ] Data points visible
- [ ] X-axis labels visible
- [ ] Y-axis labels visible
- [ ] Chart updates when tab changes
- [ ] Chart is responsive to screen width

### Quick Stats
- [ ] 4 stat cards in a row
- [ ] Icons display correctly (leaf, trash, flame, trophy)
- [ ] Numbers display correctly
- [ ] Labels in correct language
- [ ] Cards have background and shadow
- [ ] Numbers in Bangla when language is Bangla

### Leaderboard Preview
- [ ] Card displays with title
- [ ] 3 users shown in podium style
- [ ] Center user (1st) is larger
- [ ] Left user (2nd) and right user (3rd) visible
- [ ] Avatars or initials shown
- [ ] Grade badges visible
- [ ] Points displayed
- [ ] Gold/silver/bronze colors correct
- [ ] "View Full Leaderboard" button visible
- [ ] Button navigates to leaderboard screen

### Benefits Preview
- [ ] Section title visible
- [ ] Cards are horizontally scrollable
- [ ] Each card shows icon, title, points
- [ ] "Redeem" button visible
- [ ] Button is green if enough points
- [ ] Button is gray if not enough points
- [ ] "See All Benefits" link visible
- [ ] Link navigates to benefits screen

### Recent Activity
- [ ] Card displays with title
- [ ] Up to 3 activities shown
- [ ] Thumbnails or placeholders visible
- [ ] Category labels visible
- [ ] Status badges show correct status
- [ ] Points shown for approved items
- [ ] "View All" link visible
- [ ] Link navigates to history tab
- [ ] Empty state shows when no activities

### Skeleton Loader
- [ ] Shows on initial load
- [ ] Placeholder boxes match layout
- [ ] Shimmer animation visible
- [ ] Disappears when data loads

## 🔄 Interaction Testing

### Pull-to-Refresh
- [ ] Pull down gesture works
- [ ] Refresh indicator appears
- [ ] Data reloads
- [ ] Indicator disappears when done
- [ ] All sections update

### Tab Switching
- [ ] Tapping "Today" updates chart
- [ ] Tapping "Weekly" updates chart
- [ ] Tapping "Monthly" updates chart
- [ ] Tapping "Yearly" updates chart
- [ ] Chart animates smoothly
- [ ] Selected tab stays highlighted

### Navigation
- [ ] "View Full Leaderboard" navigates correctly
- [ ] "See All Benefits" navigates correctly
- [ ] "View All" (activity) navigates correctly
- [ ] Back button returns to dashboard
- [ ] Navigation is smooth

### Scrolling
- [ ] Dashboard scrolls smoothly
- [ ] Benefits scroll horizontally
- [ ] Tabs scroll horizontally
- [ ] No lag or stuttering
- [ ] Scroll position maintained

## 🌐 Localization Testing

### Bangla Language
- [ ] All text in Bangla
- [ ] Numbers in Bangla numerals (০১২৩৪৫৬৭৮৯)
- [ ] Tab labels in Bangla
- [ ] Stat labels in Bangla
- [ ] Button text in Bangla
- [ ] Benefit titles in Bangla

### English Language
- [ ] All text in English
- [ ] Numbers in English numerals (0123456789)
- [ ] Tab labels in English
- [ ] Stat labels in English
- [ ] Button text in English
- [ ] Benefit titles in English

### Language Switching
- [ ] Switch to English updates all text
- [ ] Switch to Bangla updates all text
- [ ] Numbers update correctly
- [ ] Layout doesn't break
- [ ] No missing translations

## 🎨 Theme Testing

### Light Theme
- [ ] Background is light
- [ ] Text is dark
- [ ] Cards are white
- [ ] Borders are light gray
- [ ] Icons are colored
- [ ] Chart colors correct

### Dark Theme
- [ ] Background is dark
- [ ] Text is light
- [ ] Cards are dark
- [ ] Borders are dark
- [ ] Icons are colored
- [ ] Chart colors correct

### Theme Switching
- [ ] Switch to dark updates all colors
- [ ] Switch to light updates all colors
- [ ] No flashing or glitches
- [ ] All sections update

## 📊 Data Testing

### Points Display
- [ ] Total points correct (2,450)
- [ ] Today points correct (45)
- [ ] Grade correct (A)
- [ ] Progress bar correct (~90%)
- [ ] Streak correct (15)
- [ ] Rank correct (12)

### Stats Display
- [ ] Trees planted correct (23)
- [ ] Cleanups correct (18)
- [ ] Total activities calculated
- [ ] All numbers formatted

### Chart Data
- [ ] Today shows hourly data
- [ ] Weekly shows daily data
- [ ] Monthly shows daily data
- [ ] Yearly shows monthly data
- [ ] Data points are reasonable

### Leaderboard Data
- [ ] 3 users shown
- [ ] Names displayed
- [ ] Points displayed
- [ ] Grades displayed
- [ ] Order correct (1st, 2nd, 3rd)

### Benefits Data
- [ ] 4 benefits shown
- [ ] Titles displayed
- [ ] Points required shown
- [ ] Icons displayed
- [ ] Redeem state correct

### Activity Data
- [ ] 3 activities shown
- [ ] Categories displayed
- [ ] Status badges correct
- [ ] Points shown for approved
- [ ] Dates reasonable

## 🎯 Grade System Testing

### Grade Calculation
- [ ] 0-49 points = D (Gray)
- [ ] 50-99 points = C (Yellow)
- [ ] 100-199 points = B (Teal)
- [ ] 200-349 points = B+ (Blue)
- [ ] 350-499 points = A (Green)
- [ ] 500+ points = A+ (Gold)

### Grade Badge
- [ ] Correct letter displayed
- [ ] Correct color shown
- [ ] Glow effect visible
- [ ] Size appropriate
- [ ] Circular shape

### Progress Bar
- [ ] Shows percentage to next grade
- [ ] Bar fills correctly
- [ ] Gold color for fill
- [ ] Smooth animation

## 📱 Device Testing

### Phone (Small Screen)
- [ ] All sections visible
- [ ] No horizontal overflow
- [ ] Text readable
- [ ] Buttons tappable
- [ ] Scrolling smooth

### Tablet (Large Screen)
- [ ] Layout scales properly
- [ ] More spacing visible
- [ ] Text still readable
- [ ] No stretched elements
- [ ] Chart fills width

### Different Orientations
- [ ] Portrait mode works
- [ ] Landscape mode works
- [ ] Layout adapts
- [ ] No broken elements

## ⚡ Performance Testing

### Load Time
- [ ] Initial load < 2 seconds
- [ ] Skeleton shows immediately
- [ ] Data loads quickly
- [ ] No long delays

### Scrolling
- [ ] 60 FPS scrolling
- [ ] No lag or stutter
- [ ] Smooth animations
- [ ] No frame drops

### Memory Usage
- [ ] No memory leaks
- [ ] App doesn't crash
- [ ] Stable performance
- [ ] No excessive memory use

### Network
- [ ] Works with good connection
- [ ] Handles slow connection
- [ ] Shows loading states
- [ ] Handles no connection

## 🐛 Error Testing

### No Data
- [ ] Empty state shows
- [ ] No crashes
- [ ] Helpful message
- [ ] Can still navigate

### Network Error
- [ ] Error handled gracefully
- [ ] User notified
- [ ] Can retry
- [ ] App doesn't crash

### Invalid Data
- [ ] Handles missing fields
- [ ] Shows defaults
- [ ] No crashes
- [ ] Logs errors

## ♿ Accessibility Testing

### Touch Targets
- [ ] All buttons > 44x44
- [ ] Easy to tap
- [ ] No accidental taps
- [ ] Proper spacing

### Color Contrast
- [ ] Text readable
- [ ] Sufficient contrast
- [ ] Works for colorblind
- [ ] Icons clear

### Screen Reader
- [ ] Elements have labels
- [ ] Navigation clear
- [ ] Status announced
- [ ] Helpful descriptions

## 🔒 Security Testing

### Data Handling
- [ ] No sensitive data exposed
- [ ] API calls secure
- [ ] No console logs in production
- [ ] Proper error handling

## ✅ Final Checks

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Code formatted
- [ ] Comments added

### Documentation
- [ ] README updated
- [ ] Comments clear
- [ ] Examples provided
- [ ] API documented

### Build
- [ ] Development build works
- [ ] Production build works
- [ ] No build errors
- [ ] Assets included

## 📝 Test Results

### Date: _______________
### Tester: _______________
### Device: _______________
### OS Version: _______________

### Issues Found:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Notes:
_______________________________________________
_______________________________________________
_______________________________________________

### Overall Status:
- [ ] All tests passed
- [ ] Minor issues (list above)
- [ ] Major issues (list above)
- [ ] Ready for production
- [ ] Needs more work

## 🎉 Sign-off

- [ ] Developer tested
- [ ] QA tested
- [ ] Product owner approved
- [ ] Ready to deploy

---

**Testing completed by:** _______________
**Date:** _______________
**Signature:** _______________
