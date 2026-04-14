import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../store/themeStore';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' }]}>
      <ActivityIndicator size="large" color="#006A4E" />
      {message && (
        <Text style={[styles.message, { color: isDark ? '#ffffff' : '#000000' }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
  },
});
