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
import { AreaTask, SecurityUser } from '../../types';
import * as securityService from '../../services/security';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import TopBar from '../../components/TopBar';

export default function SecurityTasksScreen() {
  const { colors } = useTheme();
  const { t } = useLang();
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<AreaTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    titleBn: '',
    titleEn: '',
    description: '',
    points: '',
    proofType: 'photo' as 'photo' | 'video' | 'both',
    category: '',
    active: true,
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const securityUser = user as SecurityUser;
      const data = await securityService.getAreaTasks(securityUser.assignedArea);
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!formData.titleBn || !formData.titleEn || !formData.points) return;

    try {
      const securityUser = user as SecurityUser;
      await securityService.createAreaTask({
        createdBy: user!.id,
        titleBn: formData.titleBn,
        titleEn: formData.titleEn,
        description: formData.description,
        points: parseInt(formData.points),
        proofType: formData.proofType,
        category: formData.category || 'সচেতনতা কার্যক্রম',
        active: formData.active,
        area: securityUser.assignedArea,
      });
      setShowAddModal(false);
      setFormData({
        titleBn: '',
        titleEn: '',
        description: '',
        points: '',
        proofType: 'photo',
        category: '',
        active: true,
      });
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const renderTaskCard = ({ item }: { item: AreaTask }) => (
    <Card style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.taskTitleRow}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{item.titleBn}</Text>
          <Badge
            label={item.active ? t('security.active') : t('security.inactive')}
            color={item.active ? colors.success : colors.textSecondary}
          />
        </View>
        <Text style={[styles.taskTitleEn, { color: colors.textSecondary }]}>{item.titleEn}</Text>
      </View>

      <Text style={[styles.taskDescription, { color: colors.text }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.taskMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="star" size={16} color={colors.warning} />
          <Text style={[styles.metaText, { color: colors.text }]}>
            {item.points} {t('dashboard.total_points')}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="camera" size={16} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]}>
            {item.proofType === 'both' ? t('security.both') : t(`security.${item.proofType}`)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="pricetag" size={16} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.text }]}>{item.category}</Text>
        </View>
      </View>

      <Text style={[styles.taskDate, { color: colors.textSecondary }]}>
        {new Date(item.createdAt).toLocaleDateString('bn-BD')}
      </Text>
    </Card>
  );

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setShowAddModal(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{t('security.add_new_task')}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('admin.category_name_bn')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="স্বাস্থ্য সেবা"
              placeholderTextColor={colors.textSecondary}
              value={formData.titleBn}
              onChangeText={(text) => setFormData({ ...formData, titleBn: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('admin.category_name_en')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="Health Service"
              placeholderTextColor={colors.textSecondary}
              value={formData.titleEn}
              onChangeText={(text) => setFormData({ ...formData, titleEn: text })}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.task_description')}</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder={t('security.task_description')}
              placeholderTextColor={colors.textSecondary}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.points_value')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="200"
              placeholderTextColor={colors.textSecondary}
              value={formData.points}
              onChangeText={(text) => setFormData({ ...formData, points: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('security.proof_type')}</Text>
            <View style={styles.proofTypeRow}>
              {(['photo', 'video', 'both'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.proofTypeButton,
                    { borderColor: colors.border },
                    formData.proofType === type && { backgroundColor: colors.primary },
                  ]}
                  onPress={() => setFormData({ ...formData, proofType: type })}
                >
                  <Text
                    style={[
                      styles.proofTypeText,
                      { color: formData.proofType === type ? '#fff' : colors.text },
                    ]}
                  >
                    {t(`security.${type}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{t('common.category')}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              placeholder="সচেতনতা কার্যক্রম"
              placeholderTextColor={colors.textSecondary}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
            />
          </View>

          <Button
            title={t('common.save')}
            onPress={handleCreateTask}
            variant="primary"
            style={styles.saveButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TopBar title={t('security.tasks')} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar title={t('security.tasks')} />

      <View style={styles.headerActions}>
        <Button
          title={t('security.add_new_task')}
          onPress={() => setShowAddModal(true)}
          variant="primary"
          icon={<Ionicons name="add" size={20} color="#fff" />}
        />
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="clipboard-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('security.no_tasks')}
            </Text>
          </View>
        }
      />

      {renderAddModal()}
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
  listContent: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 12,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  taskTitleEn: {
    fontSize: 14,
  },
  taskDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  taskMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
  taskDate: {
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
  proofTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  proofTypeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  proofTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 20,
  },
});
