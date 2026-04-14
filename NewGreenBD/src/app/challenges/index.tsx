import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { Challenge } from '../../types';
import * as challengeService from '../../services/challenges';

export default function ChallengesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [activeTab, setActiveTab] = useState<'active' | 'my' | 'completed'>('active');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, [activeTab]);

  const loadChallenges = async () => {
    try {
      const data = await challengeService.getChallenges(activeTab);
      setChallenges(data);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChallenges();
    setRefreshing(false);
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      await challengeService.joinChallenge(challengeId);
      await loadChallenges();
    } catch (error) {
      console.error('Failed to join challenge:', error);
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} ${t('challenges.days_left')}`;
    } else if (hours > 0) {
      return `${hours} ${t('challenges.hours_left')}`;
    }
    return t('common.ending_soon');
  };

  const renderChallengeCard = (challenge: Challenge) => {
    const progress = (challenge.currentCount / challenge.targetCount) * 100;

    return (
      <View key={challenge.id} style={[styles.challengeCard, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Ionicons name="flag" size={20} color={colors.primary} />
            <Text style={[styles.challengeTitle, { color: colors.text }]} numberOfLines={2}>
              {challenge.titleBn}
            </Text>
          </View>
          {challenge.pointMultiplier > 1 && (
            <View style={[styles.bonusBadge, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.bonusText}>{challenge.pointMultiplier}x</Text>
            </View>
          )}
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {challenge.descriptionBn}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: colors.text }]}>
              {challenge.currentCount}/{challenge.targetCount}
            </Text>
            <Text style={[styles.timeRemaining, { color: colors.textSecondary }]}>
              {getTimeRemaining(challenge.endDate)}
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.participantsRow}>
            <View style={styles.avatarStack}>
              {challenge.participantAvatars.slice(0, 3).map((avatar, index) => (
                <Image
                  key={index}
                  source={{ uri: avatar }}
                  style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0 }]}
                />
              ))}
            </View>
            <Text style={[styles.participantCount, { color: colors.textSecondary }]}>
              {challenge.participantCount} {t('challenges.participants')}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: challenge.userJoined ? colors.border : colors.primary,
              },
            ]}
            onPress={() => !challenge.userJoined && handleJoinChallenge(challenge.id)}
            disabled={challenge.userJoined}
          >
            <Text
              style={[
                styles.joinButtonText,
                { color: challenge.userJoined ? colors.textSecondary : '#fff' },
              ]}
            >
              {challenge.userJoined ? t('challenges.joined') : t('challenges.join')}
            </Text>
          </TouchableOpacity>
        </View>

        {challenge.userJoined && challenge.userProgress !== undefined && (
          <View style={[styles.userProgressBar, { backgroundColor: colors.background }]}>
            <Text style={[styles.userProgressText, { color: colors.text }]}>
              {t('challenges.your_progress')}: {challenge.userProgress}/{challenge.targetCount}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('challenges.title')}
        </Text>
      </View>

      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(['active', 'my', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && [styles.activeTab, { borderBottomColor: colors.primary }],
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.primary : colors.textSecondary },
              ]}
            >
              {t(`challenges.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {challenges.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="flag-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('challenges.no_challenges')}
              </Text>
            </View>
          ) : (
            challenges.map(renderChallengeCard)
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  challengeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  bonusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeRemaining: {
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  participantCount: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  userProgressBar: {
    marginTop: 12,
    padding: 8,
    borderRadius: 8,
  },
  userProgressText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});
