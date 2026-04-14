import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { EducationalContent } from '../../types';
import * as educationalService from '../../services/educational';

const CATEGORIES = [
  'all',
  'tree_planting',
  'waste_management',
  'climate_change',
  'biodiversity',
  'water_conservation',
  'general',
];

export default function EducationalScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [selectedCategory]);

  const loadContent = async () => {
    try {
      const data = await educationalService.getEducationalContent(
        selectedCategory !== 'all' ? selectedCategory : undefined
      );
      setContent(data);
    } catch (error) {
      console.error('Failed to load content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: EducationalContent['type']): string => {
    const icons = {
      article: 'document-text',
      video: 'play-circle',
      quiz: 'help-circle',
    };
    return icons[type];
  };

  const getTypeColor = (type: EducationalContent['type']): string => {
    const colors = {
      article: '#3b82f6',
      video: '#ef4444',
      quiz: '#8b5cf6',
    };
    return colors[type];
  };

  const renderContentCard = (item: EducationalContent) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.contentCard, { backgroundColor: colors.card }]}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      
      <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
        <Ionicons name={getTypeIcon(item.type) as any} size={14} color="#fff" />
        <Text style={styles.typeText}>{t(`educational.types.${item.type}`)}</Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.contentTitle, { color: colors.text }]} numberOfLines={2}>
          {item.titleBn}
        </Text>
        
        <Text style={[styles.contentDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.descriptionBn}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>
              {item.readTime
                ? `${item.readTime} ${t('educational.minutes')}`
                : `${item.duration} ${t('educational.minutes')}`}
            </Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
            <Text style={[styles.categoryBadgeText, { color: colors.textSecondary }]}>
              {t(`educational.categories.${item.category}`)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('educational.title')}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === cat ? colors.primary : colors.card,
              },
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategory === cat ? '#fff' : colors.text },
              ]}
            >
              {t(`educational.categories.${cat}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {content.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {t('educational.no_content')}
              </Text>
            </View>
          ) : (
            content.map(renderContentCard)
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
  categoryScroll: {
    maxHeight: 60,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  contentCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
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
