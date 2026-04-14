import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import { Submission } from '../../types';
import * as securityService from '../../services/security';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TopBar } from '../../components/TopBar';

export default function ReviewQueueScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadSubmissions();
  }, [filterStatus]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await securityService.getSubmissions({
        status: filterStatus === 'all' ? undefined : filterStatus,
      });
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to load submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    const priority = { flagged: 3, pending: 2, verified: 1, rejected: 0 };
    return priority[b.aiReview.status] - priority[a.aiReview.status];
  });

  const handleApprove = async () => {
    if (!selectedSubmission || !user) return;
    try {
      await securityService.approveSubmission(selectedSubmission.id, user.id);
      setSelectedSubmission(null);
      loadSubmissions();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !user) return;
    const reason = rejectReason === 'other' ? customReason : rejectReason;
    if (!reason) return;

    try {
      await securityService.rejectSubmission(selectedSubmission.id, user.id, reason);
      setShowRejectModal(false);
      setSelectedSubmission(null);
      setRejectReason('');
      setCustomReason('');
      loadSubmissions();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return colors.success;
      case 'flagged':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return t('security.ai_verified');
      case 'flagged':
        return t('security.suspicious');
      case 'pending':
        return t('security.needs_review');
      default:
        return status;
    }
  };

  const renderSubmissionCard = ({ item }: { item: Submission }) => (
    <TouchableOpacity onPress={() => setSelectedSubmission(item)}>
      <Card style={styles.submissionCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            {item.userAvatar && (
              <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
            )}
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{item.userName}</Text>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                {new Date(item.timestamp).toLocaleString('bn-BD')}
              </Text>
            </View>
          </View>
          <Badge
            text={getStatusText(item.aiReview.status)}
            variant={item.aiReview.status === 'verified' ? 'success' : item.aiReview.status === 'flagged' ? 'error' : 'warning'}
          />
        </View>

        <Image source={{ uri: item.mediaUrls[0] }} style={styles.thumbnail} />

        <View style={styles.cardContent}>
          <View style={styles.categoryRow}>
            <Text style={[styles.category, { color: colors.primary }]}>{item.category}</Text>
            <Text style={[styles.confidence, { color: colors.textSecondary }]}>
              {t('security.ai_confidence')}: {item.aiReview.confidence}%
            </Text>
          </View>
          <Text style={[styles.summary, { color: colors.text }]} numberOfLines={2}>
            {item.summary}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={!!selectedSubmission}
      animationType="slide"
      onRequestClose={() => setSelectedSubmission(null)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setSelectedSubmission(null)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{t('security.submission_details')}</Text>
          <View style={{ width: 24 }} />
        </View>

        {selectedSubmission && (
          <ScrollView style={styles.modalContent}>
            <Image source={{ uri: selectedSubmission.mediaUrls[0] }} style={styles.fullImage} />

            <Card style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('security.user_info')}</Text>
              <View style={styles.userDetailRow}>
                {selectedSubmission.userAvatar && (
                  <Image source={{ uri: selectedSubmission.userAvatar }} style={styles.avatarLarge} />
                )}
                <View>
                  <Text style={[styles.userNameLarge, { color: colors.text }]}>
                    {selectedSubmission.userName}
                  </Text>
                  <Text style={[styles.userStats, { color: colors.textSecondary }]}>
                    {t('security.submission_count')}: 12 | {t('admin.grade')}: A+
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('security.submission_details')}</Text>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('common.category')}:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSubmission.category}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('capture.add_description')}:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedSubmission.summary}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('security.gps_location')}:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {selectedSubmission.location.address}
                </Text>
              </View>
            </Card>

            <Card style={styles.detailSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('security.ai_analysis')}</Text>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('common.status')}:</Text>
                <Badge
                  text={getStatusText(selectedSubmission.aiReview.status)}
                  variant={selectedSubmission.aiReview.status === 'verified' ? 'success' : selectedSubmission.aiReview.status === 'flagged' ? 'error' : 'warning'}
                />
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('security.ai_confidence')}:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {selectedSubmission.aiReview.confidence}%
                </Text>
              </View>
              <Text style={[styles.aiDetails, { color: colors.text }]}>
                {selectedSubmission.aiReview.details}
              </Text>
            </Card>

            <View style={styles.actionButtons}>
              <Button
                title={t('security.approve')}
                onPress={handleApprove}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title={t('security.reject')}
                onPress={() => setShowRejectModal(true)}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const renderRejectModal = () => (
    <Modal
      visible={showRejectModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowRejectModal(false)}
    >
      <View style={styles.rejectModalOverlay}>
        <View style={[styles.rejectModalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.rejectModalTitle, { color: colors.text }]}>
            {t('security.rejection_reason')}
          </Text>

          {['fake_image', 'duplicate', 'irrelevant', 'low_quality', 'other'].map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonOption,
                { borderColor: colors.border },
                rejectReason === reason && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => setRejectReason(reason)}
            >
              <Text style={[styles.reasonText, { color: colors.text }]}>{t(`security.${reason}`)}</Text>
              {rejectReason === reason && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </TouchableOpacity>
          ))}

          {rejectReason === 'other' && (
            <TextInput
              style={[styles.customReasonInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder={t('security.custom_reason')}
              placeholderTextColor={colors.textSecondary}
              value={customReason}
              onChangeText={setCustomReason}
              multiline
            />
          )}

          <View style={styles.rejectModalButtons}>
            <Button
              title={t('common.cancel')}
              onPress={() => {
                setShowRejectModal(false);
                setRejectReason('');
                setCustomReason('');
              }}
              variant="secondary"
              style={styles.rejectModalButton}
            />
            <Button
              title={t('common.confirm')}
              onPress={handleReject}
              variant="primary"
              style={styles.rejectModalButton}
              disabled={!rejectReason || (rejectReason === 'other' && !customReason)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar />

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'flagged', 'pending', 'verified'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                { backgroundColor: filterStatus === status ? colors.primary : colors.surface },
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filterStatus === status ? '#fff' : colors.text },
                ]}
              >
                {status === 'all' ? t('security.all_status') : getStatusText(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={sortedSubmissions}
        renderItem={renderSubmissionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('security.no_submissions')}
            </Text>
          </View>
        }
      />

      {renderDetailModal()}
      {renderRejectModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  submissionCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
  },
  confidence: {
    fontSize: 12,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
  },
  fullImage: {
    width: '100%',
    height: 300,
  },
  detailSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userNameLarge: {
    fontSize: 18,
    fontWeight: '600',
  },
  userStats: {
    fontSize: 14,
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 80,
  },
  detailValue: {
    fontSize: 14,
    flex: 1,
  },
  aiDetails: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  rejectModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectModalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
  },
  rejectModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  reasonOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 14,
  },
  customReasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rejectModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  rejectModalButton: {
    flex: 1,
  },
});
