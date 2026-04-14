import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

interface OptimizedImageProps {
  source: string | { uri: string };
  style?: any;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholder?: string;
  transition?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  contentFit = 'cover',
  placeholder,
  transition = 300,
}) => {
  const blurhash = placeholder || 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

  return (
    <Image
      source={typeof source === 'string' ? { uri: source } : source}
      style={style}
      contentFit={contentFit}
      placeholder={blurhash}
      transition={transition}
      cachePolicy="memory-disk"
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
});
