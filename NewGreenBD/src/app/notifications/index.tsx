import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { Notification } from '../../types';
import * as notificationService from '../../services/notifications';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }

    // Navigate based on notification type
    if (notification.data?.submissionId) {
      router.push(`/submission/${notification.data.submissionId}`);
    } else if (notification.data?.challengeId) {
      router.push('/challenges');
    }
  };

  const groupNotificationsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { title: string; data: Notification[] }[] = [];
    const todayNotifs: Notification[] = [];
    const yesterdayNotifs: Notification[] = [];
    const olderNotifs: Record<string, Notification[]> = {};

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.createdAt);
      const notifDateStr = notifDate.toDateString();

      if (notifDateStr === today.toDateString()) {
        todayNotifs.push(notif);
      } else if (notifDateStr === yesterday.toDateString()) {
        yesterdayNotifs.push(notif);
      } else {
        const dateKey = notifDate.toLocaleDateString('bn-BD', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        if (!olderNotifs[dateKey]) {
          olderNotifs[dateKey] = [];
        }
        olderNotifs[dateKey].push(notif);
      }
    });

    if (todayNotifs.length > 0) {
      groups.push({ title: t('notifications.today'), data: todayNotifs });
    }
    if (yesterdayNotifs.length > 0) {
      groups.push({ title: t('notifications.yesterday'), data: yesterdayNotifs });
    }
    Object.entries(olderNotifs).forEach(([date, notifs]) => {
      groups.push({ title: date, data: notifs });
    });

    return groups;
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const icon = notificationService.getNotificationIcon(item.type);
    const color = notificationService.getNotificationColor(item.type);
    const time = new Date(item.createdAt).toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          { backgroundColor: colors.card },
          !item.read && { backgroundColor: colors.primary + '10' },
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.titleBn}
            </Text>
            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </View>

          <Text style={[styles.body, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.bodyBn}
          </Text>

          <Text style={[styles.time, { color: colors.textTertiary }]}>{time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {section.title}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const groupedNotifications = groupNotificationsByDate();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('notifications.title')}
        </Text>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              {t('notifications.mark_all_read')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t('notifications.no_notifications')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedNotifications}
          renderItem={({ item: section }) => (
            <View>
              {renderSectionHeader({ section })}
              {section.data.map((notif) => (
                <View key={notif.id}>{renderNotification({ item: notif })}</View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item.title}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    flexGrow: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  body: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
