import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';

type TimePeriod = 'today' | 'weekly' | 'monthly' | 'yearly';

interface TimeFilterTabsProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}

export const TimeFilterTabs: React.FC<TimeFilterTabsProps> = ({ selected, onSelect }) => {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const locale = i18n.language;

  const tabs: { key: TimePeriod; labelBn: string; labelEn: string }[] = [
    { key: 'today', labelBn: 'আজ', labelEn: 'Today' },
    { key: 'weekly', labelBn: 'সাপ্তাহিক', labelEn: 'Weekly' },
    { key: 'monthly', labelBn: 'মাসিক', labelEn: 'Monthly' },
    { key: 'yearly', labelBn: 'বাৎসরিক', labelEn: 'Yearly' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isSelected = selected === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={[
              styles.tab,
              isSelected
                ? { backgroundColor: colors.primary }
                : { backgroundColor: 'transparent', borderColor: colors.primary, borderWidth: 1 },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isSelected ? '#FFFFFF' : colors.primary },
              ]}
            >
              {locale === 'bn' ? tab.labelBn : tab.labelEn}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
