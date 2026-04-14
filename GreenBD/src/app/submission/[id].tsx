import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Activity } from '../../types';
import { historyService } from '../../services/historyService';
import { Ionicons } from '@expo/vector-icons';
import { StatusBadge } from '../../components/ui/StatusBadge';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function SubmissionDetailScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = async () => {
    try {
      const data = await historyService.getActivityById(id as string);
      setActivity(data);
    } catch (error) {
      console.error('Failed to load activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !activity) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('history.submission_detail')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: activity.mediaUris[0] }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.categoryRow}>
            <Ionicons name={activity.categoryIcon as any} size={24} color={colors.primary} />
            <Text style={[styles.categoryName, { color: colors.text }]}>
              {activity.categoryNameBn}
            </Text>
          </View>

          <Text style={[styles.summary, { color: colors.textSecondary }]}>
            {activity.summary}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {new Date(activity.submittedAt).toLocaleDateString('bn-BD', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('history.ai_review')}
          </Text>
          
          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Status:
            </Text>
            <StatusBadge status={activity.status} />
          </View>

          {activity.status === 'rejected' && activity.rejectionReason && (
            <View style={[styles.rejectionBox, { backgroundColor: colors.error + '10' }]}>
              <Ionicons name="alert-circle" size={20} color={colors.error} />
              <Text style={[styles.rejectionText, { color: colors.error }]}>
                {activity.rejectionReason}
              </Text>
            </View>
          )}

          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {t('history.ai_confidence')}:
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {activity.aiConfidence}%
            </Text>
          </View>

          {activity.reviewedAt && (
            <View style={styles.statusRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {t('history.reviewed_at')}:
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {new Date(activity.reviewedAt).toLocaleDateString('bn-BD')}
              </Text>
            </View>
          )}
        </View>

        {activity.status === 'verified' && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('history.points_breakdown')}
            </Text>
            
            <View style={styles.pointsRow}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {t('history.base_points')}:
              </Text>
              <Text style={[styles.pointsValue, { color: colors.text }]}>
                {activity.basePoints}
              </Text>
            </View>

            {activity.bonusPoints > 0 && (
              <View style={styles.pointsRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  {t('history.bonus_points')}:
                </Text>
                <Text style={[styles.pointsValue, { color: colors.success }]}>
                  +{activity.bonusPoints}
                </Text>
              </View>
            )}

            <View style={[styles.pointsRow, styles.totalRow]}>
              <Text style={[styles.label, { color: colors.text, fontWeight: '700' }]}>
                {t('history.total_points')}:
              </Text>
              <Text style={[styles.totalPoints, { color: colors.success }]}>
                {activity.points}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            GPS Location
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: activity.location.lat,
                longitude: activity.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: activity.location.lat,
                  longitude: activity.location.lng,
                }}
              />
            </MapView>
          </View>
          {activity.location.address && (
            <Text style={[styles.address, { color: colors.textSecondary }]}>
              {activity.location.address}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    paddingBottom: 24,
  },
  mainImage: {
    width: width,
    height: width,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  rejectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rejectionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalPoints: {
    fontSize: 24,
    fontWeight: '700',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  map: {
    flex: 1,
  },
  address: {
    fontSize: 14,
  },
});
