import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  show: (message: string, type?: ToastType) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  show: (message, type = 'info') => set({ visible: true, message, type }),
  hide: () => set({ visible: false }),
}));

export const Toast: React.FC = () => {
  const { visible, message, type, hide } = useToastStore();
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => hide());
    }
  }, [visible]);

  if (!visible) return null;

  const backgroundColor = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
    warning: '#F59E0B',
  }[type];

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
