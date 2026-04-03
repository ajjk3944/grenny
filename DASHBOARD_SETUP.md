# Dashboard Setup Guide

## Installation

1. Install new dependencies:
```bash
cd GreenBD
npm install
```

This will install:
- `react-native-chart-kit` (for charts)
- `react-native-svg` (required by chart-kit)

## Running the App

```bash
# Start Expo
npm start

# Or run on specific platform
npm run android
npm run ios
```

## What's New

### Dashboard Features
The main dashboard (`app/(tabs)/index.tsx`) now includes:

1. **Points Overview Card**
   - Shows total points in large text
   - Displays current grade badge (A+ to D)
   - Progress bar to next grade
   - Today's points earned

2. **Time Filter Tabs**
   - Switch between Today, Weekly, Monthly, Yearly views
   - Updates the chart below

3. **Points Chart**
   - Interactive line chart
   - Shows points trend over selected period
   - Smooth bezier curves with gradient fill

4. **Quick Stats**
   - Trees planted
   - Cleanups completed
   - Current streak
   - District rank

5. **Leaderboard Preview**
   - Top 3 users in podium style
   - Gold/silver/bronze colors
   - Links to full leaderboard

6. **Benefits Preview**
   - Scrollable benefit cards
   - Shows required points
   - Redeem button (enabled if enough points)
   - Links to benefits page

7. **Recent Activity**
   - Last 3 submissions
   - Status badges
   - Points earned
   - Links to history tab

### Bangla Numeral Support
Numbers automatically display in Bangla numerals (০১২৩৪৫৬৭৮৯) when the app language is set to Bangla.

### Grade System
Grades are calculated based on monthly points:
- **A+**: 500+ points (Gold)
- **A**: 350-499 points (Green)
- **B+**: 200-349 points (Blue)
- **B**: 100-199 points (Teal)
- **C**: 50-99 points (Yellow)
- **D**: 0-49 points (Gray)

## Testing

### Mock Data
The dashboard uses mock data for testing:
- User has 2,450 total points
- Grade A (450 monthly points)
- 15-day streak
- District rank: 12
- 30 days of points history

### Pull to Refresh
Pull down on the dashboard to refresh all data.

## Customization

### Changing Mock Data
Edit `src/services/dashboardData.ts` to modify:
- Leaderboard users
- Available benefits
- Recent activities

### Connecting to Real API
Update `src/store/pointsStore.ts`:
```typescript
fetchPoints: async () => {
  set({ loading: true });
  try {
    // Replace with your API call
    const response = await fetch('YOUR_API_ENDPOINT');
    const data = await response.json();
    
    set({
      totalPoints: data.totalPoints,
      todayPoints: data.todayPoints,
      // ... other fields
      loading: false,
    });
  } catch (error) {
    set({ loading: false });
  }
}
```

## Troubleshooting

### Chart not displaying
Make sure `react-native-svg` is properly installed:
```bash
npm install react-native-svg
npx expo install react-native-svg
```

### Bangla numerals not showing
Check that the language is set to 'bn' in the language store.

### Icons not showing
Ensure `@expo/vector-icons` is installed (should be included with Expo).

## File Structure
```
src/
├── app/(tabs)/
│   └── index.tsx                    # Main dashboard screen
├── components/dashboard/
│   ├── GradeBadge.tsx              # Grade badge component
│   ├── PointsCard.tsx              # Points overview card
│   ├── TimeFilterTabs.tsx          # Time period tabs
│   ├── PointsChart.tsx             # Line chart
│   ├── QuickStats.tsx              # Stats row
│   ├── LeaderboardPreview.tsx      # Top 3 users
│   ├── BenefitsPreview.tsx         # Benefits carousel
│   ├── RecentActivity.tsx          # Recent submissions
│   └── SkeletonLoader.tsx          # Loading state
├── store/
│   └── pointsStore.ts              # Points state management
├── services/
│   └── dashboardData.ts            # Mock data
└── utils/
    └── format.ts                    # Number formatting utilities
```

## Next Steps
1. Connect to your backend API
2. Implement the full leaderboard screen (`/leaderboard`)
3. Implement the benefits screen (`/benefits`)
4. Add real-time updates
5. Implement push notifications for achievements
