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
import { AdminMessage } from '@/types';
import {
  getAdminMessages,
  markMessageAsRead,
  resolveMessage,
  approveDeleteRequest,
  getSubmissionById,
} from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<AdminMessage[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'resolved'>('all');
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const loadMessages = async () => {
    try {
      const data = await getAdminMessages(filter);
      setMessages(data);
      setFilteredMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessagePress = async (message: AdminMessage) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    if (message.status === 'unread') {
      await markMessageAsRead(message.id);
      loadMessages();
    }
  };

  const handleResolve = async () => {
    if (!selectedMessage || !replyText.trim()) {
      Alert.alert(t('common.error'), 'Please enter a reply');
      return;
    }

    try {
      await resolveMessage(selectedMessage.id, replyText);
      setShowDetailModal(false);
      setReplyText('');
      setSelectedMessage(null);
      loadMessages();
      Alert.alert(t('common.success'), 'Message resolved');
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to resolve message');
    }
  };

  const handleApproveDelete = async () => {
    if (!selectedMessage) return;

    Alert.alert(
      t('admin.approve_delete'),
      'Are you sure you want to delete this submission?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin.approve_delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await approveDeleteRequest(selectedMessage.id);
              setShowDetailModal(false);
              setSelectedMessage(null);
              loadMessages();
              Alert.alert(t('common.success'), 'Delete request approved');
            } catch (error) {
              Alert.alert(t('common.error'), 'Failed to approve delete request');
            }
          },
        },
      ]
    );
  };

  const getMessageTypeIcon = (type: AdminMessage['type']) => {
    switch (type) {
      case 'delete_request':
        return '🗑️';
      case 'report':
        return '⚠️';
      default:
        return '💬';
    }
  };

  const getMessageTypeBadge = (type: AdminMessage['type']) => {
    const variant = type === 'delete_request' ? 'error' : type === 'report' ? 'warning' : 'primary';
    return <Badge text={t(`admin.${type}`)} variant={variant} />;
  };

  const getStatusBadge = (status: AdminMessage['status']) => {
    const variant = status === 'resolved' ? 'success' : status === 'read' ? 'warning' : 'error';
    return <Badge text={t(`admin.${status}`)} variant={variant} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {(['all', 'unread', 'resolved'] as const).map(filterOption => (
            <TouchableOpacity
              key={filterOption}
              onPress={() => setFilter(filterOption)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: filter === filterOption ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === filterOption ? '#fff' : colors.text,
                  },
                ]}
              >
                {t(`admin.${filterOption === 'all' ? 'all_messages' : filterOption}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.list}>
        {filteredMessages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('admin.no_messages')}
            </Text>
          </View>
        ) : (
          filteredMessages.map(message => (
            <TouchableOpacity
              key={message.id}
              onPress={() => handleMessagePress(message)}
              activeOpacity={0.7}
            >
              <Card
                style={[
                  styles.messageCard,
                  message.status === 'unread' && { borderLeftWidth: 4, borderLeftColor: colors.primary },
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.messageIcon}>{getMessageTypeIcon(message.type)}</Text>
                  <View style={styles.messageInfo}>
                    <View style={styles.messageTitleRow}>
                      <Text style={[styles.messageSubject, { color: colors.text }]} numberOfLines={1}>
                        {message.subject}
                      </Text>
                      {getStatusBadge(message.status)}
                    </View>
                    <Text style={[styles.messageFrom, { color: colors.textSecondary }]}>
                      {t('admin.from')}: {message.fromUserName}
                    </Text>
                    <View style={styles.messageMetaRow}>
                      {getMessageTypeBadge(message.type)}
                      <Text style={[styles.messageTime, { color: colors.textSecondary }]}>
                        {formatDate(message.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Message Detail Modal */}
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <ScrollView>
              {selectedMessage && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>
                      {selectedMessage.subject}
                    </Text>
                    <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                      <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalMeta}>
                    <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                      {t('admin.from')}:
                    </Text>
                    <Text style={[styles.metaValue, { color: colors.text }]}>
                      {selectedMessage.fromUserName}
                    </Text>
                  </View>

                  <View style={styles.modalMeta}>
                    <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>
                      {t('admin.type')}:
                    </Text>
                    {getMessageTypeBadge(selectedMessage.type)}
                  </View>

                  <View style={[styles.messageBody, { backgroundColor: colors.background }]}>
                    <Text style={[styles.bodyText, { color: colors.text }]}>
                      {selectedMessage.body}
                    </Text>
                  </View>

                  {selectedMessage.linkedSubmissionId && (
                    <View style={[styles.linkedSubmission, { backgroundColor: colors.background }]}>
                      <Text style={[styles.linkedLabel, { color: colors.textSecondary }]}>
                        {t('admin.linked_submission')}:
                      </Text>
                      <Text style={[styles.linkedId, { color: colors.primary }]}>
                        {selectedMessage.linkedSubmissionId}
                      </Text>
                    </View>
                  )}

                  {selectedMessage.status === 'resolved' && selectedMessage.adminReply && (
                    <View style={[styles.adminReply, { backgroundColor: colors.background }]}>
                      <Text style={[styles.replyLabel, { color: colors.textSecondary }]}>
                        {t('admin.reply')}:
                      </Text>
                      <Text style={[styles.replyText, { color: colors.text }]}>
                        {selectedMessage.adminReply}
                      </Text>
                    </View>
                  )}

                  {selectedMessage.status !== 'resolved' && (
                    <>
                      <TextInput
                        style={[
                          styles.replyInput,
                          { backgroundColor: colors.background, color: colors.text },
                        ]}
                        placeholder={t('admin.reply')}
                        placeholderTextColor={colors.textSecondary}
                        value={replyText}
                        onChangeText={setReplyText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />

                      <View style={styles.modalActions}>
                        {selectedMessage.type === 'delete_request' && (
                          <Button
                            title={t('admin.approve_delete')}
                            onPress={handleApproveDelete}
                            variant="outline"
                            style={styles.actionButton}
                          />
                        )}
                        <Button
                          title={t('admin.mark_resolved')}
                          onPress={handleResolve}
                          style={styles.actionButton}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
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
  filters: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
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
  messageCard: {
    marginBottom: 12,
    padding: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageIcon: {
    fontSize: 24,
  },
  messageInfo: {
    flex: 1,
  },
  messageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  messageFrom: {
    fontSize: 13,
    marginBottom: 6,
  },
  messageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  messageTime: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    flex: 1,
  },
  modalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  metaLabel: {
    fontSize: 14,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageBody: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  linkedSubmission: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  linkedLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  linkedId: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminReply: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  replyLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  replyInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 16,
    minHeight: 100,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
