import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImage(
  uri: string,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8 } = options;

  try {
    // Get image info
    const info = await FileSystem.getInfoAsync(uri);
    if (!info.exists) {
      throw new Error('Image file does not exist');
    }

    // Compress and resize
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      {
        compress: quality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('Image compression error:', error);
    return uri; // Return original if compression fails
  }
}

export async function compressVideo(uri: string): Promise<string> {
  // Video compression would require native modules or server-side processing
  // For now, return the original URI
  // TODO: Implement video compression using expo-video-thumbnails or server-side
  return uri;
}

export async function getMediaSize(uri: string): Promise<number> {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists && 'size' in info ? info.size : 0;
  } catch (error) {
    console.error('Get media size error:', error);
    return 0;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export async function getVideoDuration(uri: string): Promise<number> {
  // This would require expo-av or native modules
  // For now, return 0
  // TODO: Implement using expo-av
  return 0;
}
