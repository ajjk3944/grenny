import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { formatNumber } from '../../utils/format';
import { UserStats, UserRank } from '../../store/pointsStore';

interface QuickStatsProps {
  stats: UserStats;
  streak: number;
  rank: UserRank;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats, streak, rank }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const locale = i18n.language;

  const statItems = [
    {
      icon: 'leaf' as const,
      value: stats.treesPlanted,
      labelBn: 'গাছ রোপণ',
      labelEn: 'Trees Planted',
      color: '#4CAF50',
    },
    {
      icon: 'trash' as const,
      value: stats.cleanups,
      labelBn: 'পরিচ্ছন্নতা',
      labelEn: 'Cleanups',
      color: '#2196F3',
    },
    {
      icon: 'flame' as const,
      value: streak,
      labelBn: 'দিন স্ট্রিক',
      labelEn: 'Day Streak',
      color: '#FF5722',
    },
    {
      icon: 'trophy' as const,
      value: rank.district,
      labelBn: 'জেলা র‍্যাঙ্ক',
      labelEn: 'District Rank',
      color: '#FFD700',
    },
  ];

  return (
    <View style={styles.container}>
      {statItems.map((item, index) => (
        <View key={index} style={[styles.statCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
            <Ionicons name={item.icon} size={24} color={item.color} />
          </View>
          <Text style={[styles.value, { color: colors.text }]}>
            {formatNumber(item.value, locale)}
          </Text>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {locale === 'bn' ? item.labelBn : item.labelEn}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
