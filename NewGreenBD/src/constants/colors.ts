export const lightTheme = {
  primary: '#006A4E',
  primaryLight: '#00875A',
  secondary: '#FFD700',
  accent: '#4FC3F7',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#5A5A7A',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#D32F2F',
  border: '#E0E0E0',
};

export const darkTheme = {
  primary: '#00875A',
  primaryLight: '#00A86B',
  secondary: '#FFD700',
  accent: '#4FC3F7',
  background: '#0D1F17',
  surface: '#1B3A2D',
  text: '#E8F5E9',
  textSecondary: '#A5D6A7',
  success: '#66BB6A',
  warning: '#FFB74D',
  error: '#EF5350',
  border: '#2E5A4A',
};

export const colors = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
