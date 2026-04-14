import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { usePointsStore } from '../../store/pointsStore';
import { PointsCard } from '../../components/dashboard/PointsCard';
import { TimeFilterTabs } from '../../components/dashboard/TimeFilterTabs';
import { PointsChart } from '../../components/dashboard/PointsChart';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { LeaderboardPreview } from '../../components/dashboard/LeaderboardPreview';
import { BenefitsPreview } from '../../components/dashboard/BenefitsPreview';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';
import { OfflineBanner } from '../../components/ui/OfflineBanner';
import { mockLeaderboardUsers, mockBenefits, mockRecentActivities } from '../../services/dashboardData';

type TimePeriod = 'today' | 'weekly' | 'monthly' | 'yearly';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    totalPoints,
    todayPoints,
    weeklyPoints,
    monthlyPoints,
    yearlyPoints,
    grade,
    gradeProgress,
    streak,
    rank,
    stats,
    pointsHistory,
    loading,
    fetchPoints,
  } = usePointsStore();

  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('monthly');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPoints();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPoints();
    setRefreshing(false);
  };

  if (loading && !refreshing) {
    return <SkeletonLoader />;
  }

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Section 1: Points Overview Card */}
        <PointsCard
          totalPoints={totalPoints}
          todayPoints={todayPoints}
          grade={grade}
          gradeProgress={gradeProgress}
        />

        {/* Section 2: Time Filter Tabs */}
        <TimeFilterTabs selected={selectedPeriod} onSelect={setSelectedPeriod} />

        {/* Section 2: Points Chart */}
        <PointsChart data={pointsHistory} period={selectedPeriod} />

        {/* Section 3: Quick Stats Row */}
        <QuickStats stats={stats} streak={streak} rank={rank} />

        {/* Section 4: Leaderboard Preview */}
        <LeaderboardPreview topUsers={mockLeaderboardUsers} />

        {/* Section 5: Available Benefits Banner */}
        <BenefitsPreview benefits={mockBenefits} userPoints={totalPoints} />

        {/* Section 6: Recent Activity Preview */}
        <RecentActivity activities={mockRecentActivities} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSpacer: {
    height: 24,
  },
});
