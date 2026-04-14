import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../store/themeStore';
import { useLang } from '../../store/langStore';
import { useAuthStore } from '../../store/authStore';
import { SecurityUser } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import TopBar from '../../components/TopBar';

export default function SecurityProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLang();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState({
    newSubmissions: true,
    adminReplies: true,
    adminNotices: true,
    newUsers: false,
    deleteDecisions: true,
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const securityUser = user as SecurityUser;

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/security-login');
  };

  const handleChangePassword = () => {
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="fade"
      transparent
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {t('security.change_password')}
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Current Password"
              placeholderTextColor={colors.textSecondary}
              value={passwordForm.current}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, current: text })}
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="New Password"
              placeholderTextColor={colors.textSecondary}
              value={passwordForm.new}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, new: text })}
              secureTextEntry
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={passwordForm.confirm}
              onChangeText={(text) => setPasswordForm({ ...passwordForm, confirm: text })}
              secureTextEntry
            />
          </View>

          <View style={styles.modalButtons}>
            <Button
              title={t('common.cancel')}
              onPress={() => setShowPasswordModal(false)}
              variant="secondary"
              style={styles.modalButton}
            />
            <Button
              title={t('common.save')}
              onPress={handleChangePassword}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar title={t('security.profile')} />

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{securityUser.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{securityUser.name}</Text>
              <Text style={[styles.profileId, { color: colors.textSecondary }]}>
                {t('auth.user_id')}: {securityUser.generatedId}
              </Text>
              <Text style={[styles.profileArea, { color: colors.primary }]}>
                {t('security.assigned_area')}: {securityUser.assignedArea}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>156</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('security.total_reviews')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.success }]}>142</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('security.approvals')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.error }]}>14</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('security.rejections')}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.settings')}</Text>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('security.change_password')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {isDark ? t('profile.dark_mode') : t('profile.light_mode')}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomWidth: 0 }]}
            onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={20} color={colors.text} />
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t('profile.language')}
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {language === 'bn' ? 'বাংলা' : 'English'}
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('security.notification_preferences')}
          </Text>

          {Object.entries(notifications).map(([key, value]) => (
            <View key={key} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <Text style={[styles.settingText, { color: colors.text }]}>
                {t(`security.${key}`)}
              </Text>
              <Switch
                value={value}
                onValueChange={(val) => setNotifications({ ...notifications, [key]: val })}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </Card>

        <View style={styles.logoutContainer}>
          <Button
            title={t('profile.logout')}
            onPress={handleLogout}
            variant="danger"
            icon={<Ionicons name="log-out" size={20} color="#fff" />}
          />
        </View>
      </ScrollView>

      {renderPasswordModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileArea: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
});
