import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { formatNumber } from '../../utils/format';

interface Benefit {
  id: string;
  titleBn: string;
  titleEn: string;
  requiredPoints: number;
  icon: string;
}

interface BenefitsPreviewProps {
  benefits: Benefit[];
  userPoints: number;
}

export const BenefitsPreview: React.FC<BenefitsPreviewProps> = ({ benefits, userPoints }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const locale = i18n.language;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {locale === 'bn' ? 'উপলব্ধ সুবিধা' : 'Available Benefits'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {benefits.map((benefit) => {
          const canRedeem = userPoints >= benefit.requiredPoints;
          return (
            <TouchableOpacity
              key={benefit.id}
              style={[styles.benefitCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/benefits')}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Ionicons name={benefit.icon as any} size={32} color={colors.primary} />
              </View>
              <Text style={[styles.benefitTitle, { color: colors.text }]} numberOfLines={2}>
                {locale === 'bn' ? benefit.titleBn : benefit.titleEn}
              </Text>
              <Text style={[styles.pointsRequired, { color: colors.textSecondary }]}>
                {formatNumber(benefit.requiredPoints, locale)} {locale === 'bn' ? 'পয়েন্ট' : 'points'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.redeemButton,
                  { backgroundColor: canRedeem ? colors.primary : colors.border },
                ]}
                disabled={!canRedeem}
              >
                <Text style={[styles.redeemText, { color: canRedeem ? '#FFFFFF' : colors.textSecondary }]}>
                  {locale === 'bn' ? 'রিডিম করুন' : 'Redeem'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.viewAllButton}
        onPress={() => router.push('/benefits')}
      >
        <Text style={[styles.viewAllText, { color: colors.primary }]}>
          {locale === 'bn' ? 'সব সুবিধা দেখুন' : 'See All Benefits'}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  benefitCard: {
    width: 160,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    minHeight: 36,
  },
  pointsRequired: {
    fontSize: 12,
    marginBottom: 12,
  },
  redeemButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  redeemText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});
