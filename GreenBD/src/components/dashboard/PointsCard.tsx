import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { GradeBadge } from './GradeBadge';
import { formatNumber } from '../../utils/format';

interface PointsCardProps {
  totalPoints: number;
  todayPoints: number;
  grade: string;
  gradeProgress: number;
}

export const PointsCard: React.FC<PointsCardProps> = ({
  totalPoints,
  todayPoints,
  grade,
  gradeProgress,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <LinearGradient
      colors={['#006A4E', '#00875A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <GradeBadge grade={grade} size="large" />
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${gradeProgress}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.pointsText}>
            {formatNumber(totalPoints, locale)}
          </Text>
          <Text style={styles.pointsLabel}>
            {locale === 'bn' ? 'পয়েন্ট' : 'Points'}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.todayText}>
          {locale === 'bn' ? 'আজ' : 'Today'} +{formatNumber(todayPoints, locale)} {locale === 'bn' ? 'পয়েন্ট' : 'points'}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 12,
    width: 80,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsLabel: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  footer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  todayText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
