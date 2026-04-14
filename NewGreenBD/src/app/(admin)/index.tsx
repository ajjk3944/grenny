import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/themeStore';
import { getDashboardStats } from '@/services/adminService';
import { DashboardStats } from '@/types';
import { Card } from '@/components/ui/Card';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </View>
    );
  }

  const statCards = [
    { label: t('admin.total_users'), value: stats.totalUsers, icon: '👥' },
    { label: t('admin.total_security'), value: stats.totalSecurityUsers, icon: '🛡️' },
    { label: t('admin.submissions_today'), value: stats.submissionsToday, icon: '📝' },
    { label: t('admin.submissions_week'), value: stats.submissionsWeek, icon: '📊' },
    { label: t('admin.submissions_month'), value: stats.submissionsMonth, icon: '📈' },
    { label: t('admin.total_points'), value: stats.totalPointsDistributed, icon: '⭐' },
    { label: t('admin.pending_reviews'), value: stats.pendingReviews, icon: '⏳' },
    { label: t('admin.flagged_items'), value: stats.flaggedItems, icon: '🚩' },
    { label: t('admin.active_challenges'), value: stats.activeChallenges, icon: '🎯' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.grid}>
        {statCards.map((card, index) => (
          <Card key={index} style={styles.statCard}>
            <Text style={styles.icon}>{card.icon}</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{card.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {card.label}
            </Text>
          </Card>
        ))}
      </View>

      <Card style={styles.summaryCard}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          {t('admin.dashboard')}
        </Text>
        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
          System is running smoothly. Monitor user activities and manage submissions from the tabs above.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  statCard: {
    width: '31%',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
