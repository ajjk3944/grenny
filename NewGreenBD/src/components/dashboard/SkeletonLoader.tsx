import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../store/themeStore';

export const SkeletonLoader: React.FC = () => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      {/* Points Card Skeleton */}
      <Animated.View style={[styles.pointsCard, { backgroundColor: colors.border, opacity }]} />

      {/* Tabs Skeleton */}
      <View style={styles.tabsRow}>
        {[1, 2, 3, 4].map((i) => (
          <Animated.View key={i} style={[styles.tab, { backgroundColor: colors.border, opacity }]} />
        ))}
      </View>

      {/* Chart Skeleton */}
      <Animated.View style={[styles.chart, { backgroundColor: colors.border, opacity }]} />

      {/* Stats Skeleton */}
      <View style={styles.statsRow}>
        {[1, 2, 3, 4].map((i) => (
          <Animated.View key={i} style={[styles.statCard, { backgroundColor: colors.border, opacity }]} />
        ))}
      </View>

      {/* Leaderboard Skeleton */}
      <Animated.View style={[styles.card, { backgroundColor: colors.border, opacity }]} />

      {/* Benefits Skeleton */}
      <Animated.View style={[styles.card, { backgroundColor: colors.border, opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pointsCard: {
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    width: 80,
    height: 36,
    borderRadius: 18,
  },
  chart: {
    height: 220,
    borderRadius: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    height: 120,
    borderRadius: 12,
  },
  card: {
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
});
