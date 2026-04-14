import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradeBadgeProps {
  grade: string;
  size?: 'small' | 'medium' | 'large';
}

const gradeColors: Record<string, { border: string; glow: string; bg: string[] }> = {
  'A+': { border: '#FFD700', glow: '#FFD70040', bg: ['#FFD700', '#FFA500'] },
  'A': { border: '#00875A', glow: '#00875A40', bg: ['#00875A', '#006A4E'] },
  'B+': { border: '#4FC3F7', glow: '#4FC3F740', bg: ['#4FC3F7', '#0288D1'] },
  'B': { border: '#26C6DA', glow: '#26C6DA40', bg: ['#26C6DA', '#00ACC1'] },
  'C': { border: '#FFB74D', glow: '#FFB74D40', bg: ['#FFB74D', '#FF9800'] },
  'D': { border: '#9E9E9E', glow: '#9E9E9E40', bg: ['#BDBDBD', '#757575'] },
};

export const GradeBadge: React.FC<GradeBadgeProps> = ({ grade, size = 'medium' }) => {
  const colors = gradeColors[grade] || gradeColors['D'];
  const sizeMap = { small: 40, medium: 60, large: 80 };
  const fontSize = { small: 16, medium: 24, large: 32 };
  const badgeSize = sizeMap[size];

  return (
    <View style={[styles.container, { width: badgeSize, height: badgeSize }]}>
      <View style={[styles.glow, { backgroundColor: colors.glow, width: badgeSize + 8, height: badgeSize + 8 }]} />
      <LinearGradient
        colors={colors.bg}
        style={[styles.badge, { width: badgeSize, height: badgeSize, borderColor: colors.border }]}
      >
        <Text style={[styles.gradeText, { fontSize: fontSize[size] }]}>{grade}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 100,
  },
  badge: {
    borderRadius: 100,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
