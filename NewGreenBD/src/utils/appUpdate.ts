import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

export const checkForUpdates = async (): Promise<void> => {
  if (__DEV__) return;

  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      Alert.alert(
        'নতুন আপডেট উপলব্ধ',
        'একটি নতুন সংস্করণ উপলব্ধ। এখনই আপডেট করতে চান?',
        [
          {
            text: 'পরে',
            style: 'cancel',
          },
          {
            text: 'আপডেট করুন',
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            },
          },
        ]
      );
    }
  } catch (error) {
    console.error('Update check failed:', error);
  }
};

export const checkForMandatoryUpdate = async (): Promise<boolean> => {
  if (__DEV__) return false;

  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable && update.manifest?.extra?.mandatory) {
      Alert.alert(
        'আবশ্যক আপডেট',
        'চালিয়ে যেতে আপনাকে অ্যাপটি আপডেট করতে হবে।',
        [
          {
            text: 'আপডেট করুন',
            onPress: async () => {
              await Updates.fetchUpdateAsync();
              await Updates.reloadAsync();
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Mandatory update check failed:', error);
    return false;
  }
};
