import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown, showAlert = true): string => {
  let message = 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে';

  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  if (showAlert) {
    Alert.alert('ত্রুটি', message);
  }

  console.error('Error:', error);
  return message;
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('Network') ||
      error.message.includes('network') ||
      error.message.includes('timeout') ||
      error.message.includes('ECONNREFUSED')
    );
  }
  return false;
};
