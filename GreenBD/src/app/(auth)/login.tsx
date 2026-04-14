import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useLangStore } from '../../store/langStore';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Button } from '../../components/ui/Button';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLangStore((state) => state.lang);
  const toggleLang = useLangStore((state) => state.toggleLang);
  const colors = useThemeStore((state) => state.colors);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const loginWithFacebook = useAuthStore((state) => state.loginWithFacebook);
  const isLoading = useAuthStore((state) => state.isLoading);
  
  const [phone, setPhone] = useState('');
  const [versionTapCount, setVersionTapCount] = useState(0);
  const [logoLongPressTimer, setLogoLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleVersionTap = () => {
    const newCount = versionTapCount + 1;
    setVersionTapCount(newCount);
    
    if (newCount === 5) {
      setVersionTapCount(0);
      router.push('/(auth)/admin-login');
    }
    
    setTimeout(() => setVersionTapCount(0), 3000);
  };

  const handleLogoLongPress = () => {
    const timer = setTimeout(() => {
      router.push('/(auth)/security-login');
    }, 3000);
    setLogoLongPressTimer(timer);
  };

  const handleLogoRelease = () => {
    if (logoLongPressTimer) {
      clearTimeout(logoLongPressTimer);
      setLogoLongPressTimer(null);
    }
  };

  const handlePhoneNext = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert(t('common.error'), 'Please enter a valid phone number');
      return;
    }
    
    try {
      await requestOtp('+880' + phone);
      router.push({ pathname: '/(auth)/otp', params: { phone: '+880' + phone } });
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to send OTP');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      Alert.alert(t('common.error'), 'Google login failed');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error) {
      Alert.alert(t('common.error'), 'Facebook login failed');
    }
  };

  return (
    <LinearGradient
      colors={['#10b981', '#059669', '#047857']}
      style={styles.container}
    >
      <TouchableOpacity 
        style={styles.langToggle}
        onPress={toggleLang}
      >
        <Text style={styles.langText}>{lang === 'bn' ? 'EN' : 'বাং'}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Pressable
          onPressIn={handleLogoLongPress}
          onPressOut={handleLogoRelease}
          style={styles.logoContainer}
        >
          <Text style={styles.logo}>🌱</Text>
          <Text style={styles.appName}>{t('app_name')}</Text>
        </Pressable>

        <Text style={styles.welcome}>{t('auth.welcome')}</Text>
        <Text style={styles.subtitle}>{t('auth.welcome_message')}</Text>

        <View style={styles.form}>
          <Button
            title={t('auth.signup_google')}
            onPress={handleGoogleLogin}
            variant="outline"
            style={styles.socialButton}
            disabled={isLoading}
          />
          
          <Button
            title={t('auth.signup_facebook')}
            onPress={handleFacebookLogin}
            variant="outline"
            style={styles.socialButton}
            disabled={isLoading}
          />
          
          <Button
            title={t('auth.signup_phone')}
            onPress={() => {}}
            variant="outline"
            style={styles.socialButton}
            disabled={isLoading}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.phoneInput}>
            <Text style={styles.prefix}>+880</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.enter_phone')}
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Button
            title={t('auth.next')}
            onPress={handlePhoneNext}
            style={styles.nextButton}
            disabled={isLoading}
          />
        </View>
      </View>

      <TouchableOpacity onPress={handleVersionTap} style={styles.version}>
        <Text style={styles.versionText}>v1.0.0</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  langToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 12,
  },
  socialButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  nextButton: {
    marginTop: 8,
  },
  version: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  versionText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});
