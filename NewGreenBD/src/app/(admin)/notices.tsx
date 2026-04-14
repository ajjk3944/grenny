import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/themeStore';
import { Notice } from '@/types';
import { getNotices, createNotice } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';

export default function NoticesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    priority: 'normal' as 'normal' | 'important' | 'urgent',
    recipients: 'all_users' as 'all_users' | 'all_security' | 'district',
    recipientDistrict: '',
  });

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getNotices();
      setNotices(data);
    } catch (error) {
      console.error('Failed to load notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async () => {
    if (!formData.title.trim() || !formData.body.trim()) {
      Alert.alert(t('common.error'), 'Please fill all required fields');
      return;
    }

    if (formData.recipients === 'district' && !formData.recipientDistrict.trim()) {
      Alert.alert(t('common.error'), 'Please select a district');
      return;
    }

    try {
      const noticeData: Omit<Notice, 'id' | 'sentAt' | 'readCount'> = {
        title: formData.title,
        body: formData.body,
        priority: formData.priority,
        recipients: formData.recipients,
        ...(formData.recipients === 'district' && { recipientDistrict: formData.recipientDistrict }),
      };

      await createNotice(noticeData);
      setShowCreateModal(false);
      setFormData({
        title: '',
        body: '',
        priority: 'normal',
        recipients: 'all_users',
        recipientDistrict: '',
      });
      loadNotices();
      Alert.alert(t('common.success'), 'Notice sent successfully');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to send notice');
    }
  };

  const getPriorityBadge = (priority: Notice['priority']) => {
    const variant = priority === 'urgent' ? 'error' : priority === 'important' ? 'warning' : 'primary';
    return <Badge text={t(`admin.${priority}`)} variant={variant} />;
  };

  const getPriorityIcon = (priority: Notice['priority']) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'important':
        return '⚠️';
      default:
        return '📢';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Button
          title={t('admin.create_notice')}
          onPress={() => setShowCreateModal(true)}
          style={styles.createButton}
        />
      </View>

      <ScrollView style={styles.list}>
        {notices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('admin.no_notices')}
            </Text>
          </View>
        ) : (
          notices.map(notice => (
            <Card key={notice.id} style={styles.noticeCard}>
              <View style={styles.noticeHeader}>
                <Text style={styles.priorityIcon}>{getPriorityIcon(notice.priority)}</Text>
                <View style={styles.noticeInfo}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.noticeTitle, { color: colors.text }]} numberOfLines={2}>
                      {notice.title}
                    </Text>
                    {getPriorityBadge(notice.priority)}
                  </View>
                  <Text style={[styles.noticeBody, { color: colors.textSecondary }]} numberOfLines={3}>
                    {notice.body}
                  </Text>
                  <View style={styles.noticeMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="people" size={14} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {t(`admin.${notice.recipients}`)}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="eye" size={14} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {notice.readCount} {t('admin.read_count')}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.noticeDate, { color: colors.textSecondary }]}>
                    {t('admin.sent_at')}: {formatDate(notice.sentAt)}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Create Notice Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {t('admin.create_notice')}
                </Text>
                <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                placeholder={t('admin.notice_title')}
                placeholderTextColor={colors.textSecondary}
                value={formData.title}
                onChangeText={text => setFormData({ ...formData, title: text })}
              />

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                placeholder={t('admin.notice_body')}
                placeholderTextColor={colors.textSecondary}
                value={formData.body}
                onChangeText={text => setFormData({ ...formData, body: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <Text style={[styles.label, { color: colors.text }]}>{t('admin.priority')}</Text>
              <View style={styles.optionsRow}>
                {(['normal', 'important', 'urgent'] as const).map(priority => (
                  <TouchableOpacity
                    key={priority}
                    onPress={() => setFormData({ ...formData, priority })}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          formData.priority === priority ? colors.primary : colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: formData.priority === priority ? '#fff' : colors.text,
                        },
                      ]}
                    >
                      {t(`admin.${priority}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.text }]}>{t('admin.recipients')}</Text>
              <View style={styles.optionsColumn}>
                {(['all_users', 'all_security', 'district'] as const).map(recipient => (
                  <TouchableOpacity
                    key={recipient}
                    onPress={() => setFormData({ ...formData, recipients: recipient })}
                    style={[
                      styles.optionButtonFull,
                      {
                        backgroundColor:
                          formData.recipients === recipient ? colors.primary : colors.background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: formData.recipients === recipient ? '#fff' : colors.text,
                        },
                      ]}
                    >
                      {t(`admin.${recipient === 'district' ? 'by_district' : recipient}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {formData.recipients === 'district' && (
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
                  placeholder={t('admin.district')}
                  placeholderTextColor={colors.textSecondary}
                  value={formData.recipientDistrict}
                  onChangeText={text => setFormData({ ...formData, recipientDistrict: text })}
                />
              )}

              <View style={styles.modalActions}>
                <Button
                  title={t('common.cancel')}
                  onPress={() => setShowCreateModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <Button
                  title={t('admin.send')}
                  onPress={handleCreateNotice}
                  style={styles.modalButton}
                />
              </View>
            </ScrollView>
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
    padding: 16,
  },
  createButton: {
    marginBottom: 8,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
  noticeCard: {
    marginBottom: 12,
    padding: 16,
  },
  noticeHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityIcon: {
    fontSize: 24,
  },
  noticeInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  noticeBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  noticeMetaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  noticeDate: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 120,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  optionsColumn: {
    gap: 8,
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonFull: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
});
