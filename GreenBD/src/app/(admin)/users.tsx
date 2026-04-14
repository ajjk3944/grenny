import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/store/themeStore';
import { User } from '@/types';
import {
  getGeneralUsers,
  banUser,
  unbanUser,
  redMarkUser,
  removeRedMarkUser,
} from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';

export default function UsersScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned' | 'red-marked'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [filterStatus]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    try {
      const filters = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      const data = await getGeneralUsers(filters);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
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
          u.phone?.toLowerCase().includes(query) ||
          u.district?.toLowerCase().includes(query)
      )
    );
  };

  const handleBan = async (user: User) => {
    Alert.prompt(
      t('admin.ban_user'),
      t('admin.ban_days') + ' (leave empty for permanent)',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin.confirm_ban'),
          onPress: async (days?: string) => {
            try {
              await banUser(user.id, days ? parseInt(days) : undefined);
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

  const handleUnban = async (user: User) => {
    try {
      await unbanUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to unban user');
    }
  };

  const handleRedMark = async (user: User) => {
    try {
      await redMarkUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to red mark user');
    }
  };

  const handleRemoveRedMark = async (user: User) => {
    try {
      await removeRedMarkUser(user.id);
      loadUsers();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to remove red mark');
    }
  };

  const getStatusBadge = (user: User) => {
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {(['all', 'active', 'banned', 'red-marked'] as const).map(status => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilterStatus(status)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    filterStatus === status ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filterStatus === status ? '#fff' : colors.text,
                  },
                ]}
              >
                {status === 'all' ? t('history.all') : t(`admin.${status.replace('-', '_')}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.list}>
        {filteredUsers.map(user => (
          <Card key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  {user.grade && <Badge text={user.grade} variant="success" />}
                </View>
                <Text style={[styles.userPhone, { color: colors.textSecondary }]}>
                  {user.phone}
                </Text>
                <Text style={[styles.userDistrict, { color: colors.textSecondary }]}>
                  {user.district}
                </Text>
                <View style={styles.statsRow}>
                  <Text style={[styles.statText, { color: colors.primary }]}>
                    ⭐ {user.points || 0} {t('admin.total_points_user')}
                  </Text>
                  {user.nidLinked && (
                    <Text style={[styles.statText, { color: colors.primary }]}>
                      ✓ NID
                    </Text>
                  )}
                </View>
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
            </View>
          </Card>
        ))}
      </ScrollView>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPhone: {
    fontSize: 14,
    marginBottom: 2,
  },
  userDistrict: {
    fontSize: 14,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 13,
    fontWeight: '500',
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
});
