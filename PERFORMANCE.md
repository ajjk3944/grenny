# GreenBD Performance Optimization Guide

## Overview

This document outlines performance optimization strategies implemented in GreenBD and best practices for maintaining optimal performance.

## Startup Performance

### Current Optimizations

- Splash screen prevents auto-hide until initialization complete
- Async initialization with proper error handling
- Minimal synchronous operations on startup
- Lazy loading of non-critical modules

### Target Metrics

- Cold start: < 3 seconds
- Warm start: < 1 second
- Time to interactive: < 2 seconds

### Optimization Strategies

```typescript
// Good: Async initialization
useEffect(() => {
  const init = async () => {
    try {
      await Promise.all([
        authStore.initialize(),
        i18n.initialize(),
        notificationStore.initialize(),
      ]);
    } finally {
      await SplashScreen.hideAsync();
    }
  };
  init();
}, []);

// Bad: Synchronous blocking operations
useEffect(() => {
  authStore.initialize(); // Blocks UI
  i18n.initialize(); // Blocks UI
  SplashScreen.hideAsync();
}, []);
```

## Image Optimization

### OptimizedImage Component

Uses expo-image for superior performance:

- Hardware-accelerated rendering
- Memory-efficient caching
- Progressive loading
- Blurhash placeholders

```typescript
<OptimizedImage
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  cachePolicy="memory-disk"
  placeholder={blurhash}
  transition={200}
/>
```

### Image Loading Best Practices

1. Use appropriate image sizes
   - Thumbnail: 200x200
   - Preview: 800x800
   - Full: 1920x1920

2. Compress images before upload
   - JPEG quality: 80-85%
   - PNG: Use TinyPNG or similar
   - WebP: Preferred format

3. Implement lazy loading
   ```typescript
   <FlatList
     data={items}
     renderItem={({ item }) => (
       <OptimizedImage source={{ uri: item.image }} />
     )}
     removeClippedSubviews={true}
     maxToRenderPerBatch={10}
     windowSize={5}
   />
   ```

### Caching Strategy

```typescript
// Memory cache: Fast access, limited size
cachePolicy="memory"

// Disk cache: Persistent, larger size
cachePolicy="disk"

// Both: Best performance
cachePolicy="memory-disk"

// None: Always fetch (use sparingly)
cachePolicy="none"
```

## List Performance

### FlatList Optimization

```typescript
<FlatList
  data={submissions}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
  
  // Optional: Fixed height items
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  
  // Pagination
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

### List Item Optimization

```typescript
// Good: Memoized component
const ListItem = React.memo(({ item }) => (
  <View>
    <Text>{item.title}</Text>
  </View>
));

// Bad: Inline component
<FlatList
  renderItem={({ item }) => (
    <View>
      <Text>{item.title}</Text>
    </View>
  )}
/>
```

### Pagination

Implement pagination for large datasets:

```typescript
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  if (!hasMore || loading) return;
  
  const newItems = await api.getSubmissions({ page: page + 1 });
  if (newItems.length === 0) {
    setHasMore(false);
  } else {
    setSubmissions([...submissions, ...newItems]);
    setPage(page + 1);
  }
};
```

## Animation Performance

### Use Reanimated

react-native-reanimated runs animations on the UI thread:

```typescript
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(visible ? 1 : 0),
}));

<Animated.View style={animatedStyle}>
  {children}
</Animated.View>
```

### Avoid Animated API for Complex Animations

```typescript
// Good: Reanimated (UI thread)
const scale = useSharedValue(1);
scale.value = withSpring(1.2);

// Bad: Animated API (JS thread)
const scale = useRef(new Animated.Value(1)).current;
Animated.spring(scale, { toValue: 1.2 }).start();
```

### Layout Animations

```typescript
import { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn}
  exiting={FadeOut}
  layout={Layout.springify()}
>
  {content}
</Animated.View>
```

## Memory Management

### Cleanup in useEffect

```typescript
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  
  return () => {
    subscription.remove(); // Cleanup
  };
}, []);
```

### Camera Resource Cleanup

```typescript
useEffect(() => {
  return () => {
    if (cameraRef.current) {
      cameraRef.current.pausePreview();
    }
  };
}, []);
```

### Image Cache Limits

```typescript
// Configure expo-image cache
import { Image } from 'expo-image';

Image.clearMemoryCache(); // Clear when needed
Image.clearDiskCache(); // Clear when needed
```

### Zustand Store Cleanup

```typescript
// Reset store on logout
const resetStore = () => {
  set({
    user: null,
    token: null,
    submissions: [],
    // Reset all state
  });
};
```

## Network Performance

### Request Optimization

```typescript
// Good: Batch requests
const [user, submissions, points] = await Promise.all([
  api.getUser(),
  api.getSubmissions(),
  api.getPoints(),
]);

// Bad: Sequential requests
const user = await api.getUser();
const submissions = await api.getSubmissions();
const points = await api.getPoints();
```

### Caching Strategy

```typescript
// Cache GET requests
const cache = new Map();

const fetchWithCache = async (url: string) => {
  if (cache.has(url)) {
    return cache.get(url);
  }
  
  const data = await fetch(url).then(r => r.json());
  cache.set(url, data);
  return data;
};
```

### Debouncing

```typescript
import { useDebouncedCallback } from 'use-debounce';

const search = useDebouncedCallback(
  async (query: string) => {
    const results = await api.search(query);
    setResults(results);
  },
  500 // Wait 500ms after last keystroke
);
```

### Offline Support

```typescript
// Queue requests when offline
const syncQueue = useStore((state) => state.syncQueue);

const submitOffline = async (data: SubmissionData) => {
  syncQueue.add({
    type: 'submission',
    data,
    timestamp: Date.now(),
  });
  
  // Sync when online
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncQueue.process();
    }
  });
};
```

## Bundle Size Optimization

### Import Optimization

```typescript
// Good: Named imports
import { Button } from 'react-native-paper';

// Bad: Default import (imports everything)
import * as Paper from 'react-native-paper';
```

### Lazy Loading

```typescript
// Lazy load screens
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));

// Use with Suspense
<Suspense fallback={<LoadingScreen />}>
  <ProfileScreen />
</Suspense>
```

### Remove Unused Dependencies

```bash
# Find unused dependencies
npx depcheck

# Remove unused
npm uninstall unused-package
```

### Analyze Bundle

```bash
# Analyze bundle size
npx expo-bundle-analyzer

# Check what's in the bundle
npx react-native-bundle-visualizer
```

## Database Performance

### Prisma Optimization

```typescript
// Good: Select only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    phone: true,
  },
});

// Bad: Select all fields
const users = await prisma.user.findMany();
```

### Pagination

```typescript
const submissions = await prisma.submission.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' },
});
```

### Indexing

```prisma
model Submission {
  id        String   @id @default(cuid())
  userId    String
  status    String
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

### Connection Pooling

```typescript
// Configure connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error', 'warn'],
});
```

## Monitoring Performance

### Performance Monitoring Utility

```typescript
import { performanceMonitor } from '@/utils/performance';

// Track operation
const stopTimer = performanceMonitor.startTimer('api_call');
await api.getData();
stopTimer();

// Get metrics
const metrics = performanceMonitor.getMetrics();
console.log('Average API call time:', metrics.api_call.average);
```

### React DevTools Profiler

```typescript
import { Profiler } from 'react';

<Profiler
  id="Dashboard"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} took ${actualDuration}ms`);
  }}
>
  <Dashboard />
</Profiler>
```

### Memory Profiling

```bash
# Android
adb shell dumpsys meminfo com.greenbd.app

# iOS
Instruments > Allocations
```

## Performance Checklist

### Development

- [ ] Use FlatList for long lists
- [ ] Implement pagination
- [ ] Memoize expensive components
- [ ] Use OptimizedImage for images
- [ ] Implement proper cleanup
- [ ] Avoid inline functions in render
- [ ] Use useCallback for callbacks
- [ ] Use useMemo for expensive calculations
- [ ] Implement debouncing for search
- [ ] Cache API responses

### Production

- [ ] Enable ProGuard/R8 (Android)
- [ ] Enable Hermes engine
- [ ] Optimize images
- [ ] Remove console.logs
- [ ] Enable production mode
- [ ] Minimize bundle size
- [ ] Test on low-end devices
- [ ] Monitor crash reports
- [ ] Track performance metrics
- [ ] Optimize database queries

## Performance Targets

### Mobile App

- Cold start: < 3 seconds
- Warm start: < 1 second
- Screen transitions: < 300ms
- List scrolling: 60 FPS
- Image loading: < 500ms
- API calls: < 2 seconds
- Memory usage: < 200MB
- Battery drain: < 5% per hour

### Backend API

- Response time: < 200ms (p95)
- Throughput: > 100 req/s
- Database queries: < 50ms
- File uploads: < 5 seconds
- Error rate: < 0.1%
- Uptime: > 99.9%

## Common Performance Issues

### Issue: Slow List Scrolling

Solution:
- Use FlatList with proper props
- Implement getItemLayout
- Memoize list items
- Reduce item complexity
- Enable removeClippedSubviews

### Issue: High Memory Usage

Solution:
- Clear image cache periodically
- Implement proper cleanup
- Avoid memory leaks
- Use pagination
- Optimize image sizes

### Issue: Slow Startup

Solution:
- Minimize synchronous operations
- Lazy load non-critical modules
- Optimize splash screen
- Reduce initial bundle size
- Use code splitting

### Issue: Janky Animations

Solution:
- Use react-native-reanimated
- Run animations on UI thread
- Avoid layout changes during animation
- Use transform instead of layout props
- Reduce animation complexity

### Issue: Slow API Calls

Solution:
- Implement caching
- Batch requests
- Optimize database queries
- Use CDN for static assets
- Implement pagination
- Add database indexes

## Tools

### Performance Testing

- React DevTools Profiler
- Flipper
- Android Studio Profiler
- Xcode Instruments
- Chrome DevTools

### Monitoring

- Sentry (crash reporting)
- Firebase Performance
- New Relic
- Datadog
- Custom analytics

### Optimization

- expo-image (image optimization)
- react-native-reanimated (animations)
- Hermes (JS engine)
- ProGuard/R8 (code shrinking)
- Bundle analyzer

## Best Practices Summary

1. Use FlatList for all long lists
2. Implement pagination for large datasets
3. Use OptimizedImage for all images
4. Memoize expensive components
5. Implement proper cleanup in useEffect
6. Use react-native-reanimated for animations
7. Batch API requests when possible
8. Implement caching strategy
9. Optimize bundle size
10. Monitor performance metrics

## Resources

- React Native Performance Guide
- Expo Performance Best Practices
- React Native Reanimated Documentation
- Expo Image Documentation
- Prisma Performance Guide

## Updates

This document should be reviewed and updated:
- After performance issues
- When adding new features
- When adopting new technologies
- At least quarterly

Last updated: 2024-01-01
