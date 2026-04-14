import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Clipboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/themeStore';
import { SecurityUser } from '@/types';
import {
  getSecurityUsers,
  createSecurityUser,
  banSecurityUser,
  unbanSecurityUser,
  redMarkSecurityUser,
  removeRedMarkSecurityUser,
  deleteSecurityUser,
} from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export default function SecurityUsersScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [users, setUsers] = useState<SecurityUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<SecurityUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{ userId: string; password: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<SecurityUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    assignedArea: '',
    district: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const data = await getSecurityUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load security users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredUsers(
      users.filter(
        u =>
          u.name.toLowerCase().includes(query) ||
          u.generatedId.toLowerCase().includes(query) ||
          u.assignedArea.toLowerCase().includes(query)
      )
    );
  };

  const handleCreateUser = async () => {
    if (!formData.name || !formData.phone || !formData.assignedArea || !formData.district) {
      Alert.alert(t('common.error'), 'Please fill all required fields');
      return;
    }

    try {
      const result = await createSecurityUser(formData);
      setNewCredentials({ userId: result.user.generatedId, password: result.password });
      setShowCreateModal(false);
      setShowCredentialsModal(true);
      setFormData({ name: '', phone: '', email: '', assignedArea: '', district: '' });
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to create user');
    }
  };

  const copyCredentials = () => {
    if (newCredentials) {
      const text = `User ID: ${newCredentials.userId}\nPassword: ${newCredentials.password}`;
      Clipboard.setString(text);
      Alert.alert(t('common.success'), 'Credentials copied to clipboard');
    }
  };

  const handleBan = async (user: SecurityUser) => {
    Alert.prompt(
      t('admin.ban_user'),
      t('admin.ban_days') + ' (leave empty for permanent)',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin.confirm_ban'),
          onPress: async (days?: string) => {
            try {
              await banSecurityUser(user.id, days ? parseInt(days) : undefined);
              loadUsers();
            } catch (error) {
              Alert.alert(t('common.error'), 'Failed to ban user');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleUnban = async (user: SecurityUser) => {
    try {
      await unbanSecurityUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to unban user');
    }
  };

  const handleRedMark = async (user: SecurityUser) => {
    try {
      await redMarkSecurityUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to red mark user');
    }
  };

  const handleRemoveRedMark = async (user: SecurityUser) => {
    try {
      await removeRedMarkSecurityUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to remove red mark');
    }
  };

  const handleDelete = async (user: SecurityUser) => {
    Alert.alert(
      t('admin.confirm_delete'),
      t('admin.delete_warning'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSecurityUser(user.id);
              loadUsers();
            } catch (error) {
              Alert.alert(t('common.error'), 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const getStatusBadge = (user: SecurityUser) => {
    if (user.banned) return <StatusBadge status="rejected" />;
    if (user.redMarked) return <StatusBadge status="pending" />;
    return <StatusBadge status="approved" />;
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
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, color: colors.text }]}
          placeholder={t('admin.search_users')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button
          title={t('admin.create_security_user')}
          onPress={() => setShowCreateModal(true)}
          style={styles.createButton}
        />
      </View>

      <ScrollView style={styles.list}>
        {filteredUsers.map(user => (
          <Card key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                <Text style={[styles.userId, { color: colors.textSecondary }]}>
                  {user.generatedId}
                </Text>
                <Text style={[styles.userArea, { color: colors.textSecondary }]}>
                  {user.assignedArea}
                </Text>
              </View>
              {getStatusBadge(user)}
            </View>

            <View style={styles.actions}>
              {user.banned ? (
                <TouchableOpacity onPress={() => handleUnban(user)} style={styles.actionButton}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    {t('admin.unban')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleBan(user)} style={styles.actionButton}>
                  <Ionicons name="ban" size={20} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>{t('admin.ban')}</Text>
                </TouchableOpacity>
              )}

              {user.redMarked ? (
                <TouchableOpacity
                  onPress={() => handleRemoveRedMark(user)}
                  style={styles.actionButton}
                >
                  <Ionicons name="close-circle" size={20} color={colors.primary} />
                  <Text style={[styles.actionText, { color: colors.primary }]}>
                    {t('admin.remove_red_mark')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleRedMark(user)} style={styles.actionButton}>
                  <Ionicons name="warning" size={20} color="#f59e0b" />
                  <Text style={[styles.actionText, { color: '#f59e0b' }]}>
                    {t('admin.red_mark')}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => handleDelete(user)} style={styles.actionButton}>
                <Ionicons name="trash" size={20} color="#ef4444" />
                <Text style={[styles.actionText, { color: '#ef4444' }]}>
                  {t('common.delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Create User Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('admin.create_security_user')}
            </Text>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder={t('admin.full_name')}
              placeholderTextColor={colors.textSecondary}
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder={t('admin.phone_number')}
              placeholderTextColor={colors.textSecondary}
              value={formData.phone}
              onChangeText={text => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder={t('admin.email')}
              placeholderTextColor={colors.textSecondary}
              value={formData.email}
              onChangeText={text => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder={t('admin.assigned_area')}
              placeholderTextColor={colors.textSecondary}
              value={formData.assignedArea}
              onChangeText={text => setFormData({ ...formData, assignedArea: text })}
            />

            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text }]}
              placeholder={t('admin.district')}
              placeholderTextColor={colors.textSecondary}
              value={formData.district}
              onChangeText={text => setFormData({ ...formData, district: text })}
            />

            <View style={styles.modalActions}>
              <Button
                title={t('common.cancel')}
                onPress={() => setShowCreateModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={t('admin.create')}
                onPress={handleCreateUser}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Credentials Modal */}
      <Modal visible={showCredentialsModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('admin.credentials_generated')}
            </Text>

            {newCredentials && (
              <View style={styles.credentialsBox}>
                <Text style={[styles.credentialLabel, { color: colors.textSecondary }]}>
                  {t('auth.user_id')}:
                </Text>
                <Text style={[styles.credentialValue, { color: colors.text }]}>
                  {newCredentials.userId}
                </Text>

                <Text style={[styles.credentialLabel, { color: colors.textSecondary }]}>
                  {t('auth.password')}:
                </Text>
                <Text style={[styles.credentialValue, { color: colors.text }]}>
                  {newCredentials.password}
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <Button
                title={t('admin.copy_credentials')}
                onPress={copyCredentials}
                style={styles.modalButton}
              />
              <Button
                title={t('common.close')}
                onPress={() => {
                  setShowCredentialsModal(false);
                  setNewCredentials(null);
                }}
                variant="outline"
                style={styles.modalButton}
              />
            </View>
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
    gap: 12,
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  createButton: {
    marginTop: 8,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 12,
    padding: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    marginBottom: 2,
  },
  userArea: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
  credentialsBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    marginVertical: 12,
  },
  credentialLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  credentialValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
