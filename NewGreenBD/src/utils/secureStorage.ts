import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isAvailable = Platform.OS !== 'web';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (!isAvailable) {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    if (!isAvailable) {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    if (!isAvailable) {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
