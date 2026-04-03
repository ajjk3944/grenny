# Dashboard Layout Guide

## Visual Structure

```
┌─────────────────────────────────────────┐
│         DASHBOARD SCREEN                │
│  (Scrollable, Pull-to-Refresh)          │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 1: POINTS CARD          │ │
│  │  ┌─────┐                          │ │
│  │  │  A  │    ২,৪৫০ পয়েন্ট        │ │
│  │  │Grade│                          │ │
│  │  └─────┘                          │ │
│  │  [████████░░] 90%                 │ │
│  │                                   │ │
│  │  আজ +৪৫ পয়েন্ট                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 2: TIME FILTER TABS     │ │
│  │  [আজ] [সাপ্তাহিক] [মাসিক] [বাৎসরিক] │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 2: POINTS CHART         │ │
│  │         ╱╲                        │ │
│  │        ╱  ╲      ╱╲               │ │
│  │       ╱    ╲    ╱  ╲              │ │
│  │      ╱      ╲  ╱    ╲             │ │
│  │     ╱        ╲╱      ╲            │ │
│  │  ──────────────────────────       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 3: QUICK STATS          │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐     │ │
│  │  │ 🌳 │ │ 🗑️ │ │ 🔥 │ │ 🏆 │     │ │
│  │  │ 23 │ │ 18 │ │ 15 │ │ 12 │     │ │
│  │  │গাছ │ │পরি │ │দিন │ │জেলা│     │ │
│  │  └────┘ └────┘ └────┘ └────┘     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 4: LEADERBOARD          │ │
│  │                                   │ │
│  │      ┌───┐  ┌───┐  ┌───┐         │ │
│  │      │ 2 │  │ 1 │  │ 3 │         │ │
│  │      │👤 │  │👤 │  │👤 │         │ │
│  │      └───┘  └───┘  └───┘         │ │
│  │      ████   █████  ███            │ │
│  │                                   │ │
│  │  [সম্পূর্ণ লিডারবোর্ড দেখুন]     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 5: BENEFITS             │ │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │ │
│  │  │ 🌱  │ │ 📜  │ │ 👜  │ │ 💡  │ │ │
│  │  │গাছ  │ │সার্টি│ │ইকো │ │সোলার│ │ │
│  │  │৫০০  │ │১০০০ │ │৩০০ │ │২০০০│ │ │
│  │  │[রিডিম]│[রিডিম]│[রিডিম]│[রিডিম]│ │ │
│  │  └─────┘ └─────┘ └─────┘ └─────┘ │ │
│  │  → সব সুবিধা দেখুন                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │   SECTION 6: RECENT ACTIVITY      │ │
│  │  ┌─────────────────────────────┐  │ │
│  │  │ [📷] গাছ রোপণ    [✓] +৫০   │  │ │
│  │  ├─────────────────────────────┤  │ │
│  │  │ [📷] পরিচ্ছন্নতা  [⏳]      │  │ │
│  │  ├─────────────────────────────┤  │ │
│  │  │ [📷] প্লাস্টিক    [✓] +৩০   │  │ │
│  │  └─────────────────────────────┘  │ │
│  │  → সব দেখুন                       │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
DashboardScreen
├── PointsCard
│   ├── GradeBadge
│   └── ProgressBar
├── TimeFilterTabs
├── PointsChart
├── QuickStats
│   └── StatCard (x4)
├── LeaderboardPreview
│   ├── PodiumItem (x3)
│   │   ├── Avatar
│   │   ├── GradeBadge
│   │   └── PodiumBase
│   └── ViewAllButton
├── BenefitsPreview
│   ├── BenefitCard (x4)
│   │   ├── Icon
│   │   └── RedeemButton
│   └── ViewAllButton
└── RecentActivity
    ├── ActivityItem (x3)
    │   ├── Thumbnail
    │   ├── StatusBadge
    │   └── Points
    └── ViewAllButton
```

## Color Scheme

### Primary Colors
- **Primary Green**: #006A4E
- **Primary Light**: #00875A
- **Secondary Gold**: #FFD700

### Grade Colors
- **A+ (Gold)**: #FFD700
- **A (Green)**: #00875A
- **B+ (Blue)**: #4FC3F7
- **B (Teal)**: #26C6DA
- **C (Yellow)**: #FFB74D
- **D (Gray)**: #9E9E9E

### Status Colors
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Error**: #D32F2F
- **Info**: #2196F3

### Theme Colors (Light)
- **Background**: #FAFAFA
- **Surface**: #FFFFFF
- **Text**: #1A1A2E
- **Text Secondary**: #5A5A7A
- **Border**: #E0E0E0

### Theme Colors (Dark)
- **Background**: #0D1F17
- **Surface**: #1B3A2D
- **Text**: #E8F5E9
- **Text Secondary**: #A5D6A7
- **Border**: #2E5A4A

## Spacing System

### Margins
- **Section Spacing**: 16-20px
- **Card Margin**: 16px horizontal
- **Element Spacing**: 8-12px

### Padding
- **Card Padding**: 16-20px
- **Button Padding**: 12px vertical, 20px horizontal
- **Small Padding**: 8px

### Border Radius
- **Cards**: 16px
- **Buttons**: 8-12px
- **Pills/Tabs**: 20px
- **Avatars**: 50% (circular)

## Typography

### Font Sizes
- **Extra Large**: 48px (Points display)
- **Large**: 24px (Grade badge)
- **Title**: 18px (Section titles)
- **Body**: 14px (Regular text)
- **Small**: 12px (Labels, secondary text)
- **Tiny**: 11px (Stat labels)

### Font Weights
- **Bold**: 700 (Points, titles)
- **Semi-bold**: 600 (Buttons, labels)
- **Regular**: 400 (Body text)

## Icon System

### Icons Used
- **leaf**: Trees planted
- **trash**: Cleanups
- **flame**: Streak
- **trophy**: Rank
- **ribbon**: Certificate
- **bag**: Eco-bag
- **bulb**: Solar lamp
- **chevron-forward**: Navigation arrows
- **image-outline**: Placeholder

### Icon Sizes
- **Large**: 48px (Empty states)
- **Medium**: 32px (Benefit icons)
- **Regular**: 24px (Stat icons)
- **Small**: 20px (Navigation)
- **Tiny**: 16px (Inline icons)

## Interaction States

### Buttons
- **Default**: Outlined or filled
- **Hover**: Slight opacity change (web)
- **Pressed**: Scale down slightly
- **Disabled**: Gray background, reduced opacity

### Cards
- **Default**: White/surface color with shadow
- **Pressed**: Slight scale down
- **Loading**: Skeleton shimmer

### Tabs
- **Active**: Filled with primary color
- **Inactive**: Outlined with primary color
- **Transition**: Smooth color change

## Animations

### Skeleton Loading
- **Duration**: 1000ms
- **Type**: Opacity pulse (0.3 to 0.7)
- **Loop**: Infinite

### Chart
- **Entry**: Fade in with slide up
- **Duration**: 500ms
- **Easing**: Ease-out

### Pull-to-Refresh
- **Indicator**: Spinner in primary color
- **Threshold**: 60px pull distance

## Responsive Breakpoints

### Mobile (Default)
- **Width**: < 768px
- **Layout**: Single column
- **Stats**: 4 columns in row

### Tablet
- **Width**: 768px - 1024px
- **Layout**: Can show 2 columns
- **Stats**: 4 columns with more spacing

### Desktop (if web)
- **Width**: > 1024px
- **Layout**: Max width container
- **Stats**: Larger cards

## Accessibility

### Touch Targets
- **Minimum**: 44x44px
- **Recommended**: 48x48px

### Color Contrast
- **Text on Background**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum

### Screen Reader
- All interactive elements have labels
- Images have alt text
- Status changes announced

## Performance

### Optimization Techniques
1. **Lazy Loading**: Load sections as they enter viewport
2. **Memoization**: Prevent unnecessary re-renders
3. **Image Optimization**: Compress and cache images
4. **Data Pagination**: Load more data on scroll
5. **Debouncing**: Limit API calls on interactions

### Loading Strategy
1. Show skeleton immediately
2. Load critical data first (points, grade)
3. Load secondary data (leaderboard, benefits)
4. Load tertiary data (recent activity)

## Data Flow

```
User Opens Dashboard
        ↓
Show Skeleton Loader
        ↓
Fetch Points Data (API/Store)
        ↓
Calculate Grade & Progress
        ↓
Render Components
        ↓
User Interacts (Pull-to-Refresh, Tab Change)
        ↓
Update Data & Re-render
```

## State Management

### Global State (Zustand)
- Points data
- User stats
- Grade information
- Points history

### Local State (useState)
- Selected time period
- Refreshing status
- Loading states

### Derived State
- Grade (calculated from monthly points)
- Progress (calculated from grade thresholds)
- Chart data (filtered from history)
