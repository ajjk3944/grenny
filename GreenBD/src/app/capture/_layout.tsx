import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function CaptureLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.light.background,
        },
        headerTintColor: colors.light.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="submit"
        options={{
          title: 'জমা দিন',
          headerBackTitle: 'বাতিল',
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          title: '',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
