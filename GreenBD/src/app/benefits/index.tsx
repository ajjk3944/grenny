import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { usePointsStore } from '../../store/pointsStore';
import { Benefit } from '../../types';
import { benefitsService } from '../../services/benefitsService';
import { Ionicons } from '@expo/vector-icons';
import { GradeBadge } from '../../components/dashboard/GradeBadge';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

type Category = 'all' | 'education' | 'employment' | 'healthcare' | 'transport' | 'financial' | 'utilities';

export default function BenefitsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { totalPoints, grade } = usePointsStore();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const categories: { key: Category; label: string; icon: string }[] = [
    { key: 'all', label: t('benefits.categories.all'), icon: 'apps' },
    { key: 'education', label: t('benefits.categories.education'), icon: 'school' },
    { key: 'employment', label: t('benefits.categories.employment'), icon: 'briefcase' },
    { key: 'healthcare', label: t('benefits.categories.healthcare'), icon: 'medical' },
    { key: 'transport', label: t('benefits.categories.transport'), icon: 'bus' },
    { key: 'financial', label: t('benefits.categories.financial'), icon: 'cash' },
    { key: 'utilities', label: t('benefits.categories.utilities'), icon: 'flash' },
  ];

  const loadBenefits = async () => {
    try {
      const data = await benefitsService.getBenefits(selectedCategory);
      setBenefits(data);
      setFilteredBenefits(data);
    } catch (error) {
      console.error('Failed to load benefits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadBenefits();
  }, [selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadBenefits();
  };

  const canRedeem = (benefit: Benefit): { can: boolean; reason?: string } => {
    if (totalPoints < benefit.requiredPoints) {
      const needed = benefit.requiredPoints - totalPoints;
      return {
        can: false,
        reason: t('benefits.need_more_points', { points: needed }),
      };
    }

    const gradeOrder = ['D', 'C', 'B', 'B+', 'A', 'A+'];
    const userGradeIndex = gradeOrder.indexOf(grade);
    const requiredGradeIndex = gradeOrder.indexOf(benefit.requiredGrade);

    if (userGradeIndex < requiredGradeIndex) {
      return {
        can: false,
        reason: t('benefits.need_grade', { grade: benefit.requiredGrade }),
      };
    }

    return { can: true };
  };

  const handleRedeemPress = (benefit: Benefit) => {
    setSelectedBenefit(benefit);
    setShowRedeemModal(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedBenefit) return;

    setRedeeming(true);
    try {
      const result = await benefitsService.redeemBenefit(
        selectedBenefit.id,
        totalPoints,
        grade
      );

      if (result.success) {
        setShowRedeemModal(false);
        // Show success message
        alert(t('benefits.redeem_success'));
        // Refresh benefits
        loadBenefits();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Redeem error:', error);
      alert('Failed to redeem benefit');
    } finally {
      setRedeeming(false);
    }
  };

  const renderCategoryTab = ({ item }: { item: typeof categories[0] }) => {
    const isSelected = selectedCategory === item.key;

    return (
      <TouchableOpacity
        style={[
          styles.categoryTab,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
          },
        ]}
        onPress={() => setSelectedCategory(item.key)}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={isSelected ? '#FFFFFF' : colors.text}
        />
        <Text
          style={[
            styles.categoryText,
            { color: isSelected ? '#FFFFFF' : colors.text },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBenefitCard = ({ item }: { item: Benefit }) => {
    const redeemStatus = canRedeem(item);

    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={item.icon as any} size={32} color={colors.primary} />
        </View>

        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
          {item.titleBn}
        </Text>

        <View style={styles.requirementRow}>
          <Ionicons name="star" size={14} color={colors.warning} />
          <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
            {item.requiredPoints} {t('benefits.required_points')}
          </Text>
        </View>

        <View style={styles.requirementRow}>
          <GradeBadge grade={item.requiredGrade} size="small" />
          <Text style={[styles.requirementText, { color: colors.textSecondary }]}>
            {t('benefits.required_grade')}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.redeemButton,
            {
              backgroundColor: redeemStatus.can ? colors.primary : colors.border,
            },
          ]}
          onPress={() => handleRedeemPress(item)}
          disabled={!redeemStatus.can}
        >
          <Text
            style={[
              styles.redeemButtonText,
              { color: redeemStatus.can ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            {redeemStatus.can ? t('benefits.redeem') : redeemStatus.reason}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('benefits.title')}
        </Text>
      </View>

      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.pointsBanner}
      >
        <Text style={styles.pointsLabel}>
          {t('benefits.your_points')}
        </Text>
        <Text style={styles.pointsValue}>
          {totalPoints.toLocaleString()}
        </Text>
        <GradeBadge grade={grade} size="medium" />
      </LinearGradient>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryTab}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />

      <FlatList
        data={filteredBenefits}
        renderItem={renderBenefitCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <Modal
        visible={showRedeemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('benefits.confirm_redeem')}
            </Text>

            {selectedBenefit && (
              <>
                <View style={[styles.modalIconCircle, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name={selectedBenefit.icon as any} size={48} color={colors.primary} />
                </View>

                <Text style={[styles.modalBenefitTitle, { color: colors.text }]}>
                  {selectedBenefit.titleBn}
                </Text>

                <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                  {selectedBenefit.descriptionBn}
                </Text>

                <View style={[styles.modalInfo, { backgroundColor: colors.background }]}>
                  <Text style={[styles.modalInfoText, { color: colors.textSecondary }]}>
                    {t('benefits.points_will_be_deducted', { points: selectedBenefit.requiredPoints })}
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.border }]}
                    onPress={() => setShowRedeemModal(false)}
                    disabled={redeeming}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.text }]}>
                      {t('common.cancel')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.primary }]}
                    onPress={handleConfirmRedeem}
                    disabled={redeeming}
                  >
                    <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                      {redeeming ? t('common.loading') : t('common.confirm')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  pointsBanner: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridContent: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    minHeight: 40,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
  },
  redeemButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  redeemButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 64,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalBenefitTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  modalInfoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
