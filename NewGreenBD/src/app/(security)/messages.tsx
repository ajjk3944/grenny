import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/themeStore';
import { useLang } from '../../store/langStore';
import { useAuthStore } from '../../store/authStore';
import { SecurityMessage } from '../../types';
import * as securityService from '../../services/security';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import TopBar from '../../components/TopBar';

export default function SecurityMessagesScreen() {
  const { colors } = useTheme();
  const { t } = useLang();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<SecurityMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SecurityMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    type: 'general' as 'general' | 'delete_request' | 'report',
    linkedSubmissionId: '',
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await securityService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!formData.subject || !formData.body) return;

    try {
      await securityService.sendMessage({
        toUserId: 'admin-1',
        subject: formData.subject,
        body: formData.body,
        type: formData.type,
        linkedSubmissionId: formData.linkedSubmissionId || undefined,
        status: 'pending',
      });
      setShowComposeModal(false);
      setFormData({
        subject: '',
        body: '',
        type: 'general',
        linkedSubmissionId: '',
      });
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.direction === filter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delete_request':
        return colors.error;
      case 'report':
        return colors.warning;
      default:
        return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'resolved' ? colors.success : colors.warning;
  };

  const renderMessageCard = ({ item }: { item: SecurityMessage }) => (
    <TouchableOpacity onPress={() => setSelectedMessage(item)}>
      <Card style={styles.messageCard}>
        <View style={styles.messageHeader}>
          <View style={styles.messageHeaderLeft}>
            <Ionicons
              name={item.direction === 'sent' ? 'send' : 'mail'}
              size={20}
              color={colors.primary}
            />
            <View style={styles.messageHeaderText}>
              <Text style={[styles.messageSubject, { color: colors.text }]} numberOfLines={1}>
                {item.subject}
              </Text>
              <Text style={[styles.messageFrom, { color: colors.textSecondary }]}>
                {item.direction === 'received' && item.fromUserName
                  ? `${t('admin.from')}: ${item.fromUserName}`
                  : t('security.sent')}
              </Text>
            </View>
          </View>
          <View style={styles.badges}>
            <Badge label={t(`admin.${item.type}`)} color={getTypeColor(item.type)} />
            <Badge label={t(`admin.${item.status}`)} color={getStatusColor(item.status)} />
          </View>
        </View>

        <Text style={[styles.messageBody, { color: colors.text }]} numberOfLines={2}>
          {item.body}
        </Text>

        <Text style={[styles.messageDate, { color: colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleString('bn-BD')}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={!!selectedMessage}
      animationType="slide"
      onRequestClose={() => setSelectedMessage(null)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setSelectedMessage(null)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{t('admin.message_detail')}</Text>
          <View style={{ width: 24 }} />
        </View>

        {selectedMessage && (
          <ScrollView style={styles.modalContent}>
            <Card style={styles.detailCard}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('admin.subject')}:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{selectedMessage.subject}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('admin.type')}:</Text>
                <Badge label={t(`admin.${selectedMessage.type}`)} color={getTypeColor(selectedMessage.type)} />
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{t('common.status')}:</Text>
                <Badge
                  label={t(`admin.${selectedMessage.status}`)}
                  color={getStatusColor(selectedMessage.status)}
                />
              </View>
            </Card>

            <Card style={styles.detailCard}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('security.message_body')}</Text>
              <Text style={[styles.messageBodyFull, { color: colors.text }]}>{selectedMessage.body}</Text>
            </Card>

            {selectedMessage.adminReply && (
              <Card style={styles.detailCard}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('admin.reply')}</Text>
                <Text style={[styles.messageBodyFull, { color: colors.text }]}>{selectedMessage.adminReply}</Text>
              </Card>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );

  const renderComposeModal = () => (
    <Modal
      visible={showComposeModal}
      animationType="slide"
      onRequestClose={() => setShowComposeModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setShowComposeModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{t('security.compose_message')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.message_type')}</Text>
            <View style={styles.typeRow}>
              {(['general', 'delete_request', 'report'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    { borderColor: colors.border },
                    formData.type === type && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text
                    style={[
                      styles.typeText,
                      { color: formData.type === type ? '#fff' : colors.text },
                    ]}
                  >
                    {t(`admin.${type}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.message_subject')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={t('security.message_subject')}
              placeholderTextColor={colors.textSecondary}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.message_body')}</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={t('security.message_body')}
              placeholderTextColor={colors.textSecondary}
              value={formData.body}
              onChangeText={(text) => setFormData({ ...formData, body: text })}
              multiline
              numberOfLines={6}
            />
          </View>

          {formData.type === 'delete_request' && (
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>{t('security.attach_submission')}</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="sub-123"
                placeholderTextColor={colors.textSecondary}
                value={formData.linkedSubmissionId}
                onChangeText={(text) => setFormData({ ...formData, linkedSubmissionId: text })}
              />
            </View>
          )}

          <Button
            title={t('admin.send')}
            onPress={handleSendMessage}
            variant="primary"
            style={styles.sendButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TopBar title={t('security.messages')} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar title={t('security.messages')} />

      <View style={styles.headerActions}>
        <Button
          title={t('security.compose_message')}
          onPress={() => setShowComposeModal(true)}
          variant="primary"
          icon={<Ionicons name="create" size={20} color="#fff" />}
        />
      </View>

      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'received', 'sent'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                { backgroundColor: filter === f ? colors.primary : colors.card },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: filter === f ? '#fff' : colors.text },
                ]}
              >
                {f === 'all' ? t('admin.all_messages') : t(`security.${f}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredMessages}
        renderItem={renderMessageCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="mail-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('security.no_messages')}
            </Text>
          </View>
        }
      />

      {renderDetailModal()}
      {renderComposeModal()}
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
  headerActions: {
    padding: 16,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  messageCard: {
    marginBottom: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  messageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  messageHeaderText: {
    flex: 1,
  },
  messageSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  messageFrom: {
    fontSize: 12,
  },
  badges: {
    gap: 4,
    alignItems: 'flex-end',
  },
  messageBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  messageDate: {
    fontSize: 12,
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
    padding: 16,
  },
  detailCard: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  messageBodyFull: {
    fontSize: 14,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sendButton: {
    marginTop: 20,
  },
});
