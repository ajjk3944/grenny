# GreenBD Developer Guide

Quick reference for developers working on GreenBD.

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on Android
npm run dev:android

# Run on iOS
npm run dev:ios
```

## Project Structure

```
src/
├── app/              # Screens (Expo Router)
├── components/       # Reusable components
├── store/            # State management (Zustand)
├── services/         # API calls
├── hooks/            # Custom hooks
├── utils/            # Utilities
├── types/            # TypeScript types
├── i18n/             # Translations
└── constants/        # Constants
```

## Key Utilities

### Logger
```typescript
import { logger, apiLogger, authLogger } from '@/utils/logger';

logger.info('Message', data);
logger.error('Error', error);
apiLogger.debug('API call', { url, method });
```

### Performance Monitor
```typescript
import { performanceMonitor, measureAsync } from '@/utils/performanceMonitor';

// Measure operation
const stop = performanceMonitor.startTimer('operation');
// ... do work
stop();

// Measure async function
await measureAsync('api_call', async () => {
  return await api.getData();
});
```

### App Config
```typescript
import { AppConfig } from '@/utils/appConfig';

const apiUrl = AppConfig.apiUrl;
const maxSubmissions = AppConfig.maxSubmissionsPerDay;
const isFeatureEnabled = AppConfig.enableBiometric;
```

## State Management

### Using Zustand Stores

```typescript
import { useAuthStore } from '@/store/authStore';

const Component = () => {
  const { user, login, logout } = useAuthStore();
  
  return (
    <View>
      <Text>{user?.name}</Text>
      <Button onPress={logout}>Logout</Button>
    </View>
  );
};
```

### Available Stores
- `authStore` - Authentication state
- `pointsStore` - Points and grades
- `submissionStore` - Submissions
- `notificationStore` - Notifications
- `offlineStore` - Offline queue
- `themeStore` - Theme settings

## API Services

### Making API Calls

```typescript
import { api } from '@/services/api';

// GET request
const data = await api.get('/endpoint');

// POST request
const result = await api.post('/endpoint', { data });

// With error handling
try {
  const data = await api.get('/endpoint');
} catch (error) {
  handleApiError(error);
}
```

### Error Handling

```typescript
import { handleApiError } from '@/utils/errorHandler';

try {
  await api.post('/submit', data);
} catch (error) {
  handleApiError(error); // Shows toast with error message
}
```

## Components

### Error Boundary

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Optimized Image

```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

### Toast Notifications

```typescript
import { showToast } from '@/components/Toast';

showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Warning message', 'warning');
showToast('Info message', 'info');
```

### Network Error

```typescript
import { NetworkError } from '@/components/NetworkError';

{error && <NetworkError onRetry={refetch} />}
```

## Internationalization

### Using Translations

```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  return <Text>{t('common.submit')}</Text>;
};
```

### Adding Translations

Edit `src/i18n/locales/bn.json` and `src/i18n/locales/en.json`:

```json
{
  "screen": {
    "title": "Title",
    "description": "Description"
  }
}
```

## Navigation

### Using Expo Router

```typescript
import { router } from 'expo-router';

// Navigate to screen
router.push('/profile');

// Navigate with params
router.push({
  pathname: '/submission/[id]',
  params: { id: '123' },
});

// Go back
router.back();

// Replace current screen
router.replace('/login');
```

### Protected Routes

```typescript
// In _layout.tsx
const { user } = useAuthStore();

if (!user) {
  return <Redirect href="/login" />;
}
```

## Styling

### Using Theme

```typescript
import { useTheme } from 'react-native-paper';

const Component = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Text</Text>
    </View>
  );
};
```

### Common Patterns

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## Performance Best Practices

### Lists

```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
  initialNumToRender={10}
/>
```

### Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const ListItem = memo(({ item }) => (
  <View>
    <Text>{item.title}</Text>
  </View>
));

// Memoize value
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callback
const handlePress = useCallback(() => {
  doSomething(id);
}, [id]);
```

### Images

```typescript
// Use OptimizedImage instead of Image
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  source={{ uri: url }}
  cachePolicy="memory-disk"
  contentFit="cover"
/>
```

## Testing

### Manual Testing

```bash
# Test on Android device
npm run dev:android

# Test on iOS device
npm run dev:ios

# Test offline mode
# 1. Enable airplane mode
# 2. Capture submission
# 3. Disable airplane mode
# 4. Check sync
```

### Build Testing

```bash
# Development build
npm run build:dev-apk

# Preview build
npm run build:preview-apk

# Production build
npm run build:prod
```

## Common Tasks

### Adding a New Screen

1. Create file in `src/app/`
```typescript
// src/app/new-screen.tsx
export default function NewScreen() {
  return (
    <View>
      <Text>New Screen</Text>
    </View>
  );
}
```

2. Navigate to it
```typescript
router.push('/new-screen');
```

### Adding a New API Endpoint

1. Add to API service
```typescript
// src/services/api.ts
export const api = {
  // ... existing methods
  newEndpoint: async (data: any) => {
    return apiClient.post('/new-endpoint', data);
  },
};
```

2. Use in component
```typescript
const result = await api.newEndpoint(data);
```

### Adding a New Store

1. Create store file
```typescript
// src/store/newStore.ts
import { create } from 'zustand';

interface NewState {
  data: any;
  setData: (data: any) => void;
}

export const useNewStore = create<NewState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
```

2. Use in component
```typescript
const { data, setData } = useNewStore();
```

### Adding a New Component

1. Create component file
```typescript
// src/components/NewComponent.tsx
import { View, Text } from 'react-native';

interface Props {
  title: string;
}

export const NewComponent = ({ title }: Props) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

2. Use in screen
```typescript
import { NewComponent } from '@/components/NewComponent';

<NewComponent title="Hello" />
```

## Debugging

### React Native Debugger

```bash
# Open debugger
# Press Ctrl+M (Android) or Cmd+D (iOS)
# Select "Debug"
```

### Logging

```typescript
import { logger } from '@/utils/logger';

logger.debug('Debug info', data);
logger.info('Info message', data);
logger.warn('Warning', data);
logger.error('Error', error);
```

### Performance Profiling

```typescript
import { performanceMonitor } from '@/utils/performanceMonitor';

// Start timer
const stop = performanceMonitor.startTimer('operation');
// ... do work
stop();

// View report
performanceMonitor.logReport();
```

### Network Debugging

```bash
# Use Flipper
# Install Flipper: https://fbflipper.com
# Enable Network plugin
# View all API calls
```

## Environment Variables

### App (.env)
```env
API_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_client_id
FACEBOOK_APP_ID=your_app_id
```

### Server (server/.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/greenbd
JWT_SECRET=your_secret
OPENAI_API_KEY=your_key
PORT=3000
```

## Build & Deploy

### Development Build
```bash
npm run build:dev-apk
```

### Preview Build
```bash
npm run build:preview-apk
```

### Production Build
```bash
# Android
npm run build:prod

# iOS
npm run build:ios
```

### Deploy Backend
```bash
cd server
npm run build
# Deploy to your hosting service
```

## Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
npx expo start -c

# Reset Metro
rm -rf node_modules
npm install
npx expo start -c
```

### Build Issues
```bash
# Clear EAS cache
eas build --clear-cache

# Check build logs
eas build:list
```

### Database Issues
```bash
# Reset database
cd server
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

## Code Style

### TypeScript
- Use strict mode
- Avoid `any` type
- Define interfaces for props
- Use type inference when possible

### Naming Conventions
- Components: PascalCase (`MyComponent`)
- Files: camelCase (`myFile.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_SIZE`)
- Functions: camelCase (`handleSubmit`)

### File Organization
```typescript
// 1. Imports
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export const MyComponent = ({ title }: Props) => {
  // 4. Hooks
  const theme = useTheme();
  
  // 5. Handlers
  const handlePress = () => {};
  
  // 6. Render
  return <View />;
};

// 7. Styles
const styles = StyleSheet.create({});
```

## Resources

### Documentation
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev
- React Native Paper: https://callstack.github.io/react-native-paper
- Zustand: https://github.com/pmndrs/zustand
- Prisma: https://www.prisma.io/docs

### Tools
- Expo Go: Test on device
- EAS CLI: Build and deploy
- Flipper: Debugging
- React DevTools: Component inspection

### Project Docs
- `README.md` - Project overview
- `FEATURES.md` - Feature list
- `PERFORMANCE.md` - Performance guide
- `SECURITY.md` - Security guide
- `BUILD_GUIDE.md` - Build instructions
- `DEPLOYMENT_GUIDE.md` - Deployment guide

## Getting Help

1. Check documentation files
2. Review code comments
3. Check error logs
4. Search issues on GitHub
5. Ask team members

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Wait for review

---

**Happy Coding! 🚀**
