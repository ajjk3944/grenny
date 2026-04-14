import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/themeStore';
import { AppConfig, ActivityCategory } from '@/types';
import { getAppConfig, updateAppConfig } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await getAppConfig();
      setConfig(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await updateAppConfig(config);
      Alert.alert(t('common.success'), 'Settings saved successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = (categoryId: string, updates: Partial<ActivityCategory>) => {
    if (!config) return;

    setConfig({
      ...config,
      categories: config.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      ),
    });
  };

  if (loading || !config) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        {/* General Settings */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('admin.general_settings')}
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('admin.max_daily_submissions')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Maximum submissions per user per day
              </Text>
            </View>
            <TextInput
              style={[styles.numberInput, { backgroundColor: colors.background, color: colors.text }]}
              value={String(config.maxDailySubmissions)}
              onChangeText={text =>
                setConfig({ ...config, maxDailySubmissions: parseInt(text) || 0 })
              }
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t('admin.cooldown_minutes')}
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Cooldown period between submissions
              </Text>
            </View>
            <TextInput
              style={[styles.numberInput, { backgroundColor: colors.background, color: colors.text }]}
              value={String(config.submissionCooldownMinutes)}
              onChangeText={text =>
                setConfig({ ...config, submissionCooldownMinutes: parseInt(text) || 0 })
              }
              keyboardType="number-pad"
            />
          </View>
        </Card>

        {/* Activity Categories */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('admin.activity_categories')}
            </Text>
          </View>

          {config.categories.map(category => (
            <View key={category.id} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <View style={styles.categoryInfo}>
                  <Text style={[styles.categoryName, { color: colors.text }]}>
                    {category.nameBn} / {category.nameEn}
                  </Text>
                  <View style={styles.categoryMeta}>
                    <Text style={[styles.categoryPoints, { color: colors.primary }]}>
                      {category.basePoints} {t('admin.base_points')}
                    </Text>
                    {category.bonusConditions.length > 0 && (
                      <Text style={[styles.categoryBonus, { color: colors.textSecondary }]}>
                        +{category.bonusConditions.length} {t('admin.bonus_conditions')}
                      </Text>
                    )}
                  </View>
                </View>
                <Switch
                  value={category.active}
                  onValueChange={value => updateCategory(category.id, { active: value })}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>

              <View style={styles.categoryControls}>
                <View style={styles.pointsControl}>
                  <Text style={[styles.controlLabel, { color: colors.textSecondary }]}>
                    {t('admin.base_points')}:
                  </Text>
                  <TextInput
                    style={[
                      styles.smallNumberInput,
                      { backgroundColor: colors.background, color: colors.text },
                    ]}
                    value={String(category.basePoints)}
                    onChangeText={text =>
                      updateCategory(category.id, { basePoints: parseInt(text) || 0 })
                    }
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Grade Thresholds */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('admin.grade_thresholds')}
          </Text>

          {config.gradeThresholds.map((threshold, index) => (
            <View key={threshold.grade} style={styles.gradeItem}>
              <View style={styles.gradeInfo}>
                <Text style={[styles.gradeName, { color: colors.text }]}>{threshold.grade}</Text>
                <Text style={[styles.gradeRange, { color: colors.textSecondary }]}>
                  {threshold.minPoints}
                  {threshold.maxPoints ? ` - ${threshold.maxPoints}` : '+'} points
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Benefits */}
        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('admin.benefits_rewards')}
          </Text>

          {config.benefits.map(benefit => (
            <View key={benefit.id} style={styles.benefitItem}>
              <View style={styles.benefitHeader}>
                <View style={styles.benefitInfo}>
                  <Text style={[styles.benefitTitle, { color: colors.text }]}>
                    {benefit.titleBn} / {benefit.titleEn}
                  </Text>
                  <Text style={[styles.benefitDescription, { color: colors.textSecondary }]}>
                    {benefit.descriptionBn}
                  </Text>
                  <View style={styles.benefitMeta}>
                    <Text style={[styles.benefitRequirement, { color: colors.primary }]}>
                      {benefit.requiredPoints} pts • Grade {benefit.requiredGrade}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={benefit.active}
                  onValueChange={value => {
                    setConfig({
                      ...config,
                      benefits: config.benefits.map(b =>
                        b.id === benefit.id ? { ...b, active: value } : b
                      ),
                    });
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                />
              </View>
            </View>
          ))}
        </Card>

        <View style={styles.saveButtonContainer}>
          <Button
            title={saving ? t('common.loading') : t('common.save')}
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  numberInput: {
    width: 80,
    padding: 8,
    borderRadius: 6,
    fontSize: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryPoints: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryBonus: {
    fontSize: 13,
  },
  categoryControls: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 40,
  },
  pointsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    fontSize: 13,
  },
  smallNumberInput: {
    width: 60,
    padding: 6,
    borderRadius: 6,
    fontSize: 14,
    textAlign: 'center',
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  gradeInfo: {
    flex: 1,
  },
  gradeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gradeRange: {
    fontSize: 14,
  },
  benefitItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 13,
    marginBottom: 6,
  },
  benefitMeta: {
    flexDirection: 'row',
  },
  benefitRequirement: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveButtonContainer: {
    paddingVertical: 16,
  },
  saveButton: {
    paddingVertical: 16,
  },
});
