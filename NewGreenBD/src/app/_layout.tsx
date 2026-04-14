import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { useSubmissionStore } from '../store/submissionStore';
import { storage } from '../utils/storage';
import { registerForPushNotifications, setupNotificationListeners } from '../services/notifications';
import { syncService } from '../services/sync';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Toast } from '../components/Toast';
import '../i18n';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = 'onboarding_completed';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const initTheme = useThemeStore((state) => state.initTheme);
  const initAuth = useAuthStore((state) => state.initAuth);
  const loadPendingUploads = useSubmissionStore((state) => state.loadPendingUploads);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initTheme();
        await initAuth();
        await loadPendingUploads();

        // Mock login for testing
        if (!isAuthenticated) {
          const { mockLogin } = await import('../services/auth');
          const mockUser = await mockLogin('user', { email: 'test@example.com', password: 'password123' });
          console.log('Mock user logged in:', mockUser);
        }

        // Initialize push notifications after auth
        if (isAuthenticated) {
          await registerForPushNotifications();
          await syncService.startBackgroundSync();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    init();
  }, []);

  // Setup notification listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanup = setupNotificationListeners(
      (notification) => {
        // Handle notification received while app is open
        console.log('Notification received:', notification);
      },
      (response) => {
        // Handle notification tap
        const data = response.notification.request.content.data;
        if (data.submissionId) {
          router.push(`/submission/${data.submissionId}`);
        } else if (data.challengeId) {
          router.push('/challenges');
        }
      }
    );

    return cleanup;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isReady) return;

    const checkOnboarding = async () => {
      const onboardingCompleted = await storage.get<boolean>(ONBOARDING_KEY);
      const inAuthGroup = segments[0] === '(auth)';

      if (!isAuthenticated) {
        if (!onboardingCompleted) {
          router.replace('/(auth)/onboarding');
        } else if (!inAuthGroup) {
          router.replace('/(auth)/login');
        }
      } else {
        if (inAuthGroup) {
          if (user?.role === 'admin') {
            router.replace('/(admin)');
          } else if (user?.role === 'security') {
            router.replace('/(security)');
          } else {
            router.replace('/(tabs)');
          }
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated, user, isReady, segments]);

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen name="(security)" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="benefits" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="challenges" />
        <Stack.Screen name="greenmap" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="educational" />
        <Stack.Screen name="capture" />
        <Stack.Screen name="submission" />
      </Stack>
      <Toast />
    </ErrorBoundary>
  );
}
