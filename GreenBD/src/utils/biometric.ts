import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

export const biometric = {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    return hasHardware && isEnrolled;
  },

  async getSupportedTypes(): Promise<string[]> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types.map((type) => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          return 'fingerprint';
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          return 'face';
        case LocalAuthentication.AuthenticationType.IRIS:
          return 'iris';
        default:
          return 'unknown';
      }
    });
  },

  async authenticate(promptMessage?: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'প্রমাণীকরণ করুন',
        fallbackLabel: 'পাসওয়ার্ড ব্যবহার করুন',
        cancelLabel: 'বাতিল',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },
};
