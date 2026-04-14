import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const compressImage = async (uri: string, quality: number = 0.7): Promise<string> => {
  try {
    const manipResult = await manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: quality, format: SaveFormat.JPEG }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    return uri;
  }
};

export const getFileSize = async (uri: string): Promise<number> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};
