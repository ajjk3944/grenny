import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { StatusBadge } from '../ui/StatusBadge';
import { formatNumber } from '../../utils/format';

interface Activity {
  id: string;
  thumbnail?: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const locale = i18n.language;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {locale === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity'}
      </Text>

      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="leaf-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {locale === 'bn' ? 'এখনও কোন কার্যক্রম নেই' : 'No activities yet'}
          </Text>
        </View>
      ) : (
        <>
          {activities.slice(0, 3).map((activity) => (
            <View key={activity.id} style={[styles.activityItem, { borderBottomColor: colors.border }]}>
              <View style={styles.thumbnail}>
                {activity.thumbnail ? (
                  <Image source={{ uri: activity.thumbnail }} style={styles.thumbnailImage} />
                ) : (
                  <View style={[styles.thumbnailPlaceholder, { backgroundColor: colors.border }]}>
                    <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                  </View>
                )}
              </View>

              <View style={styles.activityInfo}>
                <Text style={[styles.category, { color: colors.text }]} numberOfLines={1}>
                  {activity.category}
                </Text>
                <View style={styles.statusRow}>
                  <StatusBadge status={activity.status} />
                  {activity.status === 'approved' && (
                    <Text style={[styles.points, { color: colors.primary }]}>
                      +{formatNumber(activity.points, locale)} {locale === 'bn' ? 'পয়েন্ট' : 'pts'}
                    </Text>
                  )}
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          ))}

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Text style={[styles.viewAllText, { color: colors.primary }]}>
              {locale === 'bn' ? 'সব দেখুন' : 'View All'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  thumbnail: {
    marginRight: 12,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  points: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
