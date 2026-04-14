import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { GradeBadge } from './GradeBadge';
import { formatNumber } from '../../utils/format';

interface LeaderUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  grade: string;
}

interface LeaderboardPreviewProps {
  topUsers: LeaderUser[];
}

export const LeaderboardPreview: React.FC<LeaderboardPreviewProps> = ({ topUsers }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const locale = i18n.language;

  const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  const podiumHeights = [100, 80, 70];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('nav.leaderboard')}
      </Text>

      <View style={styles.podium}>
        {[1, 0, 2].map((index) => {
          const user = topUsers[index];
          if (!user) return null;

          return (
            <View key={user.id} style={styles.podiumItem}>
              <View style={styles.userInfo}>
                <View style={[styles.avatarContainer, { borderColor: podiumColors[index] }]}>
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                      <Text style={styles.avatarText}>{user.name[0]}</Text>
                    </View>
                  )}
                  <View style={[styles.rankBadge, { backgroundColor: podiumColors[index] }]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                </View>
                <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={[styles.userPoints, { color: colors.textSecondary }]}>
                  {formatNumber(user.points, locale)} {locale === 'bn' ? 'পয়েন্ট' : 'pts'}
                </Text>
                <View style={styles.gradeBadgeContainer}>
                  <GradeBadge grade={user.grade} size="small" />
                </View>
              </View>
              <View
                style={[
                  styles.podiumBase,
                  {
                    height: podiumHeights[index],
                    backgroundColor: `${podiumColors[index]}30`,
                    borderTopColor: podiumColors[index],
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.viewAllButton, { borderColor: colors.primary }]}
        onPress={() => router.push('/leaderboard')}
      >
        <Text style={[styles.viewAllText, { color: colors.primary }]}>
          {locale === 'bn' ? 'সম্পূর্ণ লিডারবোর্ড দেখুন' : 'View Full Leaderboard'}
        </Text>
      </TouchableOpacity>
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
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    borderWidth: 3,
    borderRadius: 35,
    padding: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
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
  rankText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    maxWidth: 100,
  },
  userPoints: {
    fontSize: 12,
    marginTop: 2,
  },
  gradeBadgeContainer: {
    marginTop: 4,
  },
  podiumBase: {
    width: '100%',
    borderTopWidth: 3,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  viewAllButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
