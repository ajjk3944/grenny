import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

export const TopBar: React.FC = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Text style={[styles.logo, { color: colors.primary }]}>GreenBD</Text>
      
      <View style={styles.center}>
        <Text style={[styles.location, { color: colors.textSecondary }]}>
          {user?.district || 'ঢাকা'}, বাংলাদেশ
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.push('/profile')}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
