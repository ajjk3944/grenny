import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

interface PermissionScreenProps {
  type: 'camera' | 'location' | 'microphone';
  onRequestPermission: () => void;
}

const PERMISSION_INFO = {
  camera: {
    icon: 'camera-outline',
    title: 'ক্যামেরা অনুমতি প্রয়োজন',
    description: 'আপনার পরিবেশ বান্ধব কার্যক্রমের ছবি তুলতে ক্যামেরা অনুমতি দিন',
  },
  location: {
    icon: 'location-outline',
    title: 'লোকেশন অনুমতি প্রয়োজন',
    description: 'কার্যক্রমের স্থান যাচাই করতে লোকেশন অনুমতি দিন',
  },
  microphone: {
    icon: 'mic-outline',
    title: 'মাইক্রোফোন অনুমতি প্রয়োজন',
    description: 'ভয়েস ইনপুট ব্যবহার করতে মাইক্রোফোন অনুমতি দিন',
  },
};

export function PermissionScreen({ type, onRequestPermission }: PermissionScreenProps) {
  const info = PERMISSION_INFO[type];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={info.icon as any} size={80} color={colors.light.primary} />
        </View>

        <Text style={styles.title}>{info.title}</Text>
        <Text style={styles.description}>{info.description}</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onRequestPermission}>
          <Text style={styles.primaryButtonText}>অনুমতি দিন</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.secondaryButtonText}>সেটিংস খুলুন</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.light.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: colors.light.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
