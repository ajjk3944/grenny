const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBanglaNum = (num: number): string => {
  return num.toString().split('').map(digit => {
    if (digit >= '0' && digit <= '9') {
      return banglaDigits[parseInt(digit)];
    }
    return digit;
  }).join('');
};

export const formatNumber = (num: number, locale: string = 'bn'): string => {
  const formatted = new Intl.NumberFormat('en-US').format(num);
  return locale === 'bn' ? toBanglaNum(num) : formatted;
};

export const formatDate = (date: string, locale: string = 'bn-BD'): string => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (date: string, locale: string = 'bn-BD'): string => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPoints = (points: number, locale: string = 'bn'): string => {
  let formatted: string;
  if (points >= 1000000) {
    formatted = `${(points / 1000000).toFixed(1)}M`;
  } else if (points >= 1000) {
    formatted = `${(points / 1000).toFixed(1)}K`;
  } else {
    formatted = points.toString();
  }
  return locale === 'bn' ? toBanglaNum(parseFloat(formatted.replace(/[MK]/g, ''))) + formatted.replace(/[\d.]/g, '') : formatted;
};
