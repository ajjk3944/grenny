import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { usePointsStore } from '../../store/pointsStore';
import { GradeBadge } from '../../components/dashboard/GradeBadge';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { totalPoints, grade, stats } = usePointsStore();
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=12');

  const menuItems = [
    {
      icon: 'gift',
      label: t('profile.menu.benefits'),
      route: '/benefits',
      color: colors.primary,
    },
    {
      icon: 'trophy',
      label: t('profile.menu.leaderboard'),
      route: '/leaderboard',
      color: '#FFD700',
    },
    {
      icon: 'flag',
      label: t('profile.menu.challenges'),
      route: '/challenges',
      color: '#FF6B6B',
    },
    {
      icon: 'map',
      label: t('profile.menu.greenmap'),
      route: '/greenmap',
      color: '#4ECDC4',
    },
    {
      icon: 'book',
      label: t('profile.menu.educational'),
      route: '/educational',
      color: '#95E1D3',
    },
    {
      icon: 'settings',
      label: t('profile.menu.settings'),
      route: '/profile/settings',
      color: colors.textSecondary,
    },
    {
      icon: 'help-circle',
      label: t('profile.menu.help'),
      route: '/help',
      color: colors.accent,
    },
  ];

  const handleChangePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logout_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logout'),
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={handleChangePhoto} style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={[styles.cameraIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="camera" size={20} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <Text style={styles.name}>
            {user?.name || 'আব্দুল করিম'}
          </Text>
          
          <Text style={styles.contact}>
            {user?.phone || '+880 1712-345678'}
          </Text>

          <View style={styles.nidBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
            <Text style={styles.nidText}>
              {t('profile.nid_linked')}
            </Text>
          </View>
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {totalPoints.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('profile.total_lifetime_points')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <GradeBadge grade={grade} size="large" />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('profile.current_grade')}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stats.totalActivities}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {t('profile.total_activities')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {t('profile.member_since')} জানুয়ারি ২০২৬
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              ঢাকা, ঢাকা বিভাগ
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: colors.error + '15' }]}>
              <Ionicons name="log-out" size={24} color={colors.error} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.error }]}>
              {t('profile.logout')}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  nidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nidText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  infoText: {
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 8,
  },
});
