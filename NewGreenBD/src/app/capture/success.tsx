import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { useSubmissionStore } from '@/store/submissionStore';

export default function SuccessScreen() {
  const router = useRouter();
  const { clearDraft } = useSubmissionStore();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Checkmark animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Clear draft after animation
    setTimeout(() => {
      clearDraft();
    }, 500);
  }, []);

  const handleReturnToDashboard = () => {
    router.replace('/(tabs)');
  };

  const handleSubmitAnother = () => {
    router.replace('/(tabs)/capture');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Animated Checkmark */}
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.checkmarkCircle}>
            <Ionicons name="checkmark" size={80} color={colors.light.background} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>আপনার জমা গ্রহণ করা হয়েছে!</Text>
          
          <View style={styles.verificationBox}>
            <View style={styles.spinnerContainer}>
              <Ionicons name="sync" size={20} color={colors.light.primary} />
            </View>
            <View>
              <Text style={styles.verificationText}>AI যাচাই চলছে...</Text>
              <Text style={styles.estimateText}>আনুমানিক ২-৫ মিনিট</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.light.primary} />
            <Text style={styles.infoText}>
              যাচাই সম্পন্ন হলে আপনি নোটিফিকেশন পাবেন এবং পয়েন্ট যোগ হবে
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleReturnToDashboard}
          >
            <Ionicons name="home" size={20} color={colors.light.background} />
            <Text style={styles.primaryButtonText}>ড্যাশবোর্ডে ফিরে যান</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSubmitAnother}
          >
            <Ionicons name="camera" size={20} color={colors.light.primary} />
            <Text style={styles.secondaryButtonText}>আরেকটি জমা দিন</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  checkmarkContainer: {
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  messageContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  verificationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.cardBackground,
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 16,
    gap: 12,
  },
  spinnerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  estimateText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: colors.light.text,
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: colors.light.background,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.light.primary,
    gap: 8,
  },
  secondaryButtonText: {
    color: colors.light.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
