import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';

export default function OtpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const loginWithPhone = useAuthStore((state) => state.loginWithPhone);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      handleVerify();
    }
  }, [otp]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert(t('common.error'), 'Please enter complete OTP');
      return;
    }

    try {
      await loginWithPhone(phone, otpCode);
    } catch (error) {
      Alert.alert(t('common.error'), 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      await requestOtp(phone);
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to resend OTP');
    }
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      style={styles.container}
    >
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← {t('auth.back')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('auth.enter_otp')}</Text>
        
        <View style={styles.phoneContainer}>
          <Text style={styles.phoneLabel}>{t('auth.otp_sent_to')}</Text>
          <View style={styles.phoneRow}>
            <Text style={styles.phoneText}>{phone}</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editText}>{t('auth.edit_phone')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <Button
          title={t('auth.verify')}
          onPress={handleVerify}
          style={styles.verifyButton}
          disabled={isLoading || otp.some((d) => !d)}
        />

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>{t('auth.resend_otp')}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              {t('auth.resend_in')} {timer} {t('auth.seconds')}
            </Text>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 32,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  phoneContainer: {
    marginBottom: 32,
  },
  phoneLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#047857',
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  timerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
