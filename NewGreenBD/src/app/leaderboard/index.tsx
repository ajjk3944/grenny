import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { LeaderboardUser } from '../../types';
import { leaderboardService } from '../../services/leaderboardService';
import { GradeBadge } from '../../components/dashboard/GradeBadge';
import { Ionicons } from '@expo/vector-icons';

type Scope = 'ward' | 'upazila' | 'district' | 'division' | 'national';
type TimeFilter = 'weekly' | 'monthly' | 'all_time';

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedScope, setSelectedScope] = useState<Scope>('district');
  const [selectedTime, setSelectedTime] = useState<TimeFilter>('monthly');
  const [currentUserRank, setCurrentUserRank] = useState(42);

  const scopeTabs: { key: Scope; label: string }[] = [
    { key: 'ward', label: t('leaderboard.scope.ward') },
    { key: 'upazila', label: t('leaderboard.scope.upazila') },
    { key: 'district', label: t('leaderboard.scope.district') },
    { key: 'division', label: t('leaderboard.scope.division') },
    { key: 'national', label: t('leaderboard.scope.national') },
  ];

  const timeTabs: { key: TimeFilter; label: string }[] = [
    { key: 'weekly', label: t('leaderboard.time.weekly') },
    { key: 'monthly', label: t('leaderboard.time.monthly') },
    { key: 'all_time', label: t('leaderboard.time.all_time') },
  ];

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getLeaderboard(selectedScope, selectedTime);
      setUsers(data);
      const rank = await leaderboardService.getCurrentUserRank();
      setCurrentUserRank(rank);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadLeaderboard();
  }, [selectedScope, selectedTime]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLeaderboard();
  };

  const renderPodium = () => {
    if (users.length < 3) return null;

    const topThree = users.slice(0, 3);
    const [first, second, third] = [topThree[0], topThree[1], topThree[2]];

    return (
      <View style={styles.podiumContainer}>
        <View style={styles.podiumRow}>
          <View style={styles.podiumItem}>
            <View style={[styles.avatarContainer, styles.silverRing]}>
              <Image source={{ uri: second.avatar }} style={styles.podiumAvatar} />
              <View style={[styles.rankBadge, { backgroundColor: '#C0C0C0' }]}>
                <Text style={styles.rankBadgeText}>2</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
              {second.name}
            </Text>
            <Text style={[styles.podiumPoints, { color: colors.primary }]}>
              {second.points.toLocaleString()}
            </Text>
            <GradeBadge grade={second.grade} size="small" />
          </View>

          <View style={[styles.podiumItem, styles.firstPlace]}>
            <View style={[styles.avatarContainer, styles.goldRing]}>
              <Image source={{ uri: first.avatar }} style={styles.podiumAvatarLarge} />
              <View style={[styles.rankBadge, { backgroundColor: '#FFD700' }]}>
                <Text style={styles.rankBadgeText}>1</Text>
              </View>
              <Ionicons
                name="trophy"
                size={24}
                color="#FFD700"
                style={styles.crownIcon}
              />
            </View>
            <Text style={[styles.podiumName, { color: colors.text, fontSize: 16 }]} numberOfLines={1}>
              {first.name}
            </Text>
            <Text style={[styles.podiumPoints, { color: colors.primary, fontSize: 18 }]}>
              {first.points.toLocaleString()}
            </Text>
            <GradeBadge grade={first.grade} size="medium" />
          </View>

          <View style={styles.podiumItem}>
            <View style={[styles.avatarContainer, styles.bronzeRing]}>
              <Image source={{ uri: third.avatar }} style={styles.podiumAvatar} />
              <View style={[styles.rankBadge, { backgroundColor: '#CD7F32' }]}>
                <Text style={styles.rankBadgeText}>3</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { color: colors.text }]} numberOfLines={1}>
              {third.name}
            </Text>
            <Text style={[styles.podiumPoints, { color: colors.primary }]}>
              {third.points.toLocaleString()}
            </Text>
            <GradeBadge grade={third.grade} size="small" />
          </View>
        </View>
      </View>
    );
  };

  const renderUserRow = ({ item, index }: { item: LeaderboardUser; index: number }) => {
    if (index < 3) return null;

    const isCurrentUser = item.rank === currentUserRank;

    return (
      <View
        style={[
          styles.userRow,
          { backgroundColor: isCurrentUser ? colors.primary + '10' : colors.surface },
        ]}
      >
        <Text style={[styles.rankNumber, { color: colors.textSecondary }]}>
          #{item.rank}
        </Text>
        
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <GradeBadge grade={item.grade} size="small" />
        </View>
        
        <Text style={[styles.userPoints, { color: colors.primary }]}>
          {item.points.toLocaleString()}
        </Text>
      </View>
    );
  };

  const renderScopeTab = (tab: typeof scopeTabs[0]) => {
    const isSelected = selectedScope === tab.key;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tab,
          {
            backgroundColor: isSelected ? colors.primary : 'transparent',
            borderBottomWidth: isSelected ? 0 : 1,
            borderBottomColor: colors.border,
          },
        ]}
        onPress={() => setSelectedScope(tab.key)}
      >
        <Text
          style={[
            styles.tabText,
            { color: isSelected ? '#FFFFFF' : colors.textSecondary },
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeTab = (tab: typeof timeTabs[0]) => {
    const isSelected = selectedTime === tab.key;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.timeTab,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
          },
        ]}
        onPress={() => setSelectedTime(tab.key)}
      >
        <Text
          style={[
            styles.timeTabText,
            { color: isSelected ? '#FFFFFF' : colors.text },
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('leaderboard.title')}
        </Text>
      </View>

      <View style={styles.scopeTabs}>
        {scopeTabs.map(renderScopeTab)}
      </View>

      <View style={styles.timeTabs}>
        {timeTabs.map(renderTimeTab)}
      </View>

      <FlatList
        data={users}
        renderItem={renderUserRow}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderPodium}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <View style={[styles.bottomBar, { backgroundColor: colors.primary }]}>
        <Text style={styles.bottomBarText}>
          {t('leaderboard.your_rank')} #{currentUserRank}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  scopeTabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  timeTabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  timeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  podiumContainer: {
    padding: 24,
    paddingTop: 32,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  firstPlace: {
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  goldRing: {
    borderWidth: 4,
    borderColor: '#FFD700',
    borderRadius: 50,
    padding: 4,
  },
  silverRing: {
    borderWidth: 3,
    borderColor: '#C0C0C0',
    borderRadius: 40,
    padding: 3,
  },
  bronzeRing: {
    borderWidth: 3,
    borderColor: '#CD7F32',
    borderRadius: 40,
    padding: 3,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  crownIcon: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
    width: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
  },
  userPoints: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bottomBarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
