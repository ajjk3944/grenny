import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { Activity } from '../../types';
import { historyService } from '../../services/historyService';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '../../components/ui/StatusBadge';

type FilterStatus = 'all' | 'verified' | 'pending' | 'rejected' | 'uploading';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>('all');

  const filters: { key: FilterStatus; label: string; color: string }[] = [
    { key: 'all', label: t('history.all'), color: colors.text },
    { key: 'verified', label: t('history.approved'), color: colors.success },
    { key: 'pending', label: t('history.pending'), color: colors.warning },
    { key: 'rejected', label: t('history.rejected'), color: colors.error },
    { key: 'uploading', label: t('history.uploading'), color: colors.accent },
  ];

  const loadActivities = async () => {
    try {
      const data = await historyService.getActivities();
      setActivities(data);
      filterActivities(data, selectedFilter);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterActivities = (data: Activity[], filter: FilterStatus) => {
    if (filter === 'all') {
      setFilteredActivities(data);
    } else {
      setFilteredActivities(data.filter(a => a.status === filter));
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    filterActivities(activities, filter);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  const handleActivityPress = (activity: Activity) => {
    router.push(`/submission/${activity.id}`);
  };

  const renderFilterPill = ({ item }: { item: typeof filters[0] }) => {
    const isSelected = selectedFilter === item.key;
    
    return (
      <TouchableOpacity
        style={[
          styles.filterPill,
          {
            backgroundColor: isSelected ? item.color : colors.surface,
            borderColor: item.color,
          },
        ]}
        onPress={() => handleFilterChange(item.key)}
      >
        <Text
          style={[
            styles.filterText,
            { color: isSelected ? '#FFFFFF' : item.color },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderActivityCard = ({ item }: { item: Activity }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => handleActivityPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.mediaUris[0] }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      
      <View style={styles.cardContent}>
        <View style={styles.categoryRow}>
          <Ionicons name={item.categoryIcon as any} size={16} color={colors.primary} />
          <Text style={[styles.categoryText, { color: colors.text }]}>
            {item.categoryNameBn}
          </Text>
        </View>
        
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          {new Date(item.submittedAt).toLocaleDateString('bn-BD', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        
        <Text
          style={[styles.summaryText, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.summary}
        </Text>
      </View>
      
      <View style={styles.cardRight}>
        <Text
          style={[
            styles.pointsText,
            { color: item.status === 'verified' ? colors.success : colors.textSecondary },
          ]}
        >
          {item.status === 'verified' ? `+${item.points}` : '—'}
        </Text>
        <StatusBadge status={item.status} />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="camera-outline" size={80} color={colors.border} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {t('history.no_activities')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {t('history.first_capture')}
      </Text>
      <View style={styles.arrowContainer}>
        <Ionicons name="arrow-down" size={32} color={colors.primary} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('history.title')}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filters}
          renderItem={renderFilterPill}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredActivities}
        renderItem={renderActivityCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!loading ? renderEmptyState : null}
      />
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
  filterContainer: {
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  arrowContainer: {
    marginTop: 24,
  },
});
